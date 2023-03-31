const {Crawler} = require("./crawler");
const fs = require('fs');
const dal = require('./dal');
const categoryRepo = require('./category-repository');
const crawler = new Crawler('', '', '');

crawler.login();

// dal.connect().then(async res => {
//     var categories = await crawler.getCategories();
//     await categoryRepo.add(categories);
// });
// crawler.getCategories().then(res => {
//     // var value = JSON.stringify(res);
//     // fs.writeFileSync("category.json", value);
// });
// crawler.getCategories()
// crawler.getDetailProduct({id: 2380920}).then(res => console.log(res));

// crawler.getProducts(10).then(res => {
//     var value = JSON.stringify(res);
//     fs.writeFileSync("products.json", value);
// });


const downloader = require('./download');
downloader.download('https://upload2.webbnc.vn/uploadv2/web/97/9724/product/2022/07/24/09/16/1658648058_img_1657336728248_1657349071901.jpg', './Upload/test.jpg', () => {
    console.log('file downloaded');
})