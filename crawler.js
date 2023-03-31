const fs = require('fs');
const axios = require('axios');
const {convert} = require("html-to-text");
const jsdom = require("jsdom");
const util = require("./util");

class CategoryConverter {
    convert(rawCategories) {
        let res = [];
        let parentNodePath = [];
        let currentDeep = 1000;
        for (let i = 0; i < rawCategories.length; i++) {
            let convertedCategory = {};
            let category = rawCategories[i];
            convertedCategory.id = category.id;
            convertedCategory.name = this.#convertName(category.name);
            convertedCategory.linkSeo = this.getLinkSeo(convertedCategory);
            let deep = this.#getDeepLevelFromName(category.name);
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
            convertedCategory.path = this.#generatePath(convertedCategory);
        }
        return res;
    }


    getLinkSeo(convertedCategory) {
        return util.removeAccents(convertedCategory.name).replaceAll(' ', '-').trim();
    }

    #generatePath(cateogory) {
        var res = '';
        var tem = cateogory;
        while (tem != null) {
            res = `<li><a href='/category/${tem.linkSeo}.html'>${tem.name}<i className='fa fa-angle-double-right'></i></a></li>` + res;
            tem = tem.parent;
        }
        res = `<li><a href='/'>Trang chủ&nbsp; <i className='fa fa-angle-double-right'></i></a></li>` + res;
        return res;
    }

    #getDeepLevelFromName(name) {
        return (name.match(/--/g) || []).length
    }

    #convertName(name) {
        return name.replaceAll('-', '').trim();
    }
}

class SessionData {
    sid;
    bnc;
    tokenKey;
    tokenValue;

    constructor(sid, bnc, tokenKey, tokenValue) {
        this.sid = sid;
        this.bnc = bnc;
        this.tokenKey = tokenKey;
        this.tokenValue = tokenValue;
    }

    toString() {
        return `PHPSESSID=${this.sid};__bnc__=${this.bnc};${this.tokenKey}=${this.tokenValue}`
    }
}

const sessionPath = "session.json";

class Crawler {


    baseUrl;
    userName;
    password;
    session;


    constructor(baseUrl, userName, password) {
        this.baseUrl = baseUrl;
        this.userName = userName;
        this.password = password;
    }


    login() {
        const cachedSession = this.#loadSessionFromFile();
        if (cachedSession != null) {
            this.session = cachedSession;
            return;
        }
        throw new Error("have not setup session file");
    }


    async getCategories() {
        const response = await this.#get('http://admin.bncvn.vn/product');
        const $ = this.#loadJQuery(response.data);
        let selectTag = $('select[name=category]');
        let optionTags = $(selectTag).find('option[value != ""]');
        var rawCategories = [];
        for (let i = 0; i < optionTags.length; i++) {
            let optionTag = optionTags[i];
            let id = parseInt($(optionTag).val());
            let name = $(optionTag).text();
            let linkSeo = util.removeAccents(name).replaceAll(' ', '-');
            rawCategories.push({id: id, name: name, linkSeo: linkSeo});
        }
        return new CategoryConverter().convert(rawCategories);
    }

    async getProducts(maxItems) {
        const res = [];
        let numberPage = await this.getNumberPage();
        for (let i = 1; i <= numberPage; i++) {
            let summaryProducts = await this.getSummaryProducts(i);
            for (let j = 0; j < summaryProducts.length; j++) {
                let productDetail = await this.getDetailProduct(summaryProducts[j]);
                res.push(productDetail);
                if (res.length >= maxItems) return res;
            }

        }
        return res;
    }

    async getNumberPage() {
        const url = `http://admin.bncvn.vn/product-product-lang-vi`;
        let response = await this.#get(url);
        const $ = this.#loadJQuery(response.data);
        return parseInt($('#sample_1_info').html().trim().split(" ").slice(-1)[0]);
    }

    async getSummaryProducts(page) {
        const url = `http://admin.bncvn.vn/product-product-lang-vi-p${page}`;
        console.log(`getSummaryProducts:${url}`)
        let response = await this.#get(url);
        const $ = this.#loadJQuery(response.data);
        const rows = $('#product_list tbody tr');
        const res = [];
        for (let i = 0; i < rows.length; i++) {
            let id = parseInt($(rows[i]).attr("id").replace('item_', ''));
            let tds = $(rows[i]).find("td");
            let img = $(tds[1]).find("img[alt='']").first().prop("src");
            let name = $(tds[2]).find("span").html();
            res.push({id: id, name: name, img: img});
        }
        return res;
    }


    async getDetailProduct(productSummaryInfo) {
        const url = `http://admin.bncvn.vn/product-product-edit-${productSummaryInfo.id}-lang-vi`;
        console.log(`getDetailProduct:${productSummaryInfo.id}`);
        let response = await this.#get(url);
        const $ = this.#loadJQuery(response.data);
        const imgNodes = $('.list-image div.imgs > img');
        let images = [];
        for (let i = 0; i < imgNodes.length; i++) {
            let srcImg = $(imgNodes[i]).prop("src");
            images.push(srcImg);
        }
        let categoryName = $('span.checked input:checkbox.select_category').last().parents('label').text().trim().replace("-- ", "");
        let categoryPath = "";
        const res = {};
        res.id = productSummaryInfo.id;
        res.name = productSummaryInfo.name;
        res.code = $('input[name="code"]').val();
        res.img = productSummaryInfo.img;
        res.subImg = images;
        res.seo = $('#seo').val();
        res.shortDescription = convert($('#short_info').val(), {
            wordwrap: 200
        });
        res.longDescription = convert($('#full_info').val(), {
            wordwrap: 200
        });
        res.price = $('#gia').val();
        res.categoryName = categoryName;
        res.categoryPath = categoryPath;
        return res;

    }

    #loadSessionFromFile() {
        if (!fs.existsSync(sessionPath)) return null;
        let str = fs.readFileSync(sessionPath, {encoding: 'utf8', flag: 'r'});
        let tem = JSON.parse(str);
        if (tem.sid == null || tem.sid == '') return null;
        return new SessionData(tem.sid, tem.bnc, tem.tokenKey, tem.tokenValue);
    }

    #loadJQuery(data) {
        const dom = new jsdom.JSDOM(data);
        return require('jquery')(dom.window);
    }


    async #get(url) {
        let response = await axios.get(url, {
            headers: {
                'Upgrade-Insecure-Request': '1',
                'Accept': 'ext/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'User-Agent': 'Mozilla/5.0 ((Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
                'Cookie': this.session.toString()
            }
        });
        return response;
    }
}

module.exports = {
    Crawler: Crawler
}