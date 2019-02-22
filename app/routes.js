const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {authenticateToken} = require('./middleware/auth.middleware');

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({extended: true}));

/*********************************************** load Controller ******************************************************/
const authController = require('./controller/auth.controller');
const userController = require('./controller/user.controller');
const todoController = require('./controller/todo.controller');


/**************************************** middleware for token authentication ******************************************/
function isAuthenticated(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).send({auth: false, message: 'No token provided.'});
    }
    else {
        authenticateToken(req, res, next);
    }
}

//check server connection
app.get('/api/testConnection', function (req, res) {
    res.json({"message": "Connection Successful!"});
})

/*********************************************** authController ******************************************************/
//user authentication login/logout
app.get('/api/getUserSession', isAuthenticated, authController.getUserSession);
app.post('/api/login', authController.authenticateUser);
app.post('/api/logout', isAuthenticated, authController.logout);
app.post('/api/logoutAllDevices', isAuthenticated, authController.logoutAllDevices);


/*********************************************** userController ******************************************************/
//user routes
app.post('/api/user', userController.signUp);
app.post('/api/resetPassword', userController.resetPassword);
app.post('/api/updatePassword', isAuthenticated, userController.changePassword);


/*********************************************** todoController ******************************************************/
// todoItem routes
app.route('/api/todo')
    .post(isAuthenticated, todoController.addTodo)
    .get(isAuthenticated, todoController.getAllTodoList)

app.route('/api/todo/:todoId')
    .put(isAuthenticated, todoController.updateTodo)
    .delete(isAuthenticated, todoController.deleteTodo)

app.route('/api/todo/:userId')
    .get(isAuthenticated, todoController.getTodoListByUserId);

//for other service call
app.route('/api/getThirdPartyUsersList')
    .get(isAuthenticated, todoController.getThirdPartyUsersList);

module.exports = app
