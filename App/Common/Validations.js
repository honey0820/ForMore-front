import {showToast} from './CommonMethods';

const validationBlank = (value, msg) => {
  console.log('value --> ', value);
  if (value === '') {
    showToast(msg, 'error');
  } else if (value === null) {
    showToast(msg, 'error');
  } else if (value === undefined) {
    showToast(msg, 'error');
  } else if (value.length < 1) {
    showToast(msg, 'error');
  } else if (value === false) {
    showToast(msg, 'error');
  } else {
    return true;
  }
};
const validationempty = (value) => {
  if (value === '') {
  } else if (value === undefined) {
  } else if (value === null) {
  } else if (value.length < 1) {
  } else if (value === 'null') {
  } else if (value === NaN) {
  } else {
    return true;
  }
};

const validationempty1 = (value) => {
  if (value === '') {
  } else if (value === undefined) {
  } else if (value === null) {
  } else if (value === 'null') {
  } else if (value === NaN) {
  } else {
    return true;
  }
};

const validateEmail = (value) => {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(String(value).toLowerCase())) {
    return true;
  } else if (value === '') {
    showToast('Please enter Email address', 'error');
  } else {
    showToast('Please enter valid Email address', 'error');
  }
};

const validatePhone = (value) => {
  if (value.length === 10) {
    return true;
  } else if (value === '') {
    showToast('Please enter mobile number', 'error');
  } else {
    showToast('Please enter 10 digit mobile number', 'error');
  }
};

const matchPassword = (value1, value2) => {
  if (value1 === value2) {
    return true;
  } else {
    showToast('Confirm password not match', 'error');
  }
};

const validatePassword = (value, length) => {
  var msg_1 = 'Password Must be 4 Digit';

  if (value === '') {
    showToast('Please Enter Password', 'error');
  } else {
    if (length) {
      if (value.length >= length) {
        return true;
      } else {
        showToast(msg_1, 'error');
      }
    } else {
      if (value.length >= 4) {
        return true;
      } else {
        showToast(msg_1, 'error');
      }
    }
  }
};

const validateConfirmPassword = (value, length) => {
  var msg_1 = 'Re - Type Password Must be 4 Digit';

  if (value === '') {
    showToast('Please Enter Re - Type Password', 'error');
  } else {
    if (length) {
      if (value.length >= length) {
        return true;
      } else {
        showToast(msg_1, 'error');
      }
    } else {
      if (value.length >= 4) {
        return true;
      } else {
        showToast(msg_1, 'error');
      }
    }
  }
};

export {
  validatePhone,
  validateEmail,
  matchPassword,
  validatePassword,
  validateConfirmPassword,
  validationBlank,
  validationempty,
  validationempty1,
};
