import fetch from 'node-fetch';
const Joi = require('joi')
const models = require('../models').db
const axios = require('axios')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require("lodash");
const ttlInSecond = 86400;
const ttlInSecondRefresh = 86400 * 3;
import {formatResponse} from '../helper/formatResponse';
import {
    MSG_SUCCESS,
    MSG_USER_DOES_EXISTS,
    MSG_USER_ALREADY_EXISTS,
    MSG_SOMETHING_WENT_WRONG
} from '../config/message'

exports.login = async (req, res) => {
    let schema = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).required(),
        password: Joi.string().required().min(8)
    })
    const {body} = req
    const {error} = schema.validate(body)
    if(error) return res.status(400).send(formatResponse(400, error, {}))

    let user = await models.Users.findOne({
        where: {
            email: body.email
        }
    })
    if (!user) return res.status(400).json(formatResponse(400, MSG_USER_DOES_EXISTS, {}))
    const checkPassword = await bcrypt.compareSync(body.password, user.password);

    if(!checkPassword) return res.status(400).json(formatResponse(400, 'Invalid password', {}))

    let objToHash = {
        id: user.id,
        email: user.email,
        name: user.name
    }
    const {token, refresh} = generateToken(objToHash);

    let okResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
        token,
        refresh
    }
    return res.status(200).json(formatResponse(200, MSG_SUCCESS, okResponse))
};

const generateToken = (objToHash)=>{
    const token = jwt.sign(objToHash,
      process.env.SALT_KEY, {
            expiresIn: ttlInSecond
        })

    const refresh = jwt.sign(objToHash,
        process.env.SALT_KEY, {
            expiresIn: ttlInSecondRefresh
        })
    return {token, refresh}
}

exports.register = async (req, res) => {
    let schema = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).required(),
        password: Joi.string().required().min(8),
        name: Joi.string()
    })
    const {body} = req
    const {error} = schema.validate(body)
    if(error) return res.status(400).send(formatResponse(400, error, {}))

    let user = await models.Users.findOne({
        where: {
            email: body.email
        }
    })
    if (user) return res.status(400).json(formatResponse(400, MSG_USER_ALREADY_EXISTS, {}))

    const password = await bcrypt.hash(body.password, 8);

    const newUser =  await models.Users.create({
        email: body.email,
        password: password,
        name: body.name
    })

    return res.status(200).json(formatResponse(200, MSG_SUCCESS, newUser))
};


exports.editProfile = async (req, res) => {
    try {
        const user = req.user
        const {body} = req
        let data = _.pickBy(body, _.identity)
        let validate = {}

        if(data.password){
            validate['password'] = Joi.string().min(8)
            data.password = await bcrypt.hash(body.password, 8);
        }
        if(data.name) validate['name'] = Joi.string()

        let schema = Joi.object(validate)
        const {error} = schema.validate(data)
        if(error) return res.status(400).send(formatResponse(400, error, {}))

        const userUpdate = await models.Users.update(data,{
            where: {
                id: user.id
            }
        })
        return res.status(200).json(formatResponse(200, MSG_SUCCESS, userUpdate))
    }catch (e) {
        console.log(e.toString(), " editProfile")
        return res.status(500).json(formatResponse(500, MSG_SOMETHING_WENT_WRONG, {}))
    }
};


exports.profile = async (req, res) => {
    const user = req.user
    const checkExistAddress = await models.Users.findOne({
        attributes: {
            exclude: ['password']
        },
        where: {
            id: user.id
        }
    })
    if(!checkExistAddress) return res.status(401).json(formatResponse(401, MSG_USER_DOES_EXISTS, {}))
    return res.status(200).json(formatResponse(200, 'Success', checkExistAddress))
}
