
# API

API for [nicsena.tk](nicsena.tk) and my personal website.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`TAILSCALE_WEBHOOK_SECRET`

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
| `/database` | `GET` | Database Information - Connection Status, etc | `None`
| `/health` | `GET` | API Health - uptime, cpu load, etc | `None` |

### Spotify
This is coming soon!

### Tailscale

| Endpoint  | Method     | Description                |  Params |
| :-------- | :------- | :------------------------- | :------- |
| `/webhook` | `POST` | This is for subscribed Tailscale events. | `None` |

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

