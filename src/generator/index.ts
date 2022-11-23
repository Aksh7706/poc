import { Octokit } from '@octokit/rest';
import Handlebars from 'handlebars';
import { camelize } from '../utils/string';
import { template } from './template';

const octokit = new Octokit({
  auth: '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',
  baseUrl: 'https://api.github.com',
});

const generateGitBranch = async (appName: string, receiverId: string, branchName: string, content: string) => {
  const mainBranch = await octokit.request('GET /repos/nnplabs/parser/branches/main');
  const mainBranchCommmitSHA = mainBranch.data.commit.sha;

  await octokit.request('POST /repos/nnplabs/parser/git/refs', {
    ref: `refs/heads/${branchName}`,
    sha: mainBranchCommmitSHA,
  });

  const newTree = await octokit.git.createTree({
    owner: 'nnplabs',
    repo: 'parser',
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
    owner: 'nnplabs',
    repo: 'parser',
    message: `Creating branch for ${receiverId}, app: ${appName}`,
    tree: newTree.data.sha,
    parents: [mainBranchCommmitSHA],
  });

  const pushResponse = await octokit.request(`PATCH /repos/nnplabs/parser/git/refs/heads/${branchName}`, {
    sha: newCommit.data.sha,
    force: true,
  });

  return pushResponse.data;
};

export async function generateProject(dirtyAppName: string, receiverId: string) {
  const appName = camelize(dirtyAppName);
  const source = Handlebars.compile(template);
  const result = source({ appName: appName, receiverId: receiverId });
  const branchName = `${receiverId.toLowerCase()}_${appName.toLowerCase()}_enriched_notification`;
  const res = await generateGitBranch(appName, receiverId, branchName, result);

  if (res.ref) {
    console.log('Branch created successfully');
    console.log(`https://github.com/nnplabs/parser/tree/${branchName}`);
  }
}