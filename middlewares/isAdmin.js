function admin(req, res, next) {
    let { isAdmin } = req.user;
    if (!isAdmin) {
        return res.status(403).send('access denied');
    }  else {
        next()
    }
}

module.exports = admin;