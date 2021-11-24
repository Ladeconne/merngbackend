require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => ({ req })
})

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB is now connected");
    return server.listen({port: PORT});
  })
  .then((res) => {
    console.log(`Server is now listening to port ${res.url}`)
  })
  .catch(err => console.error(err));
