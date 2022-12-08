const jwt = require('jsonwebtoken');

const createJWT = async ({ }) => {
    const token = jwt.sign({ userId: this._id, name: this.firstName }, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME });
    return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
    createJWT,
    isTokenValid
}