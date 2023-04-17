const https = require('https');
const http = require('http');
const fs = require('fs');
const util = require('./util');


module.exports = {
    download
}

function download(url, dirDestination) {
    console.log(url);
    console.log(dirDestination);
    let imgName = util.getImageFileNameFromUrl(url);
    let pathDestination = dirDestination + imgName;
    return new Promise((res, rej) => {
        try {
            const file = fs.createWriteStream(pathDestination);
            if (url.includes('https'))
                https.get(url, function (response) {
                    response.pipe(file);
                    file.on('finish', function () {
                        file.close(() => {
                            res();
                        });
                    });
                });
            else
                http.get(url, function (response) {
                    response.pipe(file);
                    file.on('finish', function () {
                        file.close(() => {
                            res();
                        });
                    });
                });
        } catch (e) {
            rej(e);
        }
    })

}