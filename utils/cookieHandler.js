exports.setCookie = (res, token) => {
    res.cookie('token', token, { httpOnly: true });
};
