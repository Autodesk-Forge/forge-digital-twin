## Deployment

> We're loosely following the [gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) workflow.

- create a release branch from `develop` for the new version: `git checkout -b release/<major>.<minor>.<patch>`
- in the release branch, update the major, minor, patch version in _package.json_
- merge the release branch into `master`: `git checkout master; git merge --no-ff release/<major>.<minor>.<patch>`
- merge the release branch back to `develop`: `git checkout develop; git merge --no-ff release/<major>.<minor>.<patch>`
- push the `master`, `develop` branches and the tags back to enterprise git: `git push origin develop master --tags`
- push the `master` branch to heroku (ask @brozp for credentials): `git push heroku master`
- go to [releases](https://git.autodesk.com/brozp/forge-digital-twin/releases) and summarize changes in the newly deployed version
