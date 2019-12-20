import Router from 'koa-router';
import userCtrl from './user.ctrl';

const user = new Router();


// 회원 등록
user.post('/register',userCtrl.localRegister)

module.exports = user;