const https = require('https');
const fs = require('fs');


module.exports = {
    download
}

function download(url, dest, cb) {
    const file = fs.createWriteStream(dest);
    https.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(cb);
        });
    });
}