const dal = require('./dal');

module.exports = {
    add
}

async function add(products) {
    let cmd = 'SET IDENTITY_INSERT qteam_motor.dbo.Product on;';
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let tem = `INSERT INTO qteam_motor.dbo.Product (ID, CategoryId, Name, ProductCode, LinkSeo, Images, ImageMore, LinkVideo, Price, Sale, Description, CreatedDate, Status, Tags, PathMap) 
                    VALUES (${product.id}, 
                            ${product.categoryId}, 
                            N'${product.name}',
                            N'${product.code}',
                            N'${product.linkSeo}',
                            N'${product.image}',
                            N'${product.imageMores}',
                            null,
                            ${product.price},
                            null,
                            N'${product.description}',
                            N'2021-04-28 09:31:00.413',
                            null,
                            null,
                            null);`
        console.log(tem);
        cmd += tem;
    }
    console.log(cmd);
    // await dal.source.query(cmd);

}