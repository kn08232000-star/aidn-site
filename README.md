# aidn — Personal Site

Dark, minimal landing page for aidn. Single-file static site (HTML + Tailwind via CDN + vanilla JS). No build step.

Total monthly cost: **$0**. You only pay your domain renewal (~$29/yr for `aidn.site` next year).

---

## What you need (all free)

- GitHub account → https://github.com/join
- Netlify account → https://app.netlify.com/signup (sign in with GitHub — easiest)
- Git installed on Windows → https://git-scm.com/download/win (just click through the installer with default options)
- Your `aidn.site` domain (already bought ✓)

---

## Deploy in 4 steps

### 1. Put the site on GitHub

Open **PowerShell** and run, one block at a time:

```powershell
cd C:\Users\kn082\aidn-site
git init
git add .
git commit -m "initial commit"
git branch -M main
```

Now go to https://github.com/new and create a **new empty repo** named `aidn-site`. **Do not** tick "Add a README" or "Add .gitignore" — both already exist.

After creating, GitHub shows a page with commands. Copy the two lines that look like this (with your username) and run them in PowerShell:

```powershell
git remote add origin https://github.com/<your-username>/aidn-site.git
git push -u origin main
```

If Git asks you to sign in, it'll pop a browser — sign in with GitHub.

---

### 2. Connect Netlify to the repo

1. Go to https://app.netlify.com
2. **Add new site → Import an existing project → Deploy with GitHub**
3. Authorize Netlify to access your GitHub (one-time)
4. Pick the `aidn-site` repo
5. On the "Build settings" page: leave **Build command blank**, **Publish directory** = `.` (Netlify reads this from `netlify.toml` automatically — you can just click through)
6. Click **Deploy site**

In ~20 seconds you'll see a temp URL like `melodic-pixie-12345.netlify.app`. **Open it — the site is live.**

From now on, every `git push` redeploys automatically.

---

### 3. Point aidn.site at Netlify

In Netlify:

1. Site overview → **Domain management → Add a domain you already own** → type `aidn.site` → **Verify** → **Add domain**
2. Netlify will say "DNS configuration needed" and offer two paths. Pick **"Set up Netlify DNS"** (easier).
3. Netlify gives you **4 nameservers** that look like `dns1.p01.nsone.net`, `dns2.p02.nsone.net`, etc. Copy them.

Now in **Porkbun**:

1. Domain Management → click on `aidn.site` → **Authoritative Nameservers**
2. Delete Porkbun's default nameservers
3. Paste in the 4 Netlify nameservers
4. **Save**

DNS takes 10-60 minutes to propagate worldwide. Once it does:
- `https://aidn.site` shows your site
- Netlify auto-issues an HTTPS certificate (no setup needed)
- Check progress: Netlify → Domain settings → HTTPS → should say "Certificate active"

---

### 4. Set up email forwarding

So `info@aidn.site` actually lands in your real inbox.

In Porkbun → `aidn.site` → **Email Forwarding** → **Add**:
- Source: `info`
- Destination: `collapsed0001@gmail.com`
- Save

Now anything sent to `info@aidn.site` forwards to your Gmail (free, included with the domain).

---

## Done. What you have:

- ✅ `https://aidn.site` — live, HTTPS, free hosting
- ✅ `info@aidn.site` forwarding to your Gmail
- ✅ Auto-redeploy whenever you `git push`

**Only ongoing cost:** domain renewal each year.

---

## Making changes later

Edit `index.html` in any editor (VS Code, Notepad++, even Notepad). Then:

```powershell
cd C:\Users\kn082\aidn-site
git add .
git commit -m "describe what you changed"
git push
```

Netlify will redeploy in ~30 seconds.

---

## Preview locally (optional)

To see changes before pushing, open `index.html` directly in your browser, or run a tiny local server:

```powershell
cd C:\Users\kn082\aidn-site
python -m http.server 5173
```

Then open http://localhost:5173.

---

## Personalize

Things you'll want to swap in `index.html` as you go:

- **Avatar** — search for `Replace this SVG with a real avatar` and drop in an `<img src="/avatar.jpg" alt="aidn" />` instead (and add `avatar.jpg` to the project folder).
- **`info@aidn.site`** — make sure the Porkbun forward (step 4) is set up, otherwise mailto links go nowhere.
- **Social links** — none yet. Add to the nav or footer when you want them (Twitter, GitHub, Instagram, etc.).

---

## File map

```
aidn-site/
├── index.html      # markup
├── styles.css      # all styles
├── script.js       # interactivity (cursor, typewriter, magnetic buttons, bg canvas)
├── netlify.toml    # Netlify config (static, no build)
├── .gitignore
└── README.md       # this file
```

---

## Troubleshooting

**`git` not recognized?** Install Git (link in "What you need") and reopen PowerShell.

**Pushed to GitHub but Netlify isn't redeploying?** Netlify → Site → Deploys → check the latest deploy. If you see no recent activity, in Site → Build & deploy → Continuous deployment, confirm the repo is still linked.

**Domain not working after 1 hour?** Run `nslookup aidn.site` in PowerShell — if it returns Netlify IPs (`75.2.x.x` or `99.83.x.x`), DNS is working and the issue is HTTPS provisioning (give it another 10 min). If it returns Porkbun IPs or nothing, double-check the nameservers in Porkbun.
