const core = require('@actions/core');
const github = require('@actions/github');
const fs = require("fs");
const { startTesting } = require('./bitbarTesting');
const { GithubActions } = require('./githubActions');

try {
    const apiKey = core.getInput("bitbar-api-key");
    const testingFolder = core.getInput("testing-folder");
    const binaryAppPath = core.getInput("application");
    const appPlatform = core.getInput("type");
    const projectId = core.getInput("project-id");
    const deviceGroupId = core.getInput("device-group-id");

    if (!fs.existsSync(testingFolder)) throw "Testing folder does not exist";

    if (!fs.existsSync(binaryAppPath)) throw "Binary application does not exist";

    startTesting(apiKey, testingFolder, binaryAppPath, appPlatform, projectId, deviceGroupId, new GithubActions());
} catch (error) {
    core.setFailed(error.message);
}