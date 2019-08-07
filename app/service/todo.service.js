const Todo = require('../model/Todo');
const fetch = require("cross-fetch");
const commonHelper = require('../helper/common.helper');
const _ = require('lodash');

/*class TodoService {

}
module.exports = TodoService;*/

module.exports.addTodo = async (data) => {
    if (!data.body.task) {
        return Promise.resolve({auth: false, message: 'please pass all the required parameters'});
    }
    let todo = new Todo(data.body);
    todo.userId = await commonHelper.getUserIdFromToken(data.headers.token);
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

module.exports.getAllTodoList = async () => {

    let query = [
        {
            "$match": {}
        },
        {
            "$lookup": {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            "$unwind": "$user"
        },
        {
            "$project": {
                "_id": 0,
                "__v": 0,
                "created_at": 0,
                "updated_at": 0,
                "user._id": 0,
                "user.__v": 0,
                "user.created_at": 0,
                "user.updated_at": 0,
            }
        }
    ];

    try {
        let results = await Todo.aggregate(query);
        if (!_.isEmpty(results)) {
            return results;
        } else {
            throw  new Error('nothing found!');
        }
    } catch (err) {
        return err.message || err;
    }

}

module.exports.getTodoListByUserId = async (data) => {
    return new Promise((resolve, reject) => {
        Todo.find({'userId': data.params.userId}, '-created_at -updated_at -__v').populate({
            path: "userId",
            model: "User",
            select: ['firstName', 'lastName']
        }).exec((err, todos) => {
            if (err) {
                reject(new Error('failed to get todos'));
            } else {
                resolve(todos);
            }
        });
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
