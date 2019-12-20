import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import crypto from 'crypto';

const {PASSWORD_HASH_KEY : salt} = process.env;

const hash = password => crypto.createHmac('sha256',salt).update(password).digest('hex');

const User = new Schema({
    id : {
        type : String,
        required: true
    },
    pw : {
        type : String,
        required: true
    },
    stationName : {
        type: String,
        required : false
    },
    createdAt : {
        type: Date,
        default: Date.now
    }
})

User.statics.findById = id => {
    return this.findOne({id}).exec();
}

User.statics.localRegister = async function({id, pw}){
    const user = new this({
        id,
        pw
    })

    return user.save();
}


// const model = mongoose.model('User', User);
// export const schema = model.schema
// export default model
module.exports = mongoose.model('User', User);