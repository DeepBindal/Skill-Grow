const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const secretKey = process.env.JWT_SECRET
console.log(secretKey)

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }

        const token = authHeader.split(' ')[1];
        let decoded;

        // Check if the token is a JWT or Google ID token
        if (token) {
            try {
                // Verify JWT
                decoded = jwt.verify(token, secretKey);
                req.user = decoded;
                return next();
            } catch (jwtError) {
                // JWT verification failed, try Google token
                try {
                    const ticket = await googleClient.verifyIdToken({
                        idToken: token,
                        audience: process.env.GOOGLE_CLIENT_ID,
                    });

                    decoded = ticket.getPayload();
                    req.user = decoded;
                    return next();
                } catch (googleError) {
                    return res.status(401).json({ error: 'Invalid token' });
                }
            }
        }

        res.status(401).json({ error: 'No token provided' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = verifyToken;
