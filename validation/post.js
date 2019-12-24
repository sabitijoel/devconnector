const validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (validator.isEmpty(data.text)) {
    errors.text = "a post is required";
  }

  if (!validator.isLength(data.text, { min: 10 })) {
    errors.text = "your post is required to have at least ten characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
