const mongoose = require(`mongoose`);
const express = require(`express`);
const validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateProfileInput(data) {
  let errors = {};

  /*validator is for anything that is required. Remember validator only takes in strings. So if something is not submitted, it is not going to come in as an empty string but rather null or unidentified*/

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "handle needs to be between 2 to 10 characters";
  }
  if (validator.isEmpty(data.handle)) {
    errors.handle = "profile handle is required";
  }
  if (validator.isEmpty(data.status)) {
    errors.status = "status field is required";
  }
  if (validator.isEmpty(data.skills)) {
    errors.skills = "skills field is required";
  }

  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = "enter a valid website";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = "enter a valid youtube account";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = "enter a valid facebook account";
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = "enter a valid twitter account";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = "enter a valid linkedin account";
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = "enter a valid instagram account";
    }
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
