const request = require('supertest');
const app = require('../app/routes');
const mongoose = require('mongoose');
const {sum} = require('../app/controller/todo.controller');


describe('check api', () => {

    //before all test cases run
    beforeAll((done) => {
        console.log('Jest starting!');
        mongoose.connect('mongodb://localhost:27017/testTodoApi');
        let db = mongoose.connection;
        db.on('error', (err) => {
            done.fail(err);
        });
        db.once('open', () => {
            done();
        });

    });

    let token = null;

    test('signup', async (done) => {
        const data = {
            "firstName": "test",
            "lastName": "user",
            "gender": true,
            "email": "testUser001@gmail.com",
            "userName": "testUser001",
            "password": "123"
        }
        try {
            const response = await request(app).post('/api/user').send(data).set("Accept", "application/json");
            expect(response.status).toEqual(200);
            expect(response.type).toEqual("application/json");
            done();
        }
        catch (e) {
            expect(e.status).toEqual(500);
            done();
        }
    });

    test('login', async (done) => {
        const data = {
            "userName": "testUser001",
            "password": "123"
        }
        const response = await request(app).post('/api/login').send(data).set("Accept", "application/json");
        token = response.body.token;
        expect(response.statusCode).toEqual(200);
        done();
    });

    //after all test cases run
    afterAll(async () => {
        try {
            const {users} = mongoose.connection.collections;
            // Collection is being dropped.
            await users.drop();
            await userlogins.drop();
            // Connection to Mongo killed.
            await mongoose.disconnect();
            // Server connection closed.
            await app.close();
        } catch (error) {
            console.log('closing after test');
            throw error;
        }
    });

});

