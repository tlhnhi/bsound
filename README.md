# BSound Back-end

Back-end for BSOUND - a project for NFQ Hackathon

Deployed at [Heroku](https://bsound.herokuapp.com)

## Usage

### Clone this repo and install dependencies

```terminal
$ git clone https://github.com/tlhnhi/bsound
$ cd bsound
$ npm i
```

### Create an `.env` file in `src`

Including

- `MONGODB_URI`: Connection string to your mongodb
- `JWT_SECRET`: A jwt secret string
- `PORT`: (optional) - default: 8000

### Start

```terminal
$ npm run dev
```

http://localhost:6060 will be available
