const isAdmin = (req, res, next) => {
    if (req.session && req.session.role === 'admin') {
        next();
    } else {
        return res.status(403).send('You do not have permission to access this page');
    }
};

const isUser = (req, res, next) => {
    if (req.session && req.session.role === 'user') {
        next();
    } else {
        return res.status(403).send('You do not have permission to access this page');
    }
};

module.exports = {isAdmin, isUser};