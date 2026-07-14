# Pantry Ledger

A pantry-to-recipe app: list what's in your kitchen, set a diet, and get AI-generated
recipes in English, Portuguese, Spanish, French, or Italian. Installable as an app
on phone or desktop (PWA).

## Why this needs a small backend

The AI recipe generation calls Anthropic's Claude API, which requires a secret API
key. That key must never sit in code that runs in a visitor's browser — anyone
could open dev tools and steal it. So this project ships a tiny serverless
function (`api/recipes.js`) that holds the key on the server and the browser talks
to that instead.

## 1. Get an Anthropic API key

1. Go to https://console.anthropic.com and sign up / log in.
2. Create an API key under **API Keys**.
3. Add a small amount of credit (this app is cheap to run — a few cents per
   hundred recipe requests).

## 2. Run it locally (optional, to test first)

```bash
npm install
cp .env.example .env.local
# edit .env.local and paste your real key after ANTHROPIC_API_KEY=
npm i -g vercel        # only needed once, for local serverless functions
vercel dev             # runs the frontend + /api/recipes together
```

Open the URL it prints (usually http://localhost:3000).

> If you just run `npm run dev` (plain Vite) the `/api/recipes` route won't exist —
> use `vercel dev` locally so the API route works too.

## 3. Deploy it for free (Vercel)

Vercel is the easiest host for this project because it runs `api/*.js` files as
serverless functions automatically, with zero config.

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com, sign up (free), click **Add New → Project**, and
   import that repository.
3. In the import screen, expand **Environment Variables** and add:
   - `ANTHROPIC_API_KEY` = your key from step 1
4. Click **Deploy**. In about a minute you'll get a live URL like
   `https://pantry-ledger.vercel.app` — that's the link you can share.

Every time you push to GitHub, Vercel redeploys automatically.

### Alternative hosts

Netlify and Cloudflare Pages also support serverless/edge functions, but the
function file location and format differ slightly from Vercel's `api/` convention.
If you'd rather use one of those, say so and the `api/recipes.js` file can be
adapted.

## 4. Making it installable (PWA)

This is already wired up — `public/manifest.json` and `public/sw.js` handle it,
and `index.html` registers the service worker. Once the site is deployed over
HTTPS (Vercel does this automatically):

- **On Android/desktop Chrome/Edge:** visitors will see an "Install" icon in the
  address bar, or **⋮ menu → Install Pantry Ledger**.
- **On iPhone/iPad (Safari):** there's no install prompt — visitors tap the
  **Share** button → **Add to Home Screen**. This is an Apple/Safari limitation,
  not something the app can change.

Once installed, it opens in its own window with its own icon, like a native app.

## 5. Custom domain (optional)

In the Vercel project settings, go to **Domains** and add your own (e.g.
`pantry.yourdomain.com`), then follow the DNS instructions Vercel shows.

## 6. Turning it into an iOS / Android app (Capacitor)

Capacitor is already configured in this project (`capacitor.config.json`,
plus the packages and scripts in `package.json`). It wraps your web app in a
native shell so it can be listed on the App Store and Google Play.

1. **Pick a unique app ID.** Open `capacitor.config.json` and change
   `"appId": "com.yourname.pantryledger"` to your own reverse-domain ID
   (e.g. `com.smithkitchen.pantryledger`). This must be unique per app store
   and can't easily be changed later, so decide it now.

2. **Install dependencies** (includes Capacitor, already listed in
   `package.json`):
   ```bash
   npm install
   ```

3. **Add the native platforms** (one-time setup):
   ```bash
   npx cap add ios       # requires a Mac with Xcode
   npx cap add android   # requires Android Studio
   ```
   This creates `ios/` and `android/` folders with full native projects —
   commit these to git, they hold platform-specific config.

4. **Build and open** whenever you want to test or ship:
   ```bash
   npm run cap:ios       # builds the web app, syncs it, opens Xcode
   npm run cap:android   # builds the web app, syncs it, opens Android Studio
   ```
   From Xcode or Android Studio you can run the app on a simulator/emulator
   or a real device, and later archive/sign it for store submission.

5. **After any code change**, re-sync before testing again:
   ```bash
   npm run cap:sync
   ```

6. **Submit to the stores:**
   - **iOS:** join the Apple Developer Program ($99/year), archive the build
     in Xcode, submit via App Store Connect.
   - **Android:** join the Google Play Console ($25 one-time), generate a
     signed app bundle in Android Studio, upload it there.

   Both go through a review process (hours to a few days) before going live.

> The app still calls your `/api/recipes` backend over the internet, so make
> sure the project is deployed (step 3 above) before testing the native app —
> it needs that live URL to reach Claude.



```
pantry-ledger/
├── api/
│   └── recipes.js       # serverless function, calls Anthropic with your key
├── public/
│   ├── manifest.json     # PWA install metadata
│   ├── sw.js              # service worker (app shell caching)
│   ├── icon-192.png
│   └── icon-512.png
├── src/
│   ├── App.jsx            # the whole app UI
│   └── main.jsx
├── ios/                   # generated after `npx cap add ios`
├── android/               # generated after `npx cap add android`
├── capacitor.config.json  # native app id, name, build folder
├── index.html
├── package.json
└── .env.example
```

## Customizing

- Swap the icons in `public/` (keep the same filenames and sizes, or update
  `manifest.json` and `index.html` to match new ones).
- Add more languages: extend `LANGUAGES`, `LANGUAGE_NAMES`, `TRANSLATIONS`, and
  `ITEM_TRANSLATIONS` in `src/App.jsx`.
- Add more quick-add ingredients: extend the `CATEGORIES` array in `src/App.jsx`.
