'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Users', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING(100),
            primaryKey: false,
            allowNull: true,
            unique: 'email'
        },
        password: {
            type: DataTypes.STRING(100),
            primaryKey: false,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    },
    {
        tableName: 'users',
        timestamps: true
    });
}
