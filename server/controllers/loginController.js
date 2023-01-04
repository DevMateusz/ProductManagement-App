const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUserToAccount = async(req, res) => {
  try {
    const { email, password } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    
    if(!(lowerCaseEmail && password)) {
      return res.status(200).json({message: "Wszystkie dane wejściowe są wymagane"});
    }
    
    const user = await User.findOne({ email: lowerCaseEmail }, { _id: 1, email: 1, password: 1, privileges: 1});

    if(!user) {
      return res.status(422).json({message: "Użytkownik nie istnieje"});
    } else if(bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({id: user._id, email: lowerCaseEmail, privileges: user.privileges}, process.env.TOKEN_KEY, {expiresIn: '2h'});
      return res.status(200).json({ _id: user._id, email: user.email, privileges: user.privileges, token: token });
    };
    return res.status(422).json({message: "Nieprawidłowe dane uwierzytelniające"});
  } catch(err) {
    return console.error(err);
  }
}

module.exports = { loginUserToAccount };

