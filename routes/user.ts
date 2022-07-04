const User = require('../controllers/User');
const genericSecure = require('../middleware/generic_secure');
const pathApi = '/api/';

module.exports = function (app) {

    /**
     * @typedef UserLogin
     * @property {string} email.required -
     * @property {string} password.required -
     */
    /**
     * Đăng nhập thành viên bằng email và mật khẩu
     * @route POST /user/login
     * @param {UserLogin.model} point.body.required - the new point
     * @group User
     * @returns {object} 200 - An array of user info
     * @returns {Error}  default - Unexpected error
     */
    app.post(`${pathApi}user/login`, User.login);


    /**
     * @typedef UserRegister
     * @property {string} email.required -
     * @property {string} password.required -
     * @property {string} name -
     */
    /**
     * Đăng ký user mới
     * @route POST /user/register
     * @param {UserRegister.model} point.body.required - the new point
     * @group User
     * @returns {object} 200 - An array of user info
     * @returns {Error}  default - Unexpected error
     */
    app.post(`${pathApi}user/register`, User.register);

    /**
     * @typedef UserEdit
     * @property {string} password
     * @property {string} name
     */
    /**
     * Sửa user
     * @route PUT /user/edit
     * @param {UserEdit.model} point.body.required - the new point
     * @group User
     * @returns {object} 200 - An array of user info
     * @returns {Error}  default - Unexpected error
     * @security JWT
     */
    app.put(`${pathApi}user/edit`, genericSecure, User.editProfile);

    /**
     * Lấy thông tin user
     * @route POST /user/profile
     * @group User
     * @returns {object} 200 - An array of user info
     * @returns {Error}  default - Unexpected error
     * @security JWT
     */
    app.post(`${pathApi}user/profile`, genericSecure, User.profile);
};
