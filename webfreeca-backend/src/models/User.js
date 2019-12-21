import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt-nodejs';
import {createToken} from '../lib/token';

const {PASSWORD_HASH_KEY : salt} = process.env;

// const hash = password => crypto.createHmac('sha256',salt).update(password).digest('hex');

const User = new Schema({
    id : {
        type : String,
        required: true
    },
    pw : {
        type : String,
        required: true
    },
    userName: String,
    stationName : {
        type: String,
        required : false
    },
    createdAt : {
        type: Date,
        default: Date.now
    }
})

User.statics.findById = function(id){
    return this.findOne({id}).exec();
}


User.statics.localRegister = async function({id, pw}){
    const Obj = this;
    bcrypt.hash(pw, null, null, function(err, hash) {
        const user = new Obj({
            id,
            pw : hash
        })
        if (err) throw err;
        return user.save();
    });
}

User.statics.findExistancy = function({id,userName}){

    return this.findOne({
        $or:[
            {id},
            {userName}
        ]
    }).exec();
}

User.methods = {
    view(full) {
        let view = {};
        let fields = ['id','userName','stationName']
        if(full){
            fields = [...fields, 'createdAt']
        }
        fields.forEach((field) => { view[field] = this[field] })

        return view
    },
    authenticate(pw){
        return bcrypt.compareSync(pw, this.pw);
    },
    async generateToken(){
        return await createToken(this.view(true),'user')
    }
    
}


// const model = mongoose.model('User', User);
// export const schema = model.schema
// export default model
module.exports = mongoose.model('User', User);