const selector = function(element) {
  return document.querySelector(element);
};

const sendXHR = function(method, url, message, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (this.status === 200) {
      callback(this.responseText);
    }
  };
  xhr.send(message);
};

const callBack = function(text) {
  const err = JSON.parse(text);
  if (Object.keys(err).length === 0) {
    window.location.href = window.location.href.split('/')[0] + '/login.html';
  }
  if (err.usernameError) {
    selector('#usernameError').innerText = err.usernameError;
  }
  if (err.emailError) {
    selector('#emailError').innerText = err.emailError;
  }
};

const validateInput = function() {
  selector('#usernameError').innerText = '';
  selector('#emailError').innerText = '';
  const inputs = Array.from(document.querySelectorAll('input'));
  const userDetails = inputs.reduce((details, input) => {
    return details + `${input.name}=${input.value}&`;
  }, '');
  sendXHR('POST', '/signup', userDetails.slice(0, -1), callBack);
};
