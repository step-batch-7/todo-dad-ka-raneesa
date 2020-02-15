const { readFile } = require('./io');

const doesExistDetails = function(usersDetails, username, email) {
  return usersDetails.reduce((err, details) => {
    if (details.username === username) {
      err.usernameError = 'Username already exists';
    }
    if (details.email === email) {
      err.emailError = 'Email already registered';
    }
    return err;
  }, {});
};

const fillSignUpTemplate = function(details, usersDetails) {
  const err = doesExistDetails(usersDetails, details.username, details.email);
  let signUpPage = readFile('./public/templates/signUp.html', 'utf8');
  const usernameError = err.usernameError ? err.usernameError : '';
  const emailError = err.emailError ? err.emailError : '';
  signUpPage = signUpPage.replace('__usernameError__', usernameError);
  signUpPage = signUpPage.replace('__emailError__', emailError);
  signUpPage = signUpPage.replace('__fullName__', details.name);
  signUpPage = signUpPage.replace('__username__', details.username);
  signUpPage = signUpPage.replace('__email__', details.email);
  return [signUpPage, usernameError || emailError];
};

const isValidUser = function(usersDetails, credentials) {
  return usersDetails.find(detail => {
    return detail.username === credentials.username &&
      detail.password === credentials.password;
  });
};

const createSession = function(sessions, username) {
  const num = 1000;
  const lastSession = sessions[sessions.length - 1];
  const randomNum = Math.random() * num;
  const SID = lastSession ? lastSession.SID + randomNum : randomNum;
  return {
    username,
    SID
  };
};

module.exports = {
  createSession, isValidUser, fillSignUpTemplate
};
