var {Pool} = require('pg');
require('dotenv').config()


const pool = new Pool({
    user: process.env.user,
    host: process.env.host,
    database:  process.env.database,
    password: process.env.password,
    port: process.env.port,
    min: 0,
    max: 2,
    createTimeoutMillis: 8000,
    acquireTimeoutMillis: 8000,
    idleTimeoutMillis: 8000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100
});

module.exports = {pool};