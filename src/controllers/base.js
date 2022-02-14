class BaseController {
    constructor() {
    }

    jsonResponse = (
        res, statusCode, message
    ) => {
        return res.status(statusCode).json({message})
    }

    applicationError = (res, errorMessage) => {
        return this.jsonResponse(res, 400, errorMessage);
    }

    notFound = (res, errorMessage) => {
        return this.jsonResponse(res, 404, errorMessage);
    }

    notAuthorized = (res, errorMessage) => {
        return this.jsonResponse(res, 401, errorMessage);
    }

}


module.exports = BaseController