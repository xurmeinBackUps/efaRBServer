module.exports = (sequelize, DataType) => {
    const User = sequelize.define('user', {
        username:{
            type: DataType.STRING,
            allowNull: false,
            unique: true      
        },
        password:{
            type: DataType.STRING,
            allowNull: false
        },
        is_admin:{
            type: DataType.BOOLEAN,
            allowNull: true
        },
        adminID:{
            type: DataType.STRING,
            allowNull: true,
            unique: false,
            validate:{
                isEmail : true
            }
        }
    });
    User.associate = models => {
        User.hasMany(models, {foreignKey: ['content'] })
    }
    return User
};