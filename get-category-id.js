const jsdom = require("jsdom");
const fs = require('fs');


const data = fs.readFileSync('./2380920.html', {encoding: 'utf8', flag: 'r'});
const $ = loadJQuery(data);
const id = $('span.checked input.select_category:last').val();
console.log("id category: + " + id);





function loadJQuery(data) {
    const dom = new jsdom.JSDOM(data);
    return require('jquery')(dom.window);
}
