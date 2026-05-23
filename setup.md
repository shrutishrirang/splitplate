# SplitPlate 🍽️

**Scan a restaurant bill. Split it fairly. Done.**

---

## Deploy in 5 steps (15 minutes, free)

### Step 1 — Get your Gemini API key (free)
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with a Google account
3. Click **Create API key** → copy it somewhere safe

---

### Step 2 — Put the code on GitHub
1. Go to https://github.com/new
2. Create a new **private** repository called `splitplate`
3. Upload all the files from this folder into it
   - Easiest way: drag and drop the whole folder into the GitHub web UI
   - Or use Git if you're comfortable with it

---

### Step 3 — Deploy to Vercel
1. Go to https://vercel.com and sign up (free) with your GitHub account
2. Click **Add New Project**
3. Import your `splitplate` GitHub repository
4. Click **Deploy** — Vercel auto-detects Next.js, no config needed

---

### Step 4 — Add your API key to Vercel
This is the one-time setup that keeps your key secret from users.

1. In Vercel, go to your project → **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** paste your key from Step 1
   - **Environments:** check Production, Preview, Development
3. Click **Save**
4. Go to **Deployments** → click the three dots on your latest deploy → **Redeploy**

---

### Step 5 — Share it
Your app is live at `https://splitplate.vercel.app` (or whatever Vercel named it).
Share that URL — users open it, use it, no setup needed on their end.

---

## Local development (optional)
```bash
npm install
# Copy .env.example to .env.local and add your key:
cp .env.example .env.local
npm run dev
# Open http://localhost:3000
```

---

## Free tier limits
| Service | Free limit |
|---------|-----------|
| Vercel hosting | Unlimited |
| Vercel serverless functions | 100,000 calls/month |
| Gemini 2.5 Flash | 1,500 scans/day |

For a friends tool, these limits will never be hit.

---

## File structure
```
splitplate/
├── pages/
│   ├── _app.js          # App wrapper
│   ├── index.js         # Main app (all UI)
│   └── api/
│       └── parse-bill.js  # Secure Gemini proxy (server-side)
├── styles/
│   └── globals.css      # Global styles
├── .env.example         # Example configuration file
├── .env.local           # Your API key (never commit this)
├── .gitignore           # Keeps .env.local out of GitHub
├── next.config.js
└── package.json
```
