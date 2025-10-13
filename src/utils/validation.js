const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not Valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not Valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a Strong Password");
  }
};
const validateEditProfileData =(req)=>{
    console.log(req.body)
    const ALLOWED_UPDATES = ["firstName","lastName","emailId", "gender", "age", "about", "skills","userId"];
    const isUpdateAllowed = Object.keys(req.body).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    return isUpdateAllowed;
}

module.exports = { validateSignupData ,validateEditProfileData };
