# CoinChat
## Installation
Install Node.js and npm before proceeding.

1) Install `yarn` package manager.

```sh
    npm install -g yarn
```

2) Install project dependancies.

```sh
    yarn install
```

3) Start the project

```sh
    yarn start
```

## Environment Variables

All environment variables should be set in a `.env` file in the root of the project.
#### .env File Example

```sh
PORT=3030
NODE_ENV=development
```

### Microsoft
  * MICROSOFT_APP_ID : App ID for bot framework
  * MICROSOFT_APP_PASSWORD : App Password for bot framework
  * MICROSOFT_TEXT_ANALYTICS_KEY : Text Analytics key for sentiment

### Misc
  * PORT : Port for Node (default: `3030`)
  * NODE_ENV : Tells Node what environment we want to run in. `development` or `production` (default: `development`)
