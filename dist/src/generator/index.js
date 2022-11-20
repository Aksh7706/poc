"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProject = void 0;
const rest_1 = require("@octokit/rest");
const handlebars_1 = __importDefault(require("handlebars"));
const string_1 = require("../utils/string");
const template_1 = require("./template");
const octokit = new rest_1.Octokit({
    auth: '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',
    baseUrl: 'https://api.github.com',
});
const generateGitBranch = async (appName, receiverId, branchName, content) => {
    const mainBranch = await octokit.request('GET /repos/gaurav1327/nnp/branches/main');
    const mainBranchCommmitSHA = mainBranch.data.commit.sha;
    await octokit.request('POST /repos/gaurav1327/nnp/git/refs', {
        ref: `refs/heads/${branchName}`,
        sha: mainBranchCommmitSHA,
    });
    const newTree = await octokit.git.createTree({
        owner: 'gaurav1327',
        repo: 'nnp',
        base_tree: mainBranchCommmitSHA,
        tree: [
            {
                path: `parser/protocols/${appName}.ts`,
                mode: '100644',
                type: 'blob',
                content: content,
            },
        ],
    });
    const newCommit = await octokit.git.createCommit({
        owner: 'gaurav1327',
        repo: 'nnp',
        message: `Creating branch for ${receiverId}, app: ${appName}`,
        tree: newTree.data.sha,
        parents: [mainBranchCommmitSHA],
    });
    const pushResponse = await octokit.request(`PATCH /repos/gaurav1327/nnp/git/refs/heads/${branchName}`, {
        sha: newCommit.data.sha,
        force: true,
    });
    return pushResponse.data;
};
async function generateProject(dirtyAppName, receiverId) {
    const appName = (0, string_1.camelize)(dirtyAppName);
    const source = handlebars_1.default.compile(template_1.template);
    const result = source({ appName: appName, receiverId: receiverId });
    const branchName = `${receiverId.toLowerCase()}_${appName.toLowerCase()}_enriched_notification`;
    const res = await generateGitBranch(appName, receiverId, branchName, result);
    if (res.ref) {
        console.log('Branch created successfully');
        console.log(`https://github.com/Gaurav1327/nnp/tree/${branchName}`);
    }
}
exports.generateProject = generateProject;
