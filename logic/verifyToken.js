const {JWT_SECRET_KEY} = require('../constants.js')
const jwt = require('jsonwebtoken');

function verifyToken(token) {
    const verified = jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return {success: false, message: 'Invalid token' };
      }
  
      // Access granted, return a response
      return {success: true,  message: 'Protected route accessed successfully', user: decoded.userId };
    });
    
    return verified
}

module.exports = verifyToken