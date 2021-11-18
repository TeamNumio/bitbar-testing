const { makeZipOfTestingContent } = require('./zip');
const {
    uploadingFile,
    getFramework,
    startBitbarTesting
} = require('./bitbar')

const getFrameworkNameByPlatform = (platform) => {
    if (!platform) return "";
    return `Appium ${platform} Server Side`
}

const startTesting = async (
    apiKey,
    testingFolder,
    binaryAppPath,
    appPlatform,
    projectId,
    deviceGroupId,
    actions
) => {
    try {
        const auth = {
            username: apiKey,
            password: ""
        }

        actions.debug("Zipping testing content...");
        // make zip file with testing content(config & scripts)
        const zipFile = await makeZipOfTestingContent(testingFolder);

        actions.debug("Uploading test zip file...");
        // upload the zip file to bitbar cloud
        const zipFileRes = await uploadingFile(zipFile, auth);

        actions.debug("Uploading application binary file...");
        // upload binary application to bitbar cloud
        const appFileRes = await uploadingFile(binaryAppPath, auth);

        actions.debug("Getting Appium Server Side Framework");
        // start testing with uploaded fiiles(zipFileRes & appFileRes)
        const framework = await getFramework(getFrameworkNameByPlatform(appPlatform), auth);

        if (!framework) {
            // failed & return
            return;
        }

        actions.debug("Starting Bitbar testing...");
        const res = await startBitbarTesting(
            auth,
            appPlatform,
            appFileRes.id,
            zipFileRes.id,
            projectId,
            framework.id,
            deviceGroupId
        )
        actions.debug("Started Bitbar testing...\n" + JSON.stringify(res));
    } catch (error) {
        actions.setFailed("Error:" + JSON.stringify(error));
    }
    // zip package of testing scripts
}

module.exports = { startTesting }