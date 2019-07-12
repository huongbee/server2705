const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    name: String,
    posts: [
        { type: Schema.Types.ObjectId, ref: 'post' }
        // post: collection name
    ],
    friends: [
        { type: Schema.Types.ObjectId, ref: 'user' }
    ],
    receiveRequests: [
        { type: Schema.Types.ObjectId, ref: 'user' }
    ],
    sendRequests: [
        { type: Schema.Types.ObjectId, ref: 'user' }
    ]
})
class User{
    static async signUp(email, name, password ){
        if(!email || email == '')
            throw new Error('Missing email!');
        if(!name || name == '')
            throw new Error('Missing name!');
        if(!password || password == '')
            throw new Error('Missing password!');
        const check = await UserModel.findOne({email})
        if(check) throw new Error('Email exists!')
        const user = await UserModel.create({
            email, name, password
        })
        if(!user) throw new Error('Something wrong!')
        return { 
            _id: user._id,
            name: user.name,
            email: user.email
        }
        
    }
}
const UserModel = mongoose.model('user', UserSchema);
module.exports = { UserModel, User }