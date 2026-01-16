# RevolvIQ Deployment Guide

This guide will help you deploy your Next.js application to **Firebase Hosting**.

## Prerequisites
- You must have the [Firebase CLI](https://firebase.google.com/docs/cli) installed.
- You must have your **Hostinger Domain** DNS pointing to Firebase (configured during the `firebase init` process or via console).

## Step 1: Install Firebase Configuration
We have already created `firestore.rules`. Ensure you are logged in:

```bash
npx firebase login
```

## Step 2: Initialize Firebase (One-Time)
Run this command in your project root:

```bash
npx firebase init
```

1. Select **Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys**.
2. Select **Functions: Configure a Cloud Functions directory...** (Required for Next.js backend/SSR).
3. Select **Firestore: Configure security rules...**
4. Select **Use an existing project** -> Select your `revolviq-xxx` project.
5. **Hosting Setup**:
   - "What do you want to use as your public directory?" -> `public` (or leave default, Next.js helper handles this).
   - "Configure as a single-page app (rewrite all urls to /index.html)?" -> **No** (Next.js handles routing).
   - "Set up automatic builds and deploys with GitHub?" -> **No** (for now).
6. **Functions Setup**:
   - Language: **TypeScript**
   - ESLint: **No**
   - Install dependencies: **Yes**

**CRITICAL**: Enable Web Frameworks support for Next.js.
```bash
npx firebase experiments:enable webframeworks
```

## Step 3: Build & Deploy
Once initialized, deploying is simple:

```bash
npm run build
npx firebase deploy
```

This command will:
1. Build your Next.js app.
2. Deploy static assets to Firebase Hosting CDN.
3. Deploy server code (SSR/API) to Cloud Functions 2nd Gen.

## Step 4: Environment Variables
Since `.env.local` is not uploaded, you must set environment variables in Firebase Functions config or via the Google Cloud Console for the deployed function.

For the new Gen 2 functions used by Web Frameworks, the recommended way is to use `.env` files that *are* included, or use:

```bash
npx firebase functions:secrets:set STRIPE_SECRET_KEY
```

(And update your code to use secrets).
For simpler MVP deployment, ensure your production `.env` variables are properly set in the build environment or added to `firebase.json` rewrites if necessary, but Web Frameworks usually handles `process.env` during build.

## Troubleshooting
- **Domain**: Go to [Firebase Console > Hosting](https://console.firebase.google.com/) and click "Add Custom Domain". Enter `revolviq.io`. Follow the TXT record instructions to verify on Hostinger.
- **Permissions**: Ensure your CLI user has Editor/Owner permissions on the project.
