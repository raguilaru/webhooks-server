crypto = require('crypto')

/**
 * Gets date & time in format hh:mm:ss YYYY-MM-DD
 * @function getDateTime
 * @return {string} date & time in hh:mm:ss YYYY-MM-DD format
 */
const getDateTime = () => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    return `${hours}:${minutes}:${seconds} ${year}-${month}-${date}`
}

/**
 * Hashes the incoming token with SHA-1 function
 * @function hash
 * @param {string} token
 * @return {string} hashed token
 */
const hash = (token) => {
    let hash = crypto.createHash('sha1')
    return hash.update(token, 'utf-8').digest('hex')
}

module.exports = {
    getDateTime,
    hash
}