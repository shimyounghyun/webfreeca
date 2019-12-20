import Router from 'koa-router';
import token from '../../../lib/token';
import {login} from '../../../lib/middleware/passport';
import _ from 'fxjs/Strict';

const auth = new Router();



auth.get('/check',async (ctx, next)=>{

    _.go(
        await token.createToken({userId:'hello',password:'yes'},'joi'),
        (t) => {ctx.body = t; console.log(t)}
    )

    // token.createToken({userId:'hello',password:'yes'},'joi').then(r=>{return {'token':r}});
    // console.log(p);
    // res.json(p);
})

auth.get('/jwt', login());
module.exports = auth;