const fs = require('fs');
const path = require('path');
var AdmZip = require("adm-zip");

const makeZipOfTestingContent = (testingFolder) => {
    return new Promise((resolve, reject) => {
        var zip = new AdmZip();
        const directoryPath = path.join(__dirname, testingFolder);
        fs.readdir(directoryPath, function (err, files) {
            //handling error
            if (err) {
                reject('Unable to scan directory: ' + err);
            } else {
                files.forEach(function (file) {
                    const filePath = path.join(directoryPath, file);
                    if (fs.statSync(filePath).isDirectory()) {
                        zip.addLocalFolder(filePath, `./${file}`);
                    } else if (fs.statSync(filePath).isSymbolicLink()) {
                    } else if (fs.statSync(filePath).isFile) {
                        zip.addLocalFile(filePath);
                    }
                });

                const now = new Date();
                const zipFilename = `testing-${now.getTime()}.zip`;
                zip.writeZip(path.join(__dirname, zipFilename));
                resolve(zipFilename);
            }
        });
    });
}

module.exports = { makeZipOfTestingContent }