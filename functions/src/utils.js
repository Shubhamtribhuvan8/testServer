const crypto = require('crypto');

const generateRandomId=(length = 16)=> {
  return crypto.randomBytes(length).toString('hex');
}


module.exports = { generateRandomId };

