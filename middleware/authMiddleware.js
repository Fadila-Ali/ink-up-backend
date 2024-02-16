const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Missing Token' });
  }

  // here, 
  token = token?.replace("Bearer ", "");

  console.log('token =', process.env.JWT_SECRET);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    console.log('error =', err);
    if (err) {
      return res.status(401).json({ error: 'Unauthorized - Invalid Token' });
    }

    console.log('user in middle = ', user);

    req.user = user;

    console.log('set user in middle = ', user);

    next();
  });
};

module.exports = authenticate;
