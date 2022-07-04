const sequelize = require('../database/database')
const {Op} = require("sequelize");
module.exports = {
    db: sequelize,
    Op: Op
}
