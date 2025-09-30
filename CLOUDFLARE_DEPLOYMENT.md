# Deploying JWT Viewer to Cloudflare Pages

Cloudflare Pages is a fast and free way to deploy static sites. Follow these steps to deploy your JWT Viewer project:

---

## 1. Prepare Your Project

Make sure your project contains only static files:
- `index.html`
- `style.css`
- `script.js`
- `README.md`

You do not need any build tools or server-side code.

---

## 2. Push Your Code to GitHub

1. Create a new repository on GitHub (or use your existing one).
2. Push your project files to the repository.

---

## 3. Create a Cloudflare Account

If you don't have a Cloudflare account, sign up at [Cloudflare](https://dash.cloudflare.com/sign-up).

---

## 4. Set Up Cloudflare Pages

1. Go to the [Cloudflare Pages dashboard](https://dash.cloudflare.com/?to=/:account/pages).
2. Click **Create a project**.
3. Connect your GitHub account and select your repository.
4. For **Framework preset**, choose **None** (since this is a plain static site).
5. For **Build command**, leave it blank.
6. For **Build output directory**, enter `.` (a single dot, meaning the root directory).
7. Click **Save and Deploy**.

---

## 5. Access Your Site

Once deployed, Cloudflare will provide a public URL for your site (e.g., `https://jwt-viewer.pages.dev`).

You can now share this link or use a custom domain.

---

## 6. (Optional) Custom Domain

You can add a custom domain in the Cloudflare Pages dashboard for your project.

---

## Troubleshooting

- Make sure all your files are in the root directory of your repository.
- If you see a blank page, check the browser console for errors and ensure your file paths are correct.
- For updates, just push changes to your GitHub repository; Cloudflare Pages will redeploy automatically.

---

**Enjoy your fast, secure, and free JWT Viewer on Cloudflare Pages!**
