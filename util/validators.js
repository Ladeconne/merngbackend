module.exports.registerInputValidators = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if(username.trim() === '') {
    errors.username = "Username shouldn't be empty";
  }

  if(email.trim() === '') {
    errors.email = "Email shouldn't be empty"
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if(!email.match(regEx)) {
      errors.email = "Email should be a valid email adress"
    }
  }

  if(password === '') {
    errors.password = "Password shouldn't be empty"
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Password should match confirmPassword"
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
}

module.exports.loginInputValidators = (username, password) => {
  const errors = {};
  if(username.trim() === '') {
    errors.username = "Username shouldn't be empty";
  }
  if(password.trim() === '') {
    errors.password = "Password shouldn't be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};
