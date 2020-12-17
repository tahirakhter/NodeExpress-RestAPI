'use strict';
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swarggerUI = require('swagger-ui-express');
const { authenticateToken } = require('./middleware/auth.middleware');

// for allowing cross origin requests
app.use(cors());

// allow OPTIONS on all resources
app.options('*', cors());

// support parsing of application/json type post data
app.use(bodyParser.json());

// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));


// swagger documentation
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      tilte: 'Node RESTApis Documentation',
      description: 'Node RESTApis Documentation',
      contact: {
        name: 'Developer'
      },
      servers: ['http://localhost:8800/'],
      tags: [{
        name: 'User',
        description: 'User Apis'
      },
      {
        name: 'Todo',
        description: 'Todo Apis'
      }]
    }
  },
  apis: ['app/routes.js']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api/docs', swarggerUI.serve, swarggerUI.setup(swaggerDocs));

/** ********************************************* load Controller ******************************************************/
const authController = require('./controller/auth.controller');
const userController = require('./controller/user.controller');
const todoController = require('./controller/todo.controller');

/** ************************************** middleware for token authentication ******************************************/
function isAuthenticated(req, res, next) {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }
  authenticateToken(req, res, next);
}

// check server connection
app.get('/api/testConnection', function (req, res) {
  res.json({ 'message': 'Connection Successful!' });
});

/** ********************************************* authController ******************************************************/
app.get('/api/getUserSession', isAuthenticated, authController.getUserSession);

/**
 * @swagger
 * /api/login:
 *  post:
 *    tags : ["User"]
 *    summary: "Login User"
 *    description: "Login User"
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    parameters:
 *     - name: "body"
 *       in: "body"     
 *       description: "data to login User"
 *       required: true
 *    responses:
 *      "200":
 *        description: "User loggedin successfully!"
 * 
*/
app.post('/api/login', authController.authenticateUser);
app.post('/api/logout', isAuthenticated, authController.logout);
app.post('/api/logoutAllDevices', isAuthenticated, authController.logoutAllDevices);

/** ********************************************* userController ******************************************************/

/**
 * @swagger
 * /api/user:
 *  post:
 *    tags : ["User"]
 *    summary: "Create User"
 *    description: "Create User"
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    parameters:
 *     - name: "body"
 *       in: "body"     
 *       description: "Data to create User"
 *       required: true
 *    responses:
 *      "200":
 *        description: "User created successfully!"
 * 
*/
app.post('/api/user', userController.signUp);
app.post('/api/resetPassword', userController.resetPassword);
app.post('/api/updatePassword', isAuthenticated, userController.changePassword);

/** ********************************************* todoController ******************************************************/

/**
 * @swagger
 * /api/todo:
 *  get:
 *    tags : ["Todo"]
 *    summary: "Get todo list"
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    parameters:
 *     - name: "token" 
 *       in: "header"
 *       description: "token for authenrication"
 *       required: true
 *       type: "string"
 *    responses:
 *      "200":
 *        description: "List of Todo items"
 *  post:
 *    tags : ["Todo"]
 *    summary: "Add new todo"
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    parameters:
 *     - name: "token" 
 *       in: "header"
 *       description: "token for authenrication"
 *       required: true
 *       type: "string"
 *     - name: "body"
 *       in: "body"
 *       description: "Todo object to add new Todo"
 *       required: true
 *    responses:
 *      "200":
 *        description: "New task added successfully!"
 * 
*/
app.route('/api/todo')
  .post(isAuthenticated, todoController.addTodo)
  .get(isAuthenticated, todoController.getAllTodoList);


/**
 * @swagger
 * /api/todo/{todoId}:
 *  put:
 *    tags : ["Todo"]
 *    summary: "Update todo"
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    parameters:
 *     - name: "token" 
 *       in: "header"
 *       description: "token for authenrication"
 *       required: true
 *       type: "string"
 *     - name: "todoId"
 *       in: "path"     
 *       description: "ID to find and update todo"
 *       required: true
 *       type: "integer"
 *       format: "int64"    
 *     - name: "task"
 *       in: "formData"    
 *       description: "task to update"
 *       required: true
 *       type: "string"
 *    responses:
 *      "200":
 *        description: "Todo updated successfully!"
 *  delete:
 *    tags : ["Todo"]
 *    summary: "Delete todo"
 *    consumes: "application/json"
 *    produces: "application/json"
 *    parameters:
 *     - name: "token" 
 *       in: "header"
 *       description: "token for authenrication"
 *       required: true
 *       type: "string"
 *     - name: "todoId"
 *       in: "path"     
 *       description: "ID to find and delete todo"
 *       required: true
 *       type: "integer"
 *       format: "int64" 
 *    responses:
 *      "200":
 *        description: "Todo deleted successfully!"
 * 
*/
app.route('/api/todo/:todoId')
  .put(isAuthenticated, todoController.updateTodo)
  .delete(isAuthenticated, todoController.deleteTodo);

app.route('/api/todo/:userId')
  .get(isAuthenticated, todoController.getTodoListByUserId);

module.exports = app;
