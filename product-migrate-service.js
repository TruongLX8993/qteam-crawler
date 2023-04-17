const {Crawler} = require('./crawler');
const converter = require('./product-converter')
const imgDownloader = require('./product-image-downloader')
const repository = require('./product-repository')
module.exports = {
    migrate, init
}


let mCrawler;

function init(crawler) {
    mCrawler = crawler;
}

async function migrate(maxItem) {
    const rawProducts = await mCrawler.getProducts(maxItem);
    const convertedProducts = converter.convert(rawProducts);
    await imgDownloader.download(rawProducts);
    await repository.add(convertedProducts);
}