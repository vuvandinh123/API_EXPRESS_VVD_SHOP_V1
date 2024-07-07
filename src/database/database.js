const { db } = require('../configs/configs');
const knex = require('knex')(db);
module.exports = knex