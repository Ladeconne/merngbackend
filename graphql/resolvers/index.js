const postResolver = require('./posts');
const userResolver = require('./users');
const commentResolver = require('./comments');

module.exports = {
  Post: {
    likesCount: (parent) => { return parent.likes.length },
    commentsCount: (parent) => { return parent.comments.length }
  },
  Query: {
    ...postResolver.Query
  },
  Mutation: {
    ...userResolver.Mutation,
    ...postResolver.Mutation,
    ...commentResolver.Mutation
  }
}
