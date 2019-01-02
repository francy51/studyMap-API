var JWT = require('jsonwebtoken')

module.exports = (req, res, next) => {
    let authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    let token = authHeader.split(' ')[1];
    if (!token || token == "") {
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
       decodedToken = JWT.verify(token, 'secret');
    }
    catch (err) {
        if (!token || token == "") {
            req.isAuth = false;
            return next();
        }
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();

}
