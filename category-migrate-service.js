const converter = require('./category-converter');
const Crawler = require('./crawler').Crawler;
const repository = require("./category-repository");

module.exports = {
    migrate
}

async function migrate() {
    const crawler = new Crawler('', '', '');
    const rawCategories = await crawler.getCategories();
    const categories = converter.convert(rawCategories);
    await repository.add(categories);
}