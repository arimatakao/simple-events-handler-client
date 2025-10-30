# Simple Events Handler — Client

Application for backend - [https://github.com/arimatakao/simple-events-handler](https://github.com/arimatakao/simple-events-handler)

A small React single-page application for creating and listing events. This client is a lightweight frontend that communicates with an events API to add, fetch and display events.

This repository was bootstrapped with Create React App and includes a minimal UI, an `AddEventForm` component to submit new events, an `EventList` to show events, and a small `services/events.js` helper for API calls.

## Prerequisites

- Node.js (LTS recommended, e.g. 14/16/18/20)
- npm (comes with Node) or yarn

## Quick start

1. Install dependencies

```bash
npm install
# or
yarn
```

2. Start the development server

```bash
npm start
# or
yarn start
```

Open http://localhost:3000 in your browser. The app will hot-reload when you edit source files.

## Available scripts

- npm start: run the app in development mode (dev server on :3000)
- npm run build: create an optimized production build in the `build/` folder
- npm test: run tests (if any)

Run them via npm or yarn as shown in the Quick start.

## Environment / API base URL

The client calls an events backend. By default the code expects the API base to be configured in `src/api.js` or within `services/events.js` (check the `api.js` file in the `src/` folder). If you need to point the client to a different backend in development, set the appropriate environment variable or update the API base constant.

Example (using an .env file at project root):

```bash
# .env
REACT_APP_API_BASE=http://localhost:4000
```

After changing environment variables restart the dev server.

## Project structure (key files)

- `src/` — React source files
	- `index.js` — app entry
	- `App.js` — main component
	- `components/AddEventForm.js` — form to create events
	- `components/EventList.js` — displays events
	- `services/events.js` — API helper (fetch/post events)
	- `api.js` — central API base constant

- `public/` — static html and assets used by CRA
- `build/` — production output (after `npm run build`)

## How the client communicates with the API

The app uses the `services/events.js` module to call the backend. Typical operations include:

- GET /events — fetch all events
- POST /events — create a new event (JSON body)

If your backend requires authentication or different routes, update `services/events.js` accordingly.

## Building for production

To create an optimized production build:

```bash
npm run build
# or
yarn build
```

The output will be in the `build/` directory, ready to be deployed to static hosting (Netlify, Vercel, S3, etc.).

## Common troubleshooting

- Dev server won't start:
	- Make sure Node and npm are installed and versions are compatible.
	- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`.

- The app can't reach the API:
	- Confirm `REACT_APP_API_BASE` / `src/api.js` is set to your backend URL.
	- Check browser console / network tab for request URLs and errors.

- CORS errors:
	- Ensure the backend allows cross-origin requests from `http://localhost:3000` in development.

## Tests

There are no unit tests included by default beyond the CRA starter. If you add tests, run them with:

```bash
npm test
# or
yarn test
```
