const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.id) {
        next();
    } else {
        return res.status(401).redirect('/signin');
    }
};

module.exports = isAuthenticated;