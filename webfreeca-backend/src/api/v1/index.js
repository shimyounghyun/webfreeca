import Router from 'koa-router';
const auth = require('./auth').routes();
const user = require('./user').routes();

const api = new Router;
api.use('/auth',auth);
api.use('/user',user);


module.exports = api;