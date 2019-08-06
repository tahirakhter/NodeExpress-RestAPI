# NodeExpress-RESTApi
Project for Node RestAPI using Express Framework, JWT, REST Services, Multi Device Login, MVC, MongoDB and Jest for Test

## Api
 * Signup => POST: http:localhost:8080/api/user
 * Login => POST: http:localhost:8080/api/login
 * Logout => POST: http:localhost:8080/api/logout
 * LogoutAllDevices => POST: http:localhost:8080/api/logoutAllDevices
 * Check User Session => GET: http:localhost:8080/api/getUserSession
 * ResetPassword => POST: http:localhost:8080/api/resetPassword
 * UpdatePassword => POST: http:localhost:8080/api/updatePassword
 
 * Add Todo => POST: http:localhost:8080/api/todo
 * Get Todos List => GET: http:localhost:8080/api/todo
 * Get User Todo List => GET: http:localhost:8080/api/todo/:userId
 * Update Todo => PUT: http:localhost:8080/api/todo/:todoId
 * Delete Todo => DELETE: http:localhost:8080/api/todo/:todoId

## Steps

* install mongodb locally OR set db path in app/config/db.js
* create user => POST: http:localhost:8080/api/user
*    data: {
          "firstName":"test",
          "lastName":"user",
          "gender":true,
          "email":"testuser@xxx.com",
          "userName":"testuser",
          "password":"123"
        }
 * signIn => POST: http:localhost:8080/api/login
 *    data:{
          "userName":"testuser"
          "password":"123"
       }
 * add todo => POST: http:localhost:8080/api/todo
 *    data:{
          "task":"testuser task 001"
        }
      headers:{
          "token":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }
 *....
