import Router from 'koa-router';
import token from '../../../lib/token';
import {loginLocal, login} from '../../../lib/passport';
import _ from 'fxjs/Strict';

const auth = new Router();



auth.post('/localLogin',loginLocal());

auth.post('/jwt', login());
module.exports = auth;