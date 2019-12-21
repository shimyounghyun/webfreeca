import Router from 'koa-router';
import token from '../../../lib/token';
import {loginLocal, needToken} from '../../../lib/passport';
import _ from 'fxjs/Strict';

const auth = new Router();



auth.post('/localLogin',loginLocal());

auth.post('/jwt', needToken());
module.exports = auth;