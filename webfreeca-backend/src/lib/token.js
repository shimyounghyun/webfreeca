import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import _, { entries } from 'fxjs/Strict'

const {JWT_SECRET: secret} = process.env;

/**
 * 토큰 생성
 */
const createToken = (payload, subject) =>{    
    delete payload.iat;
    delete payload.exp;
    delete payload.iss;
    delete payload.sub;
    return new Promise(
            (resolve, reject) => {
                jwt.sign(
                    payload, 
                    secret, 
                    {
                        issuer: 'webfreeca',
                        expiresIn: '1d',
                        subject
                    }, 
                    (error, token) => error ? reject(error) : resolve(token)
                )
            }
        );
}

const decodeToken = (token) =>
        new Promise(
            (resolve, reject) => {
                jwt.verify(
                    token,
                    secret,
                    (error, decoded) => error ? reject(error) : resolve(decoded)
                )
            }
        )

module.exports = {createToken, decodeToken}