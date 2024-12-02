const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
};

module.exports = errorMiddleware;
