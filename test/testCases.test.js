process.env.NODE_ENV = 'test';

const app = require('../app/routes');
const mongoose = require('mongoose');
require('dotenv').config();
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

const userService = require('../app/service/user.service');

// Configure chai
chai.use(chaiHttp);

describe('Rest Api Testing', () => {

    let token = null;

    //Before all test we empty the database
    before((done) => {
        console.log('Test Starting!');

        function clearCollections() {
            for (let collection in mongoose.connection.collections) {
                mongoose.connection.collections[collection].deleteOne(function () {
                });
            }
            return done();
        }

        mongoose.connect('mongodb://localhost:27017/testTodoApi', {
            useCreateIndex: true,
            useNewUrlParser: true
        });
        let db = mongoose.connection;
        db.on('error', (err) => {
            done.fail(err);
        });
        db.once('open', () => {
            clearCollections();
        });
    });


    it('test connection', (done) => {
        chai.request(app)
            .get('/api/testConnection')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('user signup', (done) => {
        let data = {
            "firstName": "test11",
            "lastName": "user11",
            "gender": true,
            "email": "testuser11@xxx.com",
            "userName": "testuser11",
            "password": "123"
        }
        chai.request(app)
            .post('/api/user')
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('user login', (done) => {
        let data = {
            "userName": "testuser11",
            "password": "123"
        };
        chai.request(app)
            .post('/api/login')
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                token = res.body.token || '';
                done();
            });
    });

    it('add user task', (done) => {
        let data = {
            "task": "task001"
        };
        chai.request(app)
            .post('/api/todo')
            .send(data)
            .set('Accept', 'application/json')
            .set('token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    })


    //disconnect DB after all test cases
    after(function (done) {
        mongoose.modelSchemas = {};
        mongoose.connection.close();
        done();
    });

})
;
