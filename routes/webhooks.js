const express = require('express'),
    router = express.Router(),
    webhooks = require('../controllers/webhooks');
/**
 * Route registering a single webhook.
 * @name post/api/webhooks
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Validation middleware.
 * @param {callback} middleware - Express middleware function to register new webhook.
 */
router.post('/webhooks',
    webhooks.validate,
    webhooks.register
);

/**
 * Route triggering all registered webhooks.
 * @name post/api/webhooks/test
 * @function
 * @memberof module:routers/users~usersRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware function that triggers all webhooks.
 */
router.post('/webhooks/test',
    webhooks.trigger
);

module.exports = router;