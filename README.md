# Webhook server
This is exercise is a small webhook server.

## Install dependencies
```bash
npm install
```

## Run

### Run in dev mode
```bash
npm run dev
```
Dev mode runs with nodemon to detect changes in code.

### Run in normal mode
```bash
node app.js
```

## Using webhook server

### Registering a webhook

Create a POST request to 'http://localhost:9876/api/webhooks'
With a request body such as:
```json
{
  "url": "https://raguilaru1.free.beeceptor.com",
  "token":"foo"
}
```

I used 'https://beeceptor.com' to create test endpoints, which will serve as clients to test the delivery of the requests.
For example, I created three endpoints:
https://raguilaru1.free.beeceptor.com, https://raguilaru2.free.beeceptor.com and https://raguilaru3.free.beeceptor.com
They can be monitored here respectively:
https://beeceptor.com/console/raguilaru1, https://beeceptor.com/console/raguilaru2, https://beeceptor.com/console/raguilaru3

The token is required, and should be at least 3 characters long. The token will be hashed (sha-1), and will be part of the request headers and the request body when webhooks are triggered. More information in the trigger section below.

### Triggering webhooks

After registering the webhooks (as shown in the previous section), you may trigger them by creating a POST request to 'http://localhost:9876/api/webhooks/test'. You may also include a "payload" property in the request body such as:
```json
{
  "payload": ["any", { "valid": "JSON" }]
}
```
This "payload" property will be included in each request made by the server to each webhook.
These requests will also include the property "token" in the request body, and also in the heading 'x-webhook-signature-256'. Instead of containing the original token, it contains the hashed value (sha-1), as a security measure as is customary in these types of systems.

## Tests

Integration tests were created to check the endpoints at a high level (http code responses, and some response values). You may trigger them by running:
```bash
npm test
```

## Logs

Simple logging has been configured. You may find two files in the root directory:
- error.log: contains only logs related to errors.
- combined.log: contains both errors and information logging.

### Intentional exclusions

- When registering a wehbook, some services such as GitHub automatically send an initial request for testing/validation. This server skips this step and registers any valid URL. However, the server will handle situations where client server cannot be reached, and will log them.
- Unit tests related to libraries such as validation of request (express-validator) or hashing (crypto) have been intentionally excluded, since any issues with these might suggest issues their codebase, and not the new code introduced in this exercise.
- Ideally we would include integration tests that spawn a separate local server simulating clients, open to receive POST requests from the webhook server. Even though this would be ideal to carry out end-to-end integration tests, it was exluded due to time constraints.
- Remove and Edit operations on the registered webhooks have been excluded from this exercise for the sake of simplicity. You need to restart the server (and register webhooks again) if you wish to make changes.
- A differentiated logging strategy between environments is ideal, but again, a simple logging configuration was made for the sake of time.
