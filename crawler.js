// const axios = import('axios');
// const fs = import('fs');
import * as fileService from 'fs';

const logInResource = "";


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
}

const sessionPath = "session.json";

export class Crawler {


    baseUrl;
    userName;
    password;
    session;


    constructor(baseUrl, userName, password) {
        this.baseUrl = baseUrl;
        this.userName = userName;
        this.password = password;
    }


    tryLoadSessionFromFile(): SessionData {
        if (!fileService.existsSync(sessionPath)) return null;
        let str = fileService.readFileSync(sessionPath, {encoding: 'utf8', flag: 'r'});
        let tem = JSON.parse(str);
        if (tem.sid == null || tem.sid == '') return null;
        return new SessionData(tem.sid, tem.bnc, tem.tokenKey, tem.tokenValue);
    }

    saveSessionToFile() {

    }

    async login() {

    }

    getCategories(pageIndex, pageSize) {
        console.log(`get categorys: ${pageIndex}`);
    }

    getUrl(resource) {
        return `${this.baseUrl}/${resource}`;
    }

    getProducts() {

    }
}