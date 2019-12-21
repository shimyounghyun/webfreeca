import passport from 'koa-passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as LocalStrategy} from 'passport-local'
import User from '../models/User';
import {createToken, decodeToken} from '../lib/token';

require('dotenv').config();

// 로컬 회원 가입
passport.use('join-local',new LocalStrategy({
    usernameField : 'id',
    passwordField : 'pw',
},async (id, pw, done) => {
    // DB에 중복되는 아이디가 있는지 확인
    const exists = await User.findExistancy({id});
    if(exists){        
        done(null, {id}, {message : '이미 존재하는 아이디입니다.', status : 409});
        return;
    }

    //회원 가입
    try{
        const user = await User.localRegister({id, pw})        
        done(null   ,user ,{message : '성공적으로 회원가입을 완료했습니다.', status : 200})
    }catch(e){
        console.log(e);
        done(null   ,false ,{message : '회원가입에 실패했습니다.', status : 500})
    }
}))

// 로컬 로그인
passport.use('login-local', new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw'
},
async (id, pw, done) => {
    try{
        const user = await User.findById(id);
        if(!user){        
            done(null, {id}, {message : '아이디가 존재하지 않습니다.', status : 500});
            return;
        }

        const authenticatePw = await user.authenticate(pw);        
        if(!authenticatePw){
            done(null, {id}, {message : '비밀번호가 일치하지 않습니다.', status : 500});
            return;
        }
        // 토큰 생성
        const token = await createToken(user.view(true),'user');
        done(null, user, {message : '로그인 성공', status : 200, token});
    }catch(e){
        console.log(e);
        done(null   ,false ,{message : '로그인에 실패했습니다.', status : 500})
    }

}
));

passport.use('need-token', new JwtStrategy({
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.JWT_SECRET
},async (jwtPayload, done) => {
    // 유저 정보가 없을 경우
    if(!jwtPayload){
        done(null   ,false  ,{message : '로그인이 필요한 서비스입니다.', status :403});
        return;
    }

    try{
        // 토큰 만료가 3시간 남았을 경우 새 토큰으로 교체
        if(jwtPayload.exp - jwtPayload.iat < 60 * 60 * 3){
            const freshToken = await createToken(jwtPayload, 'user');
            done(null ,freshToken ,{message : '토큰 교체', status:201} )
        }
        done(null ,true ,{message : '인증 성공', status:200} )
    }catch(e){
        console.log(e);
        done(null   ,false ,{message : '토큰 교체 실패', status:403})
    }    
}))

// successRedirect: '/main',
// failureRedirect: '/join',
// failureFlash: true

const joinLocal = () => (ctx) =>
    passport.authenticate('join-local',{session : false},(err, user, info) =>{
        if(info && info.status == 200){
            console.log('회원 가입 성공')    
        }else{
            console.log(info.message);
            ctx.status = info.status;
        }
    })(ctx)

const loginLocal = () => (ctx) =>
    passport.authenticate('login-local',{session : false},async (err, user, info) =>{
        if(info && info.status == 200){
            // 유저 정보 request에 담기
            ctx.login(user.view(true), {session : false});
            // 토큰 정보
            ctx.body = {token : info.token}
            console.log('로그인 성공',info.token);
        }else{
            console.log(info.message);
            ctx.status = info.status;
        }
    })(ctx)

const needToken = () => (ctx) =>
    passport.authenticate('need-token' ,{session : false} ,(err, user, info) =>{
        console.log(user);
        ctx.body = info.message
        if(info.status == 403){
            console.log('로그아웃됨');
            ctx.logout();
        }
    })(ctx)

module.exports = { joinLocal, loginLocal, needToken };
