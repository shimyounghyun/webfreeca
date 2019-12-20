import Router from 'koa-router';
import userCtrl from './user.ctrl';
import {joinLocal} from '../../../lib/passport'

const user = new Router();

// 회원 등록
user.post('/register',joinLocal())

module.exports = user;