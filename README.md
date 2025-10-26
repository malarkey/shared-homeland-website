# 11ty2025 — Modern Eleventy Starter

A modern, Gulp-free Eleventy setup for 2025 — powered by Eleventy v3, Sass, and Browsersync.  
Streamlined for performance, simplicity, and fast local development.  

---

## 🚀 Features

- ⚡ **Eleventy v3** static site generator  
- 🧶 **Sass compilation** using `npx sass`  
  - Outputs to `_includes/css/` for inline **critical CSS**  
- 🖼️ **Image optimization** via `@11ty/eleventy-img`  
- 📰 **RSS feeds** using `@11ty/eleventy-plugin-rss`  
- 💨 **Hot-reload dev server** with **Browsersync**  
- 🔄 Watches SCSS and templates for automatic rebuilds  
- 🧩 Per-page critical CSS with Nunjucks includes  
- 💅 Fully Gulp-free, minimal dependencies  

---

## 🛠️ Installation

Clone the repo and install dependencies:

npm install

## Running the project 

### Development Server

Run: npm run start
Then visit: http://localhost:8080

Features:
- Eleventy watch + rebuild
- Automatic Sass compilation
- Browser reload via Browsersync

- ### Production Build

Run:  npm run build

Outputs to dist/

Includes compiled CSS, optimized images, and built templates
Ready for deployment (e.g. Netlify, Vercel, or GitHub Pages)
Edit any .njk, .md, .scss, or image — changes appear instantly.

## Author

Modernized & maintained by @maxray

Originally inspired by the excellent Eleventy From Scratch starter by Andy B.
