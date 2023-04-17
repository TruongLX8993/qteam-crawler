const downloader = require('./download')
const primaryDir = "./Upload/";
const subDir = "./Upload/Images/";


async function download(rawProducts) {
    for (let i = 0; i < rawProducts.length; i++) {
        let rawProduct = rawProducts[i];
        await downloader.download(rawProduct.img, primaryDir);
        await downloadSubImg(rawProduct.subImg);
    }
}


async function downloadSubImg(imgs) {
    if (imgs != null && imgs.length > 0) {
        for (let i = 0; i < imgs.length; i++) {
            await downloader.download(imgs[i], subDir);
        }
    }
}

module.exports = {
    download: download
}