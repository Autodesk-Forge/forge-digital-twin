# forge-digital-twin

Autodesk Forge application demonstrating various use cases in manufacturing, specifically in context of digital twins.

## Live demo

Master branch is deployed to https://forge-digital-twin.herokuapp.com.

## Development

- contact the repo owner for Forge credentials used in this demo
- install dependencies: `npm install`
- run server: `FORGE_CLIENT_ID=<client-id> FORGE_CLIENT_SECRET=<client-secret> npm start`
- go to http://localhost:3000

### Bootstrap theme

The project uses a custom Bootstrap theme. In order to tweak the theme:

- modify _tools/bootstrap-theme/custom.scss_
- run `npm build:client` to update _public/stylesheets/bootstrap.css_
- commit the new version of the CSS file