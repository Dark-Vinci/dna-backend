
function admin(req, res, next) {
    let { isAdmin } = req.user;

    if (!isAdmin) {
        res.status(403).json({
            status: 403,
            message: 'access denied'
        });
    }  else {
        next()
    }
}

module.exports = admin;