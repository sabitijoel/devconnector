const validator = require('validator');
const isEmpty =require('./is-empty') ;
module.exports = function validateRegisterInput(data) {
  let errors ={};


data.name = !isEmpty(data.name) ? data.name: '';
data.email = !isEmpty(data.email) ? data.email: '';
data.password = !isEmpty(data.password) ? data.password: '';
data.password2 = !isEmpty(data.password2) ? data.password2: '';

  if(!validator.isLength(data.name, {min:2, max:30}) ){
  errors.name = 'name must be between 2 to 30 characters';
 
}

if(validator.isEmpty(data.name)){
  errors.name = 'name field is required';
}

if(validator.isEmpty(data.email)){
  errors.email = 'email field is required';
}

if(!validator.isEmail(data.email)){ 
  errors.email = 'email is invalid';
}

if(!validator.isLength(data.password,{min:5, max:30} )){
  errors.password = 'password must be at least 5 characters';
}

if(validator.isLength(data.password2)){
  errors.password2 = 'you must confirm your password';
}

if(validator.isEmpty(data.password)){
  errors.password = 'confirm your password';
}

if(!validator.equals(data.password, data.password2)){
  errors.password2 = 'mismatch';
}

return {

  errors,
  isValid: isEmpty(errors)
      } 
}