const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const User = require('../../models/user');
const { registerInputValidators, loginInputValidators } = require('../../util/validators');

function generateToken(user) {
  return jwt.sign({
    id: user.id,
    email: user.email,
    username: user.username
  }, process.env.SECRET_KEY, { expiresIn: '1h'})
}

module.exports = {
  Mutation: {
    async login(_, { username, password }){
      // TODO validate args inputs and throw errors if not valid
      const { errors, valid } = loginInputValidators(username, password)
      if (!valid){
        throw new UserInputError('Input validation not passed', { errors });
      }
      // TODO Verify if user is found with this input
      const user = await User.findOne({username});
      if (!user){
        errors.general = "User not found"
        throw new UserInputError('User not found', { errors });
      }
      // TODO Verify if password is matching the db password
      const match = await bcrypt.compare(password, user.password)
      if (!match){
        errors.general = "Wrong credentials"
        throw new UserInputError('Wrong credentials', { errors });
      }
      // TODO Generate a token and return information as after register
      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      }
    },
    async register(_, { registerInput: {username, email, password, confirmPassword} }){
      // TODO Validate args data
      const { valid, errors } = registerInputValidators(username, email, password, confirmPassword)
      if(!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // TODO Make sure user doesn't already exist
      const user = await User.findOne({username})
      if(user){
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        });
      }
      // TODO hash password and create token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        username,
        password,
        email,
        createdAt: new Date().toISOString()
      })

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      };
    }
  }
};
