const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { hash, compare } = require('../helpers/bcrypt') 
const { sign, verify } = require('../helpers/jwt');

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
        
        const passwordHash = await hash(password)
        if(!passwordHash) throw new Error('Something wrong!')

        const user = await UserModel.create({
            email, name, password: passwordHash
        })
        if(!user) throw new Error('Something wrong!')
        return { 
            _id: user._id,
            name: user.name,
            email: user.email
        }
        
    }
    static async signIn(email, password){
        if(!email || email == '')
            throw new Error('Missing email!');
        if(!password || password == '')
            throw new Error('Missing password!');
        const user = await UserModel.findOne({email})
        if(!user) throw new Error('Can not find user!');
        const check = await compare(password, user.password)
        if(!check) throw new Error('Password invalid!');
        const token = await sign({ _id: user._id })
        if(!token) throw new Error('Something wrong!');
        return {
            user: { 
                _id: user._id,
                name: user.name,
                email: user.email
            },
            token
        }
    }
    //idSender: id user logged in
    static async sendFriendRequest(idSender, idReceiver){
        if(!idSender || idSender == '')
            throw new Error('Missing sender!');
        if(!idReceiver || idReceiver == '')
            throw new Error('Missing receiver!');
        if(idSender===idReceiver)
            throw new Error('Error!');
        if(!mongoose.Types.ObjectId.isValid(idReceiver) || !mongoose.Types.ObjectId.isValid(idSender))
            throw new Error('User id invalid!');
        const receiver = await UserModel.findById(idReceiver);
        if(!receiver) throw new Error('Can not find user')
        const sender = await UserModel.findByIdAndUpdate(
            idSender,
            { $addToSet: { sendRequests: receiver._id } },
            { new: true }
        )
        if(!sender) throw new Error('Can not update sender')
        const otherUser = await UserModel.findByIdAndUpdate(
            receiver._id,
            { $addToSet:{ receiveRequests: sender._id } },
            { new: true }
        )
        if(!otherUser) throw new Error('Can not update receiver')
        return true;
    }
    static async acceptFriend(idUserA, idUserB){
        if(!idUserA || idUserA == '')
            throw new Error('Missing sender!');
        if(!idUserB || idUserB == '')
            throw new Error('Missing receiver!');
        if(idUserA===idUserB)
            throw new Error('Error!');
        if(!mongoose.Types.ObjectId.isValid(idUserB) || !mongoose.Types.ObjectId.isValid(idUserA))
            throw new Error('User id invalid!');
        const userB = await UserModel.findById(idUserB)
        if(!userB) throw new Error('Can not find user')
        const userA = await UserModel.findByIdAndUpdate(
            idUserA,
            { 
                $pull: { receiveRequests: userB._id },
                $addToSet: { friends: userB._id }
            }
        )
        if(!userB) throw new Error('Can not update user')
        const otherUser = await UserModel.findByIdAndUpdate(
            userB._id,
            { 
                $pull: { sendRequests: userA._id },
                $addToSet: { friends: userA._id }
            }
        )
        if(!otherUser) throw new Error('Can not update user')
        return true;
    }
}
const UserModel = mongoose.model('user', UserSchema);
module.exports = { UserModel, User }