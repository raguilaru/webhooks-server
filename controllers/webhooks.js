const { check, validationResult } = require('express-validator'),
      { registerWebhook, webhooks, triggerWebhooks } = require('../services/webhooks-service'),
      { BaseError } = require('../models/error'),
      logger = require('../services/logger-service');

/**
 * Validation chain to be passed to the route handler. Validates format of URL, and that token exists.
 */
const validate =
    [
        check('url', 'Url is invalid. Please send a valid URL.').isURL(),
        check('token', 'Token is not present. Please send a valid token').isLength({ min: 3, max: 80 })
    ];

/**
 * Gets error description in the right format, either JSON (support for multiple error messages) or a string (single error)
 */
const getErrorDescription = (error) => {
    try {
        return JSON.parse(error.message);
    } catch(err) {
        return error.message;
    }
}

/**
 * Handles error response
 * @param {Object} error 
 * @param {import('express').Response} res 
 */
const handleErrorResponse = (error, res) => {
    logger.error(getErrorDescription(error))
    if (error.httpCode){
        res.status(error.httpCode).json({ 
            error: {
                name: error.name, 
                description: getErrorDescription(error)
            }
        });
        return;
    }
    res.status(500);
}

/**
 * Registers a webhook, and handles response to client.
 * @function register
 * @param {import('express').Request<{}, {}, showRequestBody, showRequestQuery>} req
 * @param {import('express').Response} res
 */
const register = (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new BaseError('Webhook is not valid', 400, JSON.stringify(errors), true)
        }

        registerWebhook(req.body);
        res.status(200).json({
            result: `Registered webhook: url: ${webhooks[webhooks.length - 1].url}`
        })
    } catch (error) {
        handleErrorResponse(error, res)
    }
}

/**
 * Triggers all registered webhooks, and handles response to client.
 * @function trigger
 * @param {import('express').Request<{}, {}, showRequestBody, showRequestQuery>} req
 * @param {import('express').Response} res
 */
const trigger = async(req, res) => {
    try {
        const results = await triggerWebhooks(req.body);
        logger.info(results);
        res.status(200).json({ results: results })
    }
    catch (error){
        handleErrorResponse(error, res)
    }
}

module.exports = {
    validate,
    register,
    trigger
}