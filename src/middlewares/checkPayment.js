const jwt = require("jsonwebtoken")
function checkPayment(req, res, next) {
    const { token, secretKey } = req.query
    if (!token || !secretKey) {
        res.send("Code not found")
        return;
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            res.send("Authentication failed")
            return;
        } else {
            req.payment = decoded;
            next();
        }
    });
}
module.exports = checkPayment