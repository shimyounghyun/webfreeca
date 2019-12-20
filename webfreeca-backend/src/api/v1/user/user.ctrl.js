import User from '../../../models/User';

const localRegister = async (ctx) => {
    const {id, pw} = ctx.request.body;

    try{
        const user = await User.localRegister({id, pw})

        
    }catch(e){
        console.log(e);

    }
}

module.exports = {localRegister}