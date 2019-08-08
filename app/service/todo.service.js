'use strict';
const Todo = require('../model/Todo');
const commonHelper = require('../helper/common.helper');
const _ = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;

class TodoService {

  static async addTodo(data) {
    if (!data.body.task) {
      throw new Error('please pass all the required parameters');
    }
    let todo = new Todo(data.body);
    todo.userId = await commonHelper.getUserIdFromToken(data.headers.token);

    try {
      let result = await todo.save();
      if (!_.isEmpty(result)) {
        return result;
      }
      throw new Error('failed to add todo');

    }
    catch (err) {
      // Log Errors
      throw new Error(err.message || err);
    }
  }

  static async updateTodo(data) {
    try {
      let result = await Todo.findByIdAndUpdate(data.params.todoId, { $set: data.body });
      if (!_.isEmpty(result)) {
        return { message: 'updated successfully!' };
      }
      throw new Error('failed to update');

    }
    catch (err) {
      // Log Errors
      throw new Error(err.message || err);
    }
  }

  static async deleteTodo(data) {
    try {
      let result = await Todo.findByIdAndRemove(data.params.todoId);
      if (!_.isEmpty(result)) {
        return { message: 'deleted successfully!' };
      }
      throw new Error('failed to delete');

    }
    catch (err) {
      // Log Errors
      throw new Error(err.message || err);
    }
  }

  static async getAllTodoList() {

    let query = [
      {
        '$match': {}
      },
      {
        '$lookup': {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        '$unwind': '$user'
      },
      {
        '$project': {
          '_id': 0,
          '__v': 0,
          'created_at': 0,
          'updated_at': 0,
          'user._id': 0,
          'user.__v': 0,
          'user.created_at': 0,
          'user.updated_at': 0
        }
      }
    ];

    try {
      let results = await Todo.aggregate(query);
      if (!_.isEmpty(results)) {
        return results;
      }
      throw new Error('nothing found!');

    }
    catch (err) {
      // Log Errors
      throw new Error(err.message || err);
    }
  }

  static async getTodoListByUserId(data) {

    let query = [
      {
        '$match': {
          'userId': ObjectId(data.params.userId)
        }
      },
      {
        '$lookup': {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        '$unwind': '$user'
      },
      {
        '$project': {
          '_id': 0,
          '__v': 0,
          'created_at': 0,
          'updated_at': 0,
          'user._id': 0,
          'user.__v': 0,
          'user.created_at': 0,
          'user.updated_at': 0
        }
      }
    ];

    try {
      let results = await Todo.aggregate(query);
      if (!_.isEmpty(results)) {
        return results;
      }
      throw new Error('nothing found!');

    }
    catch (err) {
      // Log Errors
      throw new Error(err.message || err);
    }
  }
}

module.exports = TodoService;
