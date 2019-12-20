import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import mongoose from 'mongoose';
import cors from 'koa-cors';
import passport from 'koa-passport';

require('dotenv').config();
const {
    PORT : port
    ,MONGO_URI : mongoURI
} = process.env;

const app = new Koa();

//---------------------
// 미들 웨어 설정
//---------------------
app.use(compress());
app.use(bodyParser());
app.use(cors());
app.use(passport.initialize());

//---------------------
// 서버 연결
//---------------------
mongoose.connect(process.env.MONGO_URI)
const db = mongoose.connection
db.on('error', console.error);
db.once('open', ()=>{
    console.log('connected to mongodb server')
});

//---------------------
// 라우터 연결
//---------------------
const router = new Router();
router.use('/api', require('./api').routes());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, ()=>{
    console.log(`start server`)
})