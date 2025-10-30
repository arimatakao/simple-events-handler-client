
# Simple Events Handler — Client

This is a small React single-page application that works with the Simple Events Handler backend (https://github.com/arimatakao/simple-events-handler). The client provides a minimal UI to create and list events and is intentionally lightweight so it can be served as a static site.

Highlights
- Create and list events using a simple form and list UI
- Built with Create React App for quick development and easy production builds

## Prerequisites

- Node.js (LTS recommended, e.g. 14/16/18/20)
- npm (bundled with Node) or yarn

## Quick start (development)

1. Install dependencies

```bash
npm install
# or
yarn
```

2. Run the development server

```bash
npm start
# or
yarn start
```

Open http://localhost:3000 in your browser. The dev server supports hot reload.

## Environment / API base URL

The client communicates with an events API. By default the API base URL is read from `src/api.js`. In development you can override it by setting the `REACT_APP_API_BASE` environment variable (Create React App exposes variables prefixed with `REACT_APP_` to the frontend).

Example — create a `.env` file at the project root:

```bash
# .env
REACT_APP_API_BASE=http://localhost:4000
```

Restart the dev server after changing environment variables.

If you prefer to edit the constant directly, check `src/api.js` for the API base constant used by `services/events.js`.

## Scripts

- `npm start` — run the app in development mode (dev server on :3000)
- `npm run build` — create an optimized production build in the `build/` folder
- `npm test` — run tests (if any)

Use `yarn` equivalents if you use Yarn.

## Project structure (important files)

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

The client uses `services/events.js` to call the backend. Typical endpoints:

- GET /events — fetch all events
- POST /events — create a new event (JSON body)

If your backend requires authentication, custom headers, or different routes, update `services/events.js` accordingly.

## Building for production

Create an optimized production build:

```bash
npm run build
# or
yarn build
```

Deploy the contents of the `build/` directory to any static host (Netlify, Vercel, Amazon S3, GitHub Pages, etc.).

## Troubleshooting

- Dev server won't start:
	- Ensure Node and npm/yarn are installed and on supported versions.
	- Remove `node_modules` and reinstall: `rm -rf node_modules && npm install`.

- The app can't reach the API:
	- Confirm `REACT_APP_API_BASE` or `src/api.js` points to your backend URL.
	- Open the browser DevTools network tab to inspect requests and the URLs used.

- CORS errors:
	- Ensure the backend allows cross-origin requests from `http://localhost:3000` while developing.

- Unexpected build output or runtime errors after editing:
	- Stop the dev server and restart it. For production builds, delete `build/` and re-run `npm run build`.

## Development notes and contribution ideas

- The UI is intentionally small: `AddEventForm` handles creating events and `EventList` displays them.
- The API helper is in `src/services/events.js`. Consider adding retries or better error handling if you integrate with flaky backends.
- Suggested small improvements:
	- Add a `.env.example` showing `REACT_APP_API_BASE` usage
	- Add basic unit tests for components
	- Add a CONTRIBUTING.md with development workflows



	## Docker

	This repository includes a multi-stage `Dockerfile` that builds the React app and serves it with nginx.

	Build the image:

	```bash
	docker build -t simple-events-client:latest .
	```

	Run the container (serves on port 80):

	```bash
	docker run --rm --env-file ./.env.example -p 8082:80 simple-events-client:latest
	```

	Open http://localhost:8080 to view the app.

	Notes:
	- The Dockerfile uses a Node build stage and a lightweight nginx runtime.
	- Use `--build-arg` or update `src/api.js` / environment variables if you need to point the frontend to a different backend.


