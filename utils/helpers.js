const { v4: uuidv4 } = require('uuid');

exports.generateSessionToken = () => uuidv4();
exports.sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
