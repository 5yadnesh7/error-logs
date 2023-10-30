const ApiError = require('./ApiError')

function apiErrorHandler(err, req, res) {
    try {
        if (err instanceof ApiError) {
            res.status(err.code).json({
                error: {
                    code: 1,
                    msg: err.msg,
                    errors: err.errors,
                },
                results: {},
            })
            return
        }

        if (err && err.isJoi) {
            const messages = err.details.map((x) => x.message)
            res.status(422).json({
                error: {
                    code: 1,
                    msg: err.msg,
                    errors: messages,
                },
                results: {},
            })

            return
        }

        console.log(err)
        res.status(500).json({
            error: {
                code: 1,
                msg: 'Internal Server Error',
            },
            results: {},
        })
        return
    } catch (error) {
        console.error(error)
    }
}

module.exports = apiErrorHandler
