const axios = require('axios'),
    mapLimit = require('async/mapLimit'),
    { getDateTime, hash } = require('../services/utils-service'),
    { BaseError, APIError } = require('../models/error'),
    logger = require('./logger-service');

/**
 * Array that contains all registered webhooks
 */
let webhooks = [];

/**
 * Checks whether the Url of a webhook is already registered
 * @function exists
 * @param {Object} newWebhook
 * @returns boolean
 */
const exists = (newWebhook) => {
    let exists = false;
    webhooks.some(webhook => {
        if (webhook.url === newWebhook.url) {
            exists = true;
            return true;
        }
    })
    return exists;
}

/**
 * Registers a new webhook
 * @function registerWebhook
 * @param {Object} webhook
 */
const registerWebhook = (webhook) => {
    if (exists(webhook)) {
        throw new BaseError('Url is already registered', 422, 'The Url specified in the webhook has already been registered', true);
    }
    webhook.token = hash(webhook.token);
    webhooks.push(webhook);
}

/**
 * Triggers a single webhook by sending a POST request, with a header 'X-Webhook-Signature-256' that contains the hashed (Sha-1) value of the token provided.
 * @async
 * @function triggerWebhook
 * @param {Object} webhook
 */
const triggerWebhook = async (webhook, payload) => {
    try {
        payload.token = webhook.token;
        return axios.post(webhook.url, payload,
            {
                headers: { 'X-Webhook-Signature-256': webhook.token }
            })
            .then((response) => {
                if (!response) {
                    return;
                }
                let status = `URL: ${webhook.url}, Response: ${response.status} ${response.statusText}`
                logger.info(status)
                return status;
            })
            .catch((error) => {
                let status = `URL: ${webhook.url}, ${error}`
                logger.error(status)
                return status;
            })
    } catch (error) {
        logger.error(error);
        throw new APIError('Unknown error while triggering wehbooks')
    }
}

/**
 * Triggers all registered webhooks
 * @function triggerWebhooks
 */
const triggerWebhooks = async (payload) => {
    return await mapLimit(webhooks,
        10,
        async (webhook) => {
            return await triggerWebhook(webhook, payload)
        });
}

module.exports = {
    registerWebhook,
    webhooks,
    triggerWebhooks
}