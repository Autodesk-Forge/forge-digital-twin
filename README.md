# forge-digital-twin

Autodesk Forge application demonstrating various use cases in manufacturing, specifically in context of digital twins.

![Screenshot](docs/screenshots/2019-02-20.png)

## Live demo

Master branch is deployed to https://forge-digital-twin.herokuapp.com.

## Development

### Prerequisites

- Node.js v10+
- Forge app credentials
  - contact @brozp for credentials used in the demo

### Setup

- clone this repository
- install dependencies: `npm install`
- run server: `FORGE_CLIENT_ID=<client-id> FORGE_CLIENT_SECRET=<client-secret> npm start`
- go to http://localhost:3000

### Bootstrap theme

The project uses a custom Bootstrap theme. In order to customize it:

- modify _tools/bootstrap-theme/custom.scss_
- run `npm build:client` to update _public/stylesheets/bootstrap.css_
- commit the new version of the CSS file

### Data storage

The application uses [sequelize](http://docs.sequelizejs.com/) with support for
sqlite and postgres dialects. By default, data is stored locally using sqlite,
in _database.sqlite_. If you want to store data in a postgres database,
provide `DATABASE_URL` env. variable in the following form: `postgres://<username>:<password>@<host>:<port>/<dbname>`.

## Deployment

> We're loosely following the [gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) workflow.

- create a release branch from `develop` for the new version: `git checkout -b release/<major>.<minor>.<patch>`
- in the release branch, update the major, minor, patch version in _package.json_
- merge the release branch into `master`: `git checkout master; git merge --no-ff release/<major>.<minor>.<patch>`
- merge the release branch back to `develop`: `git checkout develop; git merge --no-ff release/<major>.<minor>.<patch>`
- push the `master`, `develop` branches and the tags back to enterprise git: `git push origin develop master --tags`
- push the `master` branch to heroku (ask @brozp for credentials): `git push heroku master`
- go to [releases](https://git.autodesk.com/brozp/forge-digital-twin/releases) and summarize changes in the newly deployed version
