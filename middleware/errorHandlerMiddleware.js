const errorHandlerMiddleware = (error, req, res, next) => {
    if (error.code && error.message) {
        const { code, message } = error;
        const errorObj = { error: message };
        if (error.access) {
            errorObj.access = error.access;
        }
        return res.status(code).json(errorObj);
    }
    else {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = errorHandlerMiddleware;
