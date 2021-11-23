const { AuthenticationError, UserInputError } = require('apollo-server');

const { checkAuthorization } = require('../../util/check-auth');
const Post = require('../../models/post');

module.exports = {
  Mutation: {
    async createComment(_, { postId, body }, context){
      const user = checkAuthorization(context);

      if (body.trim() === '') {
        errors.general = "Comment should not be empty"
        throw new UserInputError('Comment should not be empty', { errors });
      }

      try {
        const post = await Post.findById(postId);
        post.comments.unshift( {body, username: user.username, createdAt: new Date().toISOString()})
        await post.save();
        return post
      } catch(err) {
        throw new Error(err)
      }
    },
    async deleteComment(_, { postId, commentId}, context) {
      const user = checkAuthorization(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex(c => c.id === commentId)

        if (post.comments[commentIndex].username === user.username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } else {
        throw new UserInputError('Post not found');
      }
    }
  }
}
