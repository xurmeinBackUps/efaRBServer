module.exports = (sequelize, DataType) => {
    const Content = sequelize.define('content', {
        creator:{
            type: DataType.STRING,
            allowNull: false,
        },
        label:{
            type: DataType.STRING,
            allowNull: false,
        },
        content_text:{
            type: DataType.TEXT,
            allowNull: false,
        }
    });
    Content.associate = models => {
        Content.belongsTo(models, {
            foreignKey : 'username',
            targetKey : 'creator'
        })
    };
    return Content
};