const todoService = require('../service/todo.service');

//add todoItem
module.exports.addTodo = async (req, res) => {
    try {
        let response = await todoService.addTodo(req);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err.message || err);
    }
}

//update by todoId
module.exports.updateTodo = async (req, res) => {
    try {
        let response = await todoService.updateTodo(req);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err.message || err);
    }
}

//delete by todoId
module.exports.deleteTodo = async (req, res) => {
    try {
        let response = await todoService.deleteTodo(req);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err.message || err);
    }
}

//get all todoItems
module.exports.getAllTodoList = async (req, res) => {
    try {
        let response = await todoService.getAllTodoList(req);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err.message || err);
    }
}

//get todoItem by UserId
module.exports.getTodoListByUserId = async (req, res) => {
    try {
        let response = await todoService.getTodoListByUserId(req);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err.message || err);
    }
}
