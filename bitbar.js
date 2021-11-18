const FormData = require('form-data')
const fs = require('fs');
const axios = require("axios");

const contentLength = (formData) => new Promise((resolve, reject) => {
    formData.getLength((err, length) => {
        if (err) {
            reject(err)
            return
        }

        resolve(length)
    })
})

const uploadingFile = (filePath, auth) => {
    return new Promise(async (resolve, reject) => {
        try {
            let instanceConfig = {
                baseURL: "https://cloud.bitbar.com/api/me/files",
                timeout: 500000
            }

            let formData = new FormData();
            formData.append("file", fs.createReadStream(filePath))

            const formHeaders = formData.getHeaders();
            const contentType = formHeaders['content-type'];
            delete formHeaders['content-type'];

            const cLen = await contentLength(formData);

            const axiosInstance = axios.default.create({
                ...instanceConfig,
                headers: {
                    ...formHeaders,
                    'Content-Length': cLen,
                    'Content-Type': contentType
                }
            });

            const response = await axiosInstance.request({
                auth: auth,
                method: 'post',
                data: formData,
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            })

            resolve(response.data);
        } catch (error) {
            reject(error)
        }
    })
}

const getAvailableFrameworks = (auth) => {
    return new Promise(async (resolve, reject) => {
        const axiosInstance = axios.default.create({
            baseURL: "https://cloud.bitbar.com/api/me/available-frameworks"
        });

        const response = await axiosInstance.request({ auth: auth, method: 'get' });
        resolve(response.data.data);
    })
}

const getFramework = async (fName, auth) => {
    const frameworks = await getAvailableFrameworks(auth);
    let framework = null;
    frameworks.forEach(f => {
        if (f.name === fName) framework = f;
    });

    return framework;
}

/**
 * 
 * @param {*} platform iOS or Android
 * @param {*} appFileId binary application file id
 * @param {*} testFileId test zip file id
 * @param {*} projectId project id
 * @param {*} frameworkId framework id
 * @param {*} deviceGroupId device group id
 * @returns 
 */
const startBitbarTesting = (
    auth,
    platform,
    appFileId,
    testFileId,
    projectId,
    frameworkId,
    deviceGroupId
) => {
    return new Promise(async (resolve, reject) => {
        try {
            const axiosInstance = axios.default.create({
                baseURL: "https://cloud.bitbar.com/api/me/runs",
                headers: { 'Content-Type': 'application/json' }
            });

            const data = {
                "osType": platform.toUpperCase(),
                "projectId": projectId,
                "files": [
                    { "id": appFileId, action: "INSTALL" },
                    { "id": testFileId, action: "RUN_TEST" }
                ],
                "frameworkId": frameworkId,
                "deviceGroupId": deviceGroupId
            }

            const response = await axiosInstance.request({
                auth: auth,
                method: 'post',
                data: data
            });
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    uploadingFile,
    getAvailableFrameworks,
    getFramework,
    startBitbarTesting
}