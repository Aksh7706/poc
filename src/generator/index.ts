import { Octokit } from '@octokit/rest';
import Handlebars from 'handlebars';
import { camelize } from '../utils/string';
import { template } from './template';

const octokit = new Octokit({
  auth: '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',
  baseUrl: 'https://api.github.com',
});

const generateGitBranch = async (appName: string, receiverId: string, branchName: string, content: string) => {
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

export async function generateProject(dirtyAppName: string, receiverId: string) {
  const appName = camelize(dirtyAppName);
  const source = Handlebars.compile(template);
  const result = source({ appName: appName, receiverId: receiverId });
  const branchName = `${receiverId.toLowerCase()}_${appName.toLowerCase()}_enriched_notification`;
  const res = await generateGitBranch(appName, receiverId, branchName, result);

  if (res.ref) {
    console.log('Branch created successfully');
    console.log(`https://github.com/Gaurav1327/nnp/tree/${branchName}`);
  }
}
