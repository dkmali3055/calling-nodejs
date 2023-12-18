const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get the token from the request headers
    let token = req.headers.authorization;
    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: "Unauthorize user" });
    }
    if(token.includes('Bearer')){
        token = token.split(' ')[1];
    }
    

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Attach the decoded token to the request object
        req.user = decoded;

        // Call the next middleware
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
