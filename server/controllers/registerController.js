const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createNewUser = async (req, res) => {
  try{
    const {email, password, passwordConfirmation} = req.body;
    const lowerCaseEmail = email.toLowerCase(); 
    if(!(email && password && passwordConfirmation)) {
      return res.status(400).json({"message": "Wszystkie dane wejściowe są wymagane"});
    }

    const userExist = await User.findOne({ email: lowerCaseEmail });
    if(userExist) {
      return res.status(422).json({"message": "Użytkownik już istnieje"});
    }

    if(password !== passwordConfirmation){
      return res.status(422).json({"message": "Hasła nie są takie same"});
    }

    if(validatePassword(password)<3) {
      return res.status(422).json({"message": "Hasło jest zbyt słabe"});
    }

    encryptedPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      email: lowerCaseEmail,
      password: encryptedPassword,
      privileges: 0,
    });
    
    const token = jwt.sign({id: newUser._id, email: lowerCaseEmail, privileges: newUser.privileges }, process.env.TOKEN_KEY, {expiresIn: '2h'});

    res.status(201).json({ _id: newUser._id, email: newUser.email, privileges: newUser.privileges, token: token });
  } catch(err) {
    console.error(err);
  }
}

function validatePassword(password) {
  let strength = 0;
  if (/(?=(.*[a-z]){1,})/g.test(password)) {
    strength += 1;
  }
  if (/(?=(.*[A-Z]){1,})/g.test(password)) {
    strength += 1;
  }
  if (/(?=(.*[0-9]){1,})/g.test(password)) {
    strength += 1;
  }
  if (/(?=(.*[!@#$%^&*()\-_+.]){1,})/g.test(password)) {
    strength += 1;
  }
  if (/.{8,}/g.test(password)) {
    strength += 1;
  }
  return strength;
}

module.exports = { createNewUser };
