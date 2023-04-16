const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const { exec } = require("child_process")

router.get("/", (res, req) => {
    
});

router.post("/webhook/update", (res, req) => {
    var webhookSecret = process.env.GITHUB_WEBHOOK_SECRET
    var body = JSON.stringify(res.body)
    var headers = res.headers;
    var webhookSignature = headers["x-hub-signature"]
    var hmac = `sha1=${crypto.createHmac('sha1', webhookSecret).update(body).digest("hex")}`

    if( webhookSignature !== hmac) {
        //console.log("GitHub Webhook Signature doesn't match!");
        res.status(400).json( { message: "Webhook Signature does not match!" } )
    }
    
    if( webhookSignature == hmac) {
        //console.log("GitHub Webhook Signature does match!");
        if(headers["x-github-event"] === "push") {
            exec('git pull --all');
        }
    }

});

module.exports = router





HEADERS = {
    host: 'nicholass-air.tail6d712.ts.net',
    'user-agent': 'GitHub-Hookshot/d22c2f1',
    'content-length': '7090',
    accept: '*/*',
    'content-type': 'application/json',
    'x-forwarded-for': '140.82.115.36',
    'x-github-delivery': '19e2a302-dc15-11ed-85f3-7dc3fb2724ae',
    'x-github-event': 'push',
    'x-github-hook-id': '410093306',
    'x-github-hook-installation-target-id': '559426413',
    'x-github-hook-installation-target-type': 'repository',
    'x-hub-signature': 'sha1=7547a540efd4d2e49b69710066b57cecd2c99e52',
    'x-hub-signature-256': 'sha256=0e31419d48952753f114e3bf03d9a635ec7bdac38173f88853d196627060b162',
    'accept-encoding': 'gzip'
  }

COMMIT_BODY = {
    ref: 'refs/heads/development',
    before: '341b5052f2974df05f74c9a21b9ec9315f629906',
    after: '1f4cb7a6abbebdede4421159b92a61f60a0583b8',
    repository: {
      id: 559426413,
      node_id: 'R_kgDOIVgrbQ',
      name: 'api',
      full_name: 'Nicsena/api',
      private: false,
      owner: {
        name: 'Nicsena',
        email: 'Nicholassena8190@gmail.com',
        login: 'Nicsena',
        id: 36643037,
        node_id: 'MDQ6VXNlcjM2NjQzMDM3',
        avatar_url: 'https://avatars.githubusercontent.com/u/36643037?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/Nicsena',
        html_url: 'https://github.com/Nicsena',
        followers_url: 'https://api.github.com/users/Nicsena/followers',
        following_url: 'https://api.github.com/users/Nicsena/following{/other_user}',
        gists_url: 'https://api.github.com/users/Nicsena/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/Nicsena/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/Nicsena/subscriptions',
        organizations_url: 'https://api.github.com/users/Nicsena/orgs',
        repos_url: 'https://api.github.com/users/Nicsena/repos',
        events_url: 'https://api.github.com/users/Nicsena/events{/privacy}',
        received_events_url: 'https://api.github.com/users/Nicsena/received_events',
        type: 'User',
        site_admin: false
      },
      html_url: 'https://github.com/Nicsena/api',
      description: 'API for nicsena.tk and my personal website.',
      fork: false,
      url: 'https://github.com/Nicsena/api',
      forks_url: 'https://api.github.com/repos/Nicsena/api/forks',
      keys_url: 'https://api.github.com/repos/Nicsena/api/keys{/key_id}',
      collaborators_url: 'https://api.github.com/repos/Nicsena/api/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/Nicsena/api/teams',
      hooks_url: 'https://api.github.com/repos/Nicsena/api/hooks',
      issue_events_url: 'https://api.github.com/repos/Nicsena/api/issues/events{/number}',
      events_url: 'https://api.github.com/repos/Nicsena/api/events',
      assignees_url: 'https://api.github.com/repos/Nicsena/api/assignees{/user}',
      branches_url: 'https://api.github.com/repos/Nicsena/api/branches{/branch}',
      tags_url: 'https://api.github.com/repos/Nicsena/api/tags',
      blobs_url: 'https://api.github.com/repos/Nicsena/api/git/blobs{/sha}',
      git_tags_url: 'https://api.github.com/repos/Nicsena/api/git/tags{/sha}',
      git_refs_url: 'https://api.github.com/repos/Nicsena/api/git/refs{/sha}',
      trees_url: 'https://api.github.com/repos/Nicsena/api/git/trees{/sha}',
      statuses_url: 'https://api.github.com/repos/Nicsena/api/statuses/{sha}',
      languages_url: 'https://api.github.com/repos/Nicsena/api/languages',
      stargazers_url: 'https://api.github.com/repos/Nicsena/api/stargazers',
      contributors_url: 'https://api.github.com/repos/Nicsena/api/contributors',
      subscribers_url: 'https://api.github.com/repos/Nicsena/api/subscribers',
      subscription_url: 'https://api.github.com/repos/Nicsena/api/subscription',
      commits_url: 'https://api.github.com/repos/Nicsena/api/commits{/sha}',
      git_commits_url: 'https://api.github.com/repos/Nicsena/api/git/commits{/sha}',
      comments_url: 'https://api.github.com/repos/Nicsena/api/comments{/number}',
      issue_comment_url: 'https://api.github.com/repos/Nicsena/api/issues/comments{/number}',
      contents_url: 'https://api.github.com/repos/Nicsena/api/contents/{+path}',
      compare_url: 'https://api.github.com/repos/Nicsena/api/compare/{base}...{head}',
      merges_url: 'https://api.github.com/repos/Nicsena/api/merges',
      archive_url: 'https://api.github.com/repos/Nicsena/api/{archive_format}{/ref}',
      downloads_url: 'https://api.github.com/repos/Nicsena/api/downloads',
      issues_url: 'https://api.github.com/repos/Nicsena/api/issues{/number}',
      pulls_url: 'https://api.github.com/repos/Nicsena/api/pulls{/number}',
      milestones_url: 'https://api.github.com/repos/Nicsena/api/milestones{/number}',
      notifications_url: 'https://api.github.com/repos/Nicsena/api/notifications{?since,all,participating}',
      labels_url: 'https://api.github.com/repos/Nicsena/api/labels{/name}',
      releases_url: 'https://api.github.com/repos/Nicsena/api/releases{/id}',
      deployments_url: 'https://api.github.com/repos/Nicsena/api/deployments',
      created_at: 1667103564,
      updated_at: '2023-04-16T04:48:37Z',
      pushed_at: 1681621869,
      git_url: 'git://github.com/Nicsena/api.git',
      ssh_url: 'git@github.com:Nicsena/api.git',
      clone_url: 'https://github.com/Nicsena/api.git',
      svn_url: 'https://github.com/Nicsena/api',
      homepage: 'https://api.nicsena.tk/',
      size: 11,
      stargazers_count: 0,
      watchers_count: 0,
      language: 'JavaScript',
      has_issues: true,
      has_projects: true,
      has_downloads: true,
      has_wiki: true,
      has_pages: false,
      has_discussions: false,
      forks_count: 0,
      mirror_url: null,
      archived: false,
      disabled: false,
      open_issues_count: 0,
      license: {
        key: 'mit',
        name: 'MIT License',
        spdx_id: 'MIT',
        url: 'https://api.github.com/licenses/mit',
        node_id: 'MDc6TGljZW5zZTEz'
      },
      allow_forking: true,
      is_template: false,
      web_commit_signoff_required: false,
      topics: [],
      visibility: 'public',
      forks: 0,
      open_issues: 0,
      watchers: 0,
      default_branch: 'main',
      stargazers: 0,
      master_branch: 'main'
    },
    pusher: { name: 'Nicsena', email: 'Nicholassena8190@gmail.com' },
    sender: {
      login: 'Nicsena',
      id: 36643037,
      node_id: 'MDQ6VXNlcjM2NjQzMDM3',
      avatar_url: 'https://avatars.githubusercontent.com/u/36643037?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/Nicsena',
      html_url: 'https://github.com/Nicsena',
      followers_url: 'https://api.github.com/users/Nicsena/followers',
      following_url: 'https://api.github.com/users/Nicsena/following{/other_user}',
      gists_url: 'https://api.github.com/users/Nicsena/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/Nicsena/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/Nicsena/subscriptions',
      organizations_url: 'https://api.github.com/users/Nicsena/orgs',
      repos_url: 'https://api.github.com/users/Nicsena/repos',
      events_url: 'https://api.github.com/users/Nicsena/events{/privacy}',
      received_events_url: 'https://api.github.com/users/Nicsena/received_events',
      type: 'User',
      site_admin: false
    },
    created: false,
    deleted: false,
    forced: false,
    base_ref: null,
    compare: 'https://github.com/Nicsena/api/compare/341b5052f297...1f4cb7a6abbe',
    commits: [
      {
        id: '1f4cb7a6abbebdede4421159b92a61f60a0583b8',
        tree_id: '2ab4bfd37e4a0b54baa742c85e30964b1d16da00',
        distinct: true,
        message: 'GitHub Route - Test',
        timestamp: '2023-04-15T22:10:41-07:00',
        url: 'https://github.com/Nicsena/api/commit/1f4cb7a6abbebdede4421159b92a61f60a0583b8',
        author: [Object],
        committer: [Object],
        added: [],
        removed: [],
        modified: [Array]
      }
    ],
    head_commit: {
      id: '1f4cb7a6abbebdede4421159b92a61f60a0583b8',
      tree_id: '2ab4bfd37e4a0b54baa742c85e30964b1d16da00',
      distinct: true,
      message: 'GitHub Route - Test',
      timestamp: '2023-04-15T22:10:41-07:00',
      url: 'https://github.com/Nicsena/api/commit/1f4cb7a6abbebdede4421159b92a61f60a0583b8',
      author: {
        name: 'Nicsena',
        email: 'Nicholassena8190@gmail.com',
        username: 'Nicsena'
      },
      committer: {
        name: 'Nicsena',
        email: 'Nicholassena8190@gmail.com',
        username: 'Nicsena'
      },
      added: [],
      removed: [],
      modified: [ 'routes/github.js' ]
    }
  }