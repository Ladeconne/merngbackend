const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/post');
const { checkAuthorization } = require('../../util/check-auth');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({createdAt: -1});
        return posts;
      } catch(err) {
      throw new Error(err);
      }
    },
    async getPost(_,{postId}) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post
        } else {
          throw new Error('Post not found');
        }
      } catch(err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuthorization(context);

      if (body.trim() === ''){
        throw new Error('Body must not me empty')
      }

      const newPost = new Post(
        { body,
          username: user.username,
          user: user.id,
          createdAt: new Date().toISOString()
        }
      )
      const post = await newPost.save();
      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuthorization(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return `Post ${postId} has been successfully deleted`
        } else {
          throw new AuthenticationError('Hey! this is not your post :P')
        }
      } catch(err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuthorization(context);

      const post = await Post.findById(postId);

      if (post) {
        if (post.likes.find(l => l.username === username)) {
          post.likes = post.likes.filter(l => l.username !== username)
        } else {
          post.likes.push({ username, createdAt: new Date().toISOString()})
        }
        await post.save();
        return post;
      } else {
        throw new UserInputError('Post does not exist')
      }
    }
  }
}
