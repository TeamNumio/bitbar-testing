const { makeZipOfTestingContent } = require('./zip');
const {
    uploadingFile,
    getFramework,
    startBitbarTesting,
    waitToFinishTesting
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

        actions.info("Zipping testing content...");
        // make zip file with testing content(config & scripts)
        const zipFile = await makeZipOfTestingContent(testingFolder);
        actions.info("zip file path is " + zipFile);

        actions.info("Uploading test zip file...");
        // upload the zip file to bitbar cloud
        const zipFileRes = await uploadingFile(zipFile, auth);

        actions.info("Uploading application binary file...");
        // upload binary application to bitbar cloud
        const appFileRes = await uploadingFile(binaryAppPath, auth);

        actions.info("Getting Appium Server Side Framework");
        // start testing with uploaded fiiles(zipFileRes & appFileRes)
        const framework = await getFramework(getFrameworkNameByPlatform(appPlatform), auth);

        if (!framework) {
            // failed & return
            actions.setFailed("Error: framework is not specified.");
            return;
        }

        actions.info("Starting Bitbar testing...");
        const test = await startBitbarTesting(
            auth,
            appPlatform,
            appFileRes.id,
            zipFileRes.id,
            projectId,
            framework.id,
            deviceGroupId
        )
        actions.info("Started Bitbar testing...");

        const result = await waitToFinishTesting(
            projectId,
            test.id,
            1800,   // unit is second
            auth,
            (testInfo) => {
                if (testInfo.testCaseCount > 0) {
                    actions.info(`Total/Executed: ${testInfo.testCaseCount}/${testInfo.executedTestCaseCount}, Successful/Failed: ${testInfo.successfulTestCaseCount}/${testInfo.failedTestCaseCount}`);
                }
            }
        )

        actions.setOutput("testingResult", result);
    } catch (error) {
        actions.setFailed("Error:" + JSON.stringify(error));
    }
}

module.exports = { startTesting }