const Todo = require('../model/Todo');
const fetch = require("cross-fetch");
const utility = require('./utility.service');


module.exports.addTodo = async (data) => {
    let todo = new Todo(data.body);
    todo.userId = await utility.getUserIdFromToken(data.headers.token);
    return new Promise((resolve, reject) => {
        todo.save((err, todo) => {
            if (err) {
                reject(new Error('failed to add todo'));
            } else {
                resolve({data: todo.task, message: 'added successfully!'});
            }
        });
    })
}

module.exports.updateTodo = async (data) => {
    return new Promise((resolve, reject) => {
        Todo.findByIdAndUpdate(data.params.todoId, {$set: data.body}, (err, todo) => {
            if (err) {
                reject(new Error('failed to update'));
            } else {
                resolve({message: 'updated successfully!'});
            }
        })
    })
}

module.exports.deleteTodo = async (data) => {
    return new Promise((resolve, reject) => {
        Todo.findByIdAndRemove(data.params.todoId, (err, todo) => {
            if (err) {
                reject(new Error('failed to delete'));
            } else {
                resolve({message: 'deleted successfully!'});
            }
        })
    })
}

module.exports.getAllTodoList = async (data) => {
    return new Promise((resolve, reject) => {
        Todo.find({}, (err, todos) => {
            if (err) {
                reject(new Error('failed to get todos'));
            } else {
                resolve(todos);
            }
        })
    })
}

module.exports.getTodoListByUserId = async (data) => {
    return new Promise((resolve, reject) => {
        Todo.find({'userId': data.params.userId}, (err, todo) => {
            if (err) {
                reject(new Error('failed to get todos'));
            } else {
                resolve(todo);
            }
        })
    })
}

module.exports.getThirdPartyUsersList = async () => {
    return new Promise((resolve, reject) => {
        const userApi = "https://jsonplaceholder.typicode.com/users";
        fetch(userApi, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then((data) => {
                    resolve(data);
                },
                (error) => {
                    reject(new Error('failed to fetch'));
                })
            .catch(error => {
                reject(new Error('failed to fetch'));
            })
    })
}