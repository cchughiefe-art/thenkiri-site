# TheNkiri Beta Site

Mobile-first beta onboarding and APK download site for TheNkiri.

## Included
- Cinematic landing page
- Beta registration before APK access
- Private contact/device collection
- Tester IDs (`NK-BETA-XXXXXX`)
- GitHub Release APK discovery with env fallback
- Bug-report form with optional screenshot/video upload
- Password-protected admin dashboard
- Supabase SQL bootstrap
- Vercel-ready Next.js app

## Setup

```bash
npm install
cp .env.example .env.local
```

Create a Supabase project, then run `supabase/setup.sql` in the SQL editor.

Set:
```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
ADMIN_PASSWORD=YOUR_LONG_PASSWORD
ADMIN_COOKIE_SECRET=ANOTHER_LONG_RANDOM_SECRET
```

Never use `NEXT_PUBLIC_` for the service-role key.

## APK source

The site checks GitHub Releases from:

```env
RELEASE_REPO=cchughiefe-art/nkiri-bot
```

It picks the first non-draft release containing an `.apk`.

Until your release workflow publishes an APK asset, use:

```env
APK_DOWNLOAD_URL=https://your-direct-apk-url
APK_VERSION_NAME=3.1.0-beta1
APK_VERSION_CODE=8
APK_SIZE=35 MB
APK_SHA256=...
```

## Admin

Visit `/admin`. Tester contact data is only shown there.

## Deploy

Deploy the repo to Vercel, select Next.js, and add the environment variables from `.env.example`.
