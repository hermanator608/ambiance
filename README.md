# Ambiance

www.ambiance.dev

## Requirements

- Node.js `>= 22`
- Yarn classic (`yarn`)

## Available Scripts

In the project directory, you can run:

### `yarn dev` (or `yarn start`)

Runs the app in development mode (Vite). Vite will print the local URL (typically `http://localhost:5173`).

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Runs the test suite once (Vitest).

### `yarn test:watch`

Runs tests in watch mode.

### `yarn build`

Builds the app for production (Vite) to `dist/`.

Firebase Hosting is configured to serve from `dist/`.

### `yarn preview`

Serves the production build locally.

### `yarn seedDatabase [ambiance] [--wipe]`

Seeds Firestore using the Firebase Admin SDK (local script).

- Script: [scripts/seedDatabaseAdmin.ts](scripts/seedDatabaseAdmin.ts)
- Requires `GOOGLE_APPLICATION_CREDENTIALS` pointing to a service account JSON.

Examples:

- `yarn seedDatabase`
- `yarn seedDatabase --wipe`

## Firebase

- Hosting output: `dist/` (see [firebase.json](firebase.json))
- Firestore rules: [firestore.rules](firestore.rules)
	- Deploy with `firebase deploy --only firestore:rules` (or paste into Firebase Console → Firestore → Rules).

## Data model (Firestore)

This app uses Firestore as the source of truth for the “catalog” (categories + videos) and for public reporting of broken videos.

### `ambiance` (catalog)

- Collection: `ambiance`
- Document id: `categoryId` (string, e.g. `bg3`, `lotr`, `wow`)
- Purpose: dynamic categories/videos (no redeploy needed to add/remove/edit)

Schema (document):

- `name: string` — display name
- `icon: string` — icon id used by the UI
- `videos: Array<Video>`

Schema (`Video`):

- `code: string` — YouTube video id
- `name: string` — display name
- `group?: string` — subcategory/grouping label (used to build the tree)
- `invalid?: boolean` — admin-maintained flag for known-bad videos

### `reports` (public error reports)

- Collection: `reports`
- Document id convention: `${categoryId}_${videoCode}`
- Purpose: allow non-signed-in users to report broken videos and increment a counter for duplicates.

Schema (document):

- `categoryId: string`
- `videoCode: string`
- `count: number` — starts at `1`, increments by exactly `+1` per report
- `createdAt: timestamp`
- `lastReportedAt: timestamp`

Admin UI reads this collection to show a red “reported” badge with the count and the latest report timestamp.

### Seeding

- Script: [scripts/seedDatabaseAdmin.ts](scripts/seedDatabaseAdmin.ts)
- Seeds the `ambiance` collection using the Firebase Admin SDK (bypasses security rules).
