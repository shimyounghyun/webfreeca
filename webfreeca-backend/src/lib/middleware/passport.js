import passport from 'koa-passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as LocalStrategy} from 'passport-local'
import User from '../../models/User';

require('dotenv').config();


passport.use('local',new LocalStrategy({
    usernameField : 'id',
    passwordField : 'pw'
},(id, pw, done) => {
    // DB 유저 정보와 일치하는지 체크
    return new Promise((resolve,reject)=>{
        resolve(true)
    })
    .then(result => result ?
        done(null   ,true  ,{message : 'login success'}) :
        done(null   ,false ,{message : 'login fail'})
    )
    .catch((err)=>done(err))
}))

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


const login = () => (ctx) =>
    passport.authenticate('jwt' ,{session : false} ,(err, user, info) =>{
        ctx.login(info, {session : false});        
        console.log(ctx.req.user);
    })(ctx)

module.exports = { login };
