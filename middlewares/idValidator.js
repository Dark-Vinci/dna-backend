const mongoose = require('mongoose');

module.exports = function (req, res, next) {
    const q = req.params;
    const id = q.id || q.testId;

    const valid = mongoose.Types.ObjectId;

    if (!valid.isValid(id)) {
        return res.status(404).json({
            status: 404,
            message: 'invalid object id'
        })
    } else {
        next()
    }
}