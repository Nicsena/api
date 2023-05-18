
# API

API for <https://nicsena.tk/> and my personal website.

You can try out the API at <https://api.nicsena.tk/>

If you want to test new endpoints and see new/future changes, you can use the dev verson at <https://api-dev.nicsena.tk/>


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`TAILSCALE_WEBHOOK_SECRET`

`GITHUB_WEBHOOK_SECRET` 

`SPOTIFY_CLIENT_ID` 

`SPOTIFY_CLIENT_SECRET` 

`SPOTIFY_REFRESH_TOKEN` 

`MONGODB_SERVER_ADDRESS`

`MONGODB_SERVER_USERNAME`

`MONGODB_SERVER_PASSWORD`

`MONGODB_SERVER_DATABASE`

## Endpoints

### Public

| Endpoint  | Method     | Description                | Params |
| :-------- | :------- | :------------------------- | :------- |
| `/` | `GET` | . | `None` |
| `/ping` | `GET` | Pong! | `None` |
| `/health` | `GET` | API Health - uptime, cpu load, etc | `None` |

### Spotify - TODO
## Available in DEV

| Endpoint  | Method     | Description                |  Params |
| :-------- | :------- | :------------------------- | :------- |
| `/spotify/played` | `GET` | Spotify User - Recently Played | `None` |
| `/spotify/playing` | `GET` | Spotify User - Currently Playing | `None` |

### GitHub

| Endpoint  | Method     | Description                |  Params |
| :-------- | :------- | :------------------------- | :------- |
| `/github/webhook/update` | `POST` | This is for GitHub Push Events. | `None` |

### Tailscale

| Endpoint  | Method     | Description                |  Params |
| :-------- | :------- | :------------------------- | :------- |
| `/tailscale/webhook` | `POST` | This is for subscribed Tailscale events. | `None` |

## Run Locally

Clone the project

```bash
  git clone https://github.com/nicsena/api
```

Go to the project directory

```bash
  cd api
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

