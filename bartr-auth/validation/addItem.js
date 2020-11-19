const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateAddItemInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  //data.id = !isEmpty(data.id) ? data.id : "";
  data.display_name = !isEmpty(data.display_name) ? data.display_name : "";
  data.value = !isEmpty(data.value) ? data.value : "";
  data.user_id = !isEmpty(data.user_id) ? data.user_id : "";
  //data.status = !isEmpty(data.status) ? data.status : "";
  // Name checks
  if (Validator.isEmpty(data.display_name)) {
    errors.display_name = "Display name is required";
  }

  // Value checks
  if (Validator.isEmpty(data.value)) {
    errors.value = "Value field is required";
  }

  // User Id checks
  if (Validator.isEmpty(data.user_id)) {
    errors.user_id = "user_id field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
