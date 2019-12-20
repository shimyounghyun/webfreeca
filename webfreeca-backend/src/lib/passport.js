import passport from 'koa-passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as LocalStrategy} from 'passport-local'
import User from '../models/User';

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
        console.log("authen",authenticatePw);
        if(!authenticatePw){
            done(null, {id}, {message : '비밀번호가 일치하지 않습니다.', status : 500});
            return;
        }

        done(null, user, {message : '로그인 성공', status : 200});
    }catch(e){
        console.log(e);
        done(null   ,false ,{message : '로그인에 실패했습니다.', status : 500})
    }

}
));

passport.use('jwt', new JwtStrategy({
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.JWT_SECRET
},(jwtPayload, done) => {
    // 유저 정보로 일치하는 회원 찾기
    console.log(jwtPayload)
    return new Promise((resolve, reject)=>{
        resolve(true)
    })
    .then(result => result ?
        done(null   ,true  ,{message : 'login success'}) :
        done(null   ,false ,{message : 'login fail'})
    )
    .catch((err)=>done(err))
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
    passport.authenticate('login-local',{session : false},(err, user, info) =>{
        if(info && info.status == 200){
            console.log('로그인 성공');
        }else{
            console.log(info.message);
            ctx.status = info.status;
        }
    })(ctx)

const login = () => (ctx) =>
    passport.authenticate('jwt' ,{session : false} ,(err, user, info) =>{
        ctx.login(info, {session : false});        
        console.log(ctx.req.user);
    })(ctx)

module.exports = { joinLocal, loginLocal, login };
