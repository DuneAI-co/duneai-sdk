# DuneAI SDK

The **DuneAI SDK** is a lightweight, client-side JavaScript library that enables websites to monitor user behavior and adapt dynamically to improve performance and conversion rates — powered by adaptive intelligence.

Embed it into any website, and DuneAI will start learning from user interactions to morph your interface intelligently.

---


## 🚀 Installation

Add the following snippet to your `<head>`:

```html
<script src="https://cdn.duneai.co/duneai.js" data-site="YOUR_SITE_ID" async></script>
```

Or install via npm:

```bash
npm install duneai
```

Then initialize:

```ts
import Dune from "duneai";

Dune.init({
  siteId: "YOUR_SITE_ID",
});
```

## Features

🧠 Adaptive interface morphing — automatically adjusts visual and content elements to optimize engagement.

📈 Behavioral analytics — tracks scrolls, clicks, and attention without intrusive cookies.

⚙️ No setup complexity — works on any website (React, Next.js, Squarespace, or plain HTML).

🌎 Lightweight and fast — designed for performance and privacy-first analytics.

🔐 Privacy-respecting — anonymized, event-driven data only.


## Development
Clone the repository:

```bash
git clone https://github.com/duneai/duneai-sdk.git
cd duneai-sdk
npm install
npm run dev
```
The development server will start in watch mode using Vite.

To build the production bundle:
```bash
npm run build
```
The output (duneai.js) will appear in the `/dist` folder.


## Project Structure
```graphql
duneai-sdk/
├── src/
│   ├── index.ts        # Entry point
│   ├── tracker.ts      # Tracks events
│   ├── morph.ts        # Handles DOM morphing logic
│   └── utils/          # Utility helpers
├── dist/               # Compiled build output
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Example Integration
```html
<script src="https://cdn.duneai.co/duneai.js" data-site="demo" async></script>

<div data-morph="hero-text">
  Welcome to our store!
</div>
```
DuneAI will analyze interactions and adapt content within elements tagged with data-morph.


## License
This project is licensed under the [MIT License](https://pages.github.com/).


## About DuneAI
DuneAI is building the next generation of adaptive web intelligence — software that helps digital experiences learn, evolve, and perform better automatically.
Learn more at [duneai.co](https://duneai.co)
