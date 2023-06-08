
# API

API for <https://nicsena.tk/> and my personal website.

You can try out the API at <https://api.nicsena.tk/>

If you want to test new endpoints and see new/future changes, you can use the dev verson at <https://api-dev.nicsena.tk/>


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`TAILSCALE_WEBHOOK_SECRET`

`GIT_WEBHOOK_SECRET` 

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

### Health

| Endpoint  | Method     | Description                |  Params |
| :-------- | :------- | :------------------------- | :------- |
| `/health/` | `GET` | API Health - uptime, cpu load, etc | `None` |
| `/health/database` | `GET` | Info for Database | `None` |
| `/health/uptime` | `GET` | Info for uptime of system & process | `None` |
| `/health/load` | `GET` | Info for cpu load of system | `None` |
| `/health/time` | `GET` | The time of the system | `None` |

### Spotify - TODO
#### Available in DEV

| Endpoint  | Method     | Description                |  Params |
| :-------- | :------- | :------------------------- | :------- |
| `/spotify/played` | `GET` | Spotify User - Recently Played | `None` |
| `/spotify/playing` | `GET` | Spotify User - Currently Playing | `None` |

### Git

| Endpoint  | Method     | Description                |  Params |
| :-------- | :------- | :------------------------- | :------- |
| `/git/repo/visit` | `GET` | This redirects to the repository URL in package.json | `None` |
| `/git/webhook/update` | `POST` | This is for Git Push Events. | `None` |

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

