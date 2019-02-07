const {addTodo, updateTodo, deleteTodo, getAllTodoList, getTodoListByUserId, getThirdPartyUsersList} = require('../service/todo.service');

//add todoItem
module.exports.addTodo = (req, res) => {
    try {
        addTodo(req).then((response) => {
            res.status(200).json(response);
        });
    } catch (e) {
        res.status(500).json(e.message);
    }
}

//update by todoId
module.exports.updateTodo = (req, res) => {
    try {
        updateTodo(req).then((response) => {
            res.status(200).json(response);
        });
    } catch (e) {
        res.status(500).json(e.message);
    }
}

//delete by todoId
module.exports.deleteTodo = (req, res) => {
    try {
        deleteTodo(req).then((response) => {
            res.status(200).json(response);
        });
    } catch (e) {
        res.status(500).json(e.message);
    }
}

//get all todoItems
module.exports.getAllTodoList = (req, res) => {
    try {
        getAllTodoList(req).then((response) => {
            res.status(200).json(response);
        });
    } catch (e) {
        res.status(500).json(e.message);
    }
}

//get todoItem by UserId
module.exports.getTodoListByUserId = (req, res) => {
    try {
        getTodoListByUserId(req).then((response) => {
            res.status(200).json(response);
        });
    } catch (e) {
        res.status(500).json(e.message);
    }
}

//for third party call
module.exports.getThirdPartyUsersList = (req, res) => {
    try {
        getThirdPartyUsersList().then((response) => {
            res.status(200).json(response);
        });
    } catch (e) {
        res.status(500).json(e.message);
    }
}