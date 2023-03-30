import {Crawler} from "./crawler.js"

const baseUrl = "";
const userName = "";
const password = "";

const crawler = new Crawler(baseUrl, userName, password);
crawler.loadSessionFromFile();
