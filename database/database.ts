"use strict";
import Sequelize, {DataTypes} from "sequelize";
const glob = require('glob')
require('dotenv').config()

// @ts-ignore
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mariadb',
        pool: {
            max: 5,
            min: 0,
            idle: 100000
        },
        define: {
            charset: 'utf8',
            timestamps: true
        },
        logging: true
    });

let models = {}

const path = __dirname.replace('/database', '')
glob(`${path}/models/m_*.ts`, { ignore: ['**/index.ts', '**/sequelize.ts'] }, (err, matches) => {
    if (err) {
        throw err
    }
    matches.forEach((file) => {
        const model = sequelize.import(file)
        models[model.name] = model
    })
})

sequelize
    .sync({alter: false})
    .then(() => {
        console.log('Connection database successfully ');
    })
    .catch(err => {
        console.log('Unable to connect to the database: ', err);
    });

module.exports = models
