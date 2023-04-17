const dal = require('./dal');

module.exports = {
    add
}

async function add(categories) {

    var cmd = 'SET IDENTITY_INSERT qteam_motor.dbo.Category on;';
    for (var i = 0; i < categories.length; i++) {
        let category = categories[i];
        let path = category.path.replaceAll("'", "''");
        let tem = `INSERT INTO qteam_motor.dbo.Category (ID, Name, LinkSeo, ParentId, Level, OrderDisplay, Icon, Type, PathName) VALUES (
                                                     ${category.id}, 
                                                     N'${category.name}',
                                                     N'${category.linkSeo}',
                                                     ${category.parentId},
                                                     ${category.level},
                                                     ${category.order},
                                                     null,
                                                     0,
                                                    N'${path}');`
        console.log(tem);
        cmd += tem;
    }
    await dal.source.query(cmd);

}