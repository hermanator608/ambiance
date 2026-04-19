import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { ambianceCategories, ambianceCategoryDetail } from '../src/config/ambiance';

const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);
const wipe = args.has('--wipe') || args.has('-w');

// Optional positional arg (kept for readability / future extension)
//   yarn seedDatabase
//   yarn seedDatabase ambiance
const positional = rawArgs.filter((a) => !a.startsWith('-'));
const target = positional[0] ?? 'ambiance';

const assertArgs = () => {
  const allowedTargets = new Set(['ambiance']);
  if (!allowedTargets.has(target) || positional.length > 1) {
    console.error('Invalid arguments.');
    console.error('Usage:');
    console.error('  yarn seedDatabase');
    console.error('  yarn seedDatabase ambiance');
    console.error('  yarn seedDatabase --wipe');
    console.error('  yarn seedDatabase ambiance --wipe');
    process.exitCode = 1;
    return false;
  }

  return true;
};

const loadDotEnv = () => {
  // Load environment variables for local scripts.
  // - Vite loads .env* automatically for the web app.
  // - Node scripts do not, so we load .env.local (preferred) or .env.
  const root = process.cwd();
  const envLocalPath = path.join(root, '.env.local');
  const envPath = path.join(root, '.env');

  if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath, override: false });
  }
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
};

/**
 * Seed Firestore using the Firebase Admin SDK.
 *
 * Why: this bypasses Firestore security rules, so you can keep rules locked down
 * and still re-seed safely.
 *
 * Setup (local):
 * 1) Create a service account key JSON in Firebase Console (Project settings -> Service accounts)
 * 2) Set env var GOOGLE_APPLICATION_CREDENTIALS to the path of that JSON
 *
 * Usage:
 *  - yarn seedDatabase
 *  - yarn seedDatabase ambiance
 *  - yarn seedDatabase --wipe
 *  - yarn seedDatabase ambiance --wipe
 */

const initAdmin = () => {
  if (admin.apps.length > 0) return;

  // Uses GOOGLE_APPLICATION_CREDENTIALS (recommended for local scripts)
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
};

const db = () => admin.firestore();

const deleteAllDocsInCollection = async (collectionPath: string) => {
  const firestore = db();
  const snap = await firestore.collection(collectionPath).get();
  if (snap.empty) return;

  // Batch delete (max 500 per batch)
  let batch = firestore.batch();
  let opCount = 0;

  for (const doc of snap.docs) {
    batch.delete(doc.ref);
    opCount++;

    if (opCount === 450) {
      await batch.commit();
      batch = firestore.batch();
      opCount = 0;
    }
  }

  if (opCount > 0) {
    await batch.commit();
  }
};

const seedAmbiance = async () => {
  const firestore = db();
  console.log('Seeding Ambiance Categories...');

  // One doc per category (Spark-friendly: one read per category)
  // Each doc contains videos[] (keep category <= ~1MiB)
  const batch = firestore.batch();
  for (const [categoryId, videos] of Object.entries(ambianceCategories)) {
    const details = (ambianceCategoryDetail as any)[categoryId];
    const ref = firestore.collection('ambiance').doc(categoryId);

    batch.set(
      ref,
      {
        name: details?.name ?? categoryId,
        icon: details?.icon ?? 'world',
        videos,
      },
      { merge: false },
    );
  }
  await batch.commit();
  console.log('Ambiance categories seeded.');
};

const main = async () => {
  if (!assertArgs()) return;

  loadDotEnv();
  initAdmin();

  if (wipe) {
    console.log('Wiping collections before seeding...');
    await deleteAllDocsInCollection('ambiance');
  }

  await seedAmbiance();
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
