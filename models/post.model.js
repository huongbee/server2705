const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { UserModel } = require('./user.model')

const PostSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    content: String,
    likes: [
        { type: Schema.Types.ObjectId, ref: 'user' }
    ],
    comments: [
        { type: Schema.Types.ObjectId, ref: 'comment' }
    ]
})
const PostModel = mongoose.model('post', PostSchema);
class Post{
    /**
     * 
     * @param {*} author user id
     * @param {*} content content's post
     */
    static async createPost(author,content) {
        if(!author || author == '')
            throw new Error('Missing author!');
        if(!content || content == '')
            throw new Error('Plz fill content!');
        if(!mongoose.Types.ObjectId.isValid(author))
            throw new Error('User id invalid!');
        const user = await UserModel.findById(author);
        if(!user) throw new Error('Can not find author!');
        const post = await PostModel.create({author, content})
        if(!post) throw new Error('Can not create post!');
        const author = UserModel.findByIdAndUpdate(
            author,
            { $addToSet: { posts: post._id }}
        )
        if(!post) throw new Error('Can not update author!');
        return {
            _id: post._id,
            content: post.content
        }
    }
}
module.exports = { PostModel, Post }