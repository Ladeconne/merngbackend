const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');

if(process.env.NODE_ENV === 'production') {
  const SECRET_KEY = process.env.SECRET_KEY;
} else {
  const { SECRET_KEY } = require('../../config');
}
module.exports.checkAuthorization = (context) => {
  const authHeaders = context.req.headers.authorization

  // Is the headers empty?
  if (!authHeaders) {
    throw new AuthenticationError('Authentication Header must be provided');
  }

  // Is the token provided in the good format?
  const token = authHeaders.split('Bearer ')[1];
  if (!token) {
    throw new AuthenticationError('Authentication token must follow the format \'Bearer: [token]\'');
  }

  // Get the user thanks to the token, if found create the post
  try {
    const user = jwt.verify(token, SECRET_KEY);
    if(!user){
      throw new AuthenticationError('Invalid Token')
    }
    return user;
  } catch(err) {
    throw new Error(err);
  }
}
