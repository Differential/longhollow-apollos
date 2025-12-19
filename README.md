# Apollos Church API

This repository contains the Apollos GraphQL API only.

## Getting Started

Install tooling:

- [Homebrew](https://brew.sh)
- [Yarn](https://yarnpkg.com/)

Install dependencies and initialize:

```
yarn
yarn setup
```

## Develop

Start the API in dev mode:

```
yarn start:dev
```

## Deploy

We use Heroku by default because it's free and easy to get started. If you'd like to use another platform to host your API, you can skip this section.

[Install the Heroku CLI](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)

```
brew install heroku/brew/heroku
heroku login
```

Create your app and upload to Heroku:

```
heroku create apollos-api
git push heroku master
```

_NOTE: If you have a [team](https://devcenter.heroku.com/articles/heroku-teams) you'd like to use on Heroku to manage billing, you can use the `-t <teamname>` flag in the `create` command above._

Open the GraphQL Playground on your API to test the deploy:

```
heroku open
```

To deploy automatically through the Github workflow, copy your [Heroku API key](https://dashboard.heroku.com/account) and set a [Github secret](https://docs.github.com/en/actions/reference/encrypted-secrets) in your new repository called `HEROKU_API_KEY`.

To get started with different API integrations, check out our [docs](https://apollosapp.io)!
