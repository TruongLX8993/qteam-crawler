const util = require("./util");


module.exports = {
    convert
}

function convert(rawCategories) {
    let res = [];
    let parentNodePath = [];
    let currentDeep = 1000;
    for (let i = 0; i < rawCategories.length; i++) {
        let convertedCategory = {};
        let category = rawCategories[i];
        convertedCategory.id = category.id;
        convertedCategory.name =convertName(category.name);
        convertedCategory.linkSeo = getLinkSeo(convertedCategory);
        let deep =getDeepLevelFromName(category.name);
        console.log("deep:" + deep + "|" + currentDeep + "" + parentNodePath);

        if (deep > currentDeep) {
            let previousCategory = res[res.length - 1];
            parentNodePath.push(previousCategory);
            currentDeep = deep;
        } else if (deep < currentDeep) {
            parentNodePath.pop();
            currentDeep = deep;
        }

        res.push(convertedCategory);
        let parentDeep = currentDeep - 1;
        convertedCategory.level = currentDeep;
        convertedCategory.parent = parentDeep >= 0 ? parentNodePath[parentDeep] : null;
        convertedCategory.parentId = convertedCategory.parent == null ? 0 : convertedCategory.parent.id;
        convertedCategory.order = i;
        convertedCategory.path =generatePath(convertedCategory);
    }
    return res;
}


function getLinkSeo(convertedCategory) {
    return util.removeAccents(convertedCategory.name).replaceAll(' ', '-').trim();
}

function generatePath(cateogory) {
    var res = '';
    var tem = cateogory;
    while (tem != null) {
        res = `<li><a href='/category/${tem.linkSeo}.html'>${tem.name}<i className='fa fa-angle-double-right'></i></a></li>` + res;
        tem = tem.parent;
    }
    res = `<li><a href='/'>Trang chủ&nbsp; <i className='fa fa-angle-double-right'></i></a></li>` + res;
    return res;
}

function getDeepLevelFromName(name) {
    return (name.match(/--/g) || []).length
}

function convertName(name) {
    return name.replaceAll('-', '').trim();
}