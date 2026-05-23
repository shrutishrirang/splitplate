# splitplate 🍽️

**scan your restaurant bill. split it fairly. keep the friendship intact.**

splitplate is a modern, beautifully designed web application built with **Next.js**, **Vanilla CSS**, and **Google Gemini AI**. it takes the pain out of restaurant bill calculations. instead of manual math or complex spreadsheets, simply take a photo of your receipt and let the AI do the rest.

designed with a casual, lowercase aesthetic, vibrant neon accents, and smooth micro-interactions, splitplate delivers a highly interactive, premium user experience on both mobile and desktop.

---

## ✨ features

### 📸 1. ai receipt scanner
* powered by the state-of-the-art **gemini-2.5-flash** model.
* uploads high-quality or compression-friendly receipt photos.
* automatically extracts item names, unit quantities, rates, and tax/charge indicators.

### ✏️ 2. review & edit items (neon pink / neon green)
* review and edit parsed names, prices, or charge classifications manually.
* active mathematical calculations adjust the total bill dynamically as you change items.
* **color-coded legend**:
  * 🌸 **neon pink (`#FF007F`)** for food & drink items.
  * 🔋 **neon green (`#39FF14`)** for taxes, service charges, tips, or deliveries.

### 👥 3. casual group lists
* type and add your friends seamlessly.
* auto-assigns dynamic, initials-themed color avatars for everyone at the table.
* enforces a friendly, all-lowercase conversational styling.

### 🍴 4. dynamic item unrolling (qty)
* splitplate handles item quantities smarter than standard apps!
* if you bought multiple quantities of a dish (e.g., `3x butter naan`), splitplate automatically **unrolls them into individual, separate line items** (`butter naan (1/3)`, `butter naan (2/3)`, `butter naan (3/3)`) for the assignment stage.
* this allows you to easily assign the first naan to alice, the second to bob, and the third to charlie!

### 🤝 5. "all / none" assignment toggle
* tick off who shared what dish.
* use the handy **`all`** toggle next to each item to immediately split a shared dish equally among all people.
* toggles back to **`none`** for instant clearing.
* tax and service charges are automatically computed and split proportionally among everyone.

### 💸 6. clean bill calculation & summary
* displays a crystal-clear, exact breakdown of what each person owes.
* calculates the exact mathematical sum of all shares to ensure every single rupee is accounted for down to the decimal point!

---

## 🎨 design system & aesthetics

splitplate was built from the ground up to feel fresh, organic, and extremely alive:
* **typography**: styled with the gorgeous, hand-drawn-style google font **"love ya like a sister"** for a casual, friendly vibe.
* **color palette**:
  * **base**: clean cool white (`#F8F9FA`) and cards (`#FFFFFF`).
  * **theme**: vibrant royal blue (`#2563EB`) primary elements, buttons, and headers.
  * **accents**: high-contrast neon pink and neon green detailing for item highlights.
* **interactions**: tactile button scale-down effects, hover gradients, and responsive layouts.
* **casing**: casual lowercase branding across all buttons, titles, inputs, and badges.

---

## 🛠️ codebase structure

```
splitplate/
├── pages/
│   ├── _app.js          # Next.js app wrapper & dynamic font injection
│   ├── index.js         # Full application state, steps, logic, and views
│   └── api/
│       └── parse-bill.js # Secure serverless backend proxy for Google Generative AI
├── styles/
│   └── globals.css      # Core theme variables, custom fonts, and web resets
├── package.json         # Node dependencies (Next.js, Google Gen AI SDK)
├── setup.md             # 5-step quick deployment guide
└── README.md            # You are here!
```

---

## 🚀 deployment & local setup

want to run splitplate locally or deploy it live for free on vercel? 

we've written a super simple, step-by-step developer setup and hosting guide. check it out here:
👉 **[setup & deployment instructions](./setup.md)**

---

## 🛡️ security architecture

splitplate uses a secure **api proxy** route (`pages/api/parse-bill.js`) to interact with google's ai services. this means your private `GEMINI_API_KEY` is safely stored as an environment variable on the server side and never exposed to client browsers or network inspection tools, making it safe to share your deployed app with all your friends!
