const dal = require('./dal.js');


dal.connect().then(async () => {
    // await dal.beginTran();
    // await dal.source.query`SET IDENTITY_INSERT qteam_motor.dbo.Category on;`;
    await dal.source.query`SET IDENTITY_INSERT qteam_motor.dbo.Category on;
                           INSERT INTO qteam_motor.dbo.Category (ID, Name, LinkSeo, ParentId, Level, OrderDisplay, Icon, Type, PathName) VALUES (123, N'Test', N'cum-phanh-brembo', 28, 2, 1, null, 0, N'<li><a href=''/''>Trang chủ&nbsp; <i class=''fa fa-angle-double-right''></i></a></li><li><a href=''/category/cum-phanh-con.html''>Cùm Phanh  Côn&nbsp; <i class=''fa fa-angle-double-right''></i></a></li>')`;
    // await dal.commitTran();
});




