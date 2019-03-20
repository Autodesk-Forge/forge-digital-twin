[![Data-Management](https://img.shields.io/badge/Data%20Management-v1-green.svg)](http://autodesk-forge.github.io)
[![OSS](https://img.shields.io/badge/OSS-v2-green.svg)](http://autodesk-forge.github.io)
[![Model-Derivative](https://img.shields.io/badge/Model%20Derivative-v2-green.svg)](http://autodesk-forge.github.io)

# Forge Digital Twin Demo

Autodesk Forge application demonstrating various use cases in manufacturing, specifically in context of digital twins.

![Screenshot](docs/screenshots/2019-02-20.png)

## Live demo

Master branch is deployed to https://forge-digital-twin.herokuapp.com.

## Development

### Prerequisites

- Node.js v10+
- [Forge](https://forge.autodesk.com) application credentials,
  and an _urn_ of a model processed with [Model Derivative APIs](https://forge.autodesk.com/en/docs/model-derivative/v2)

### Setup

- clone this repository
- install dependencies: `npm install`
- run server: `FORGE_CLIENT_ID=<client-id> FORGE_CLIENT_SECRET=<client-secret> FORGE_MODEL_URN=<model-urn> npm start`
- go to http://localhost:3000

### Bootstrap theme

The project uses a custom Bootstrap theme. In order to customize it:

- modify _tools/bootstrap-theme/custom.scss_
- run `npm build:client` to update _public/stylesheets/bootstrap.css_
- commit the new version of the CSS file

### Data storage

The application uses [sequelize](http://docs.sequelizejs.com/) with support for
sqlite and postgres dialects. By default, data is stored locally using sqlite,
in a _database.sqlite_ file in the root of the repo. If you want to store data in a postgres database,
provide `DATABASE_URL` env. variable in the following form: `postgres://<username>:<password>@<host>:<port>/<dbname>`.

## Sample data

The jet engine model used in the live demo can be obtained
from https://knowledge.autodesk.com/sites/default/files/file_downloads/Jet_Engine_Model.zip.

## Support

For support, please contact forge.help@autodesk.com.

## License

This sample is licensed under the terms of the [MIT License](https://tldrlegal.com/license/mit-license).
Please refer to [LICENSE](LICENSE) for more details.