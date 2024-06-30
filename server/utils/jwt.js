const jwt = require("jsonwebtoken");

const secretKey = "v6Mboiw1VzTWoGkgp15Hnppsow5KxOMeqLdHULoxA9w="

function generateToken(user){
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
    }

    return jwt.sign(payload, secretKey, {expiresIn: "1h"});
}

// function verifyToken(token){}

module.exports = {generateToken};