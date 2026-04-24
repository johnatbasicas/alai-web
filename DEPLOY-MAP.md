# DEPLOY-MAP.md — ALAI Web

**ZAKON PI2 compliance document**

## Repository
- **GitHub:** https://github.com/johnatbasicas/alai-web
- **Default branch:** `master`
- **Local path:** `/Users/makinja/ALAI/web`

## Hosting
- **Platform:** Cloudflare Pages
- **Project name:** `alai-web`
- **Account ID:** `d0ac2afb6bb5b298723b85a114151a04`

## URLs
- **Production:** https://alai.no (custom domain)
- **Preview:** https://alai-web.pages.dev
- **Branch deployments:** `https://<branch>.alai-web.pages.dev`
- **Commit deployments:** `https://<short-sha>.alai-web.pages.dev`

## Build Configuration
- **Build output:** `public/` (static files, no build step required)
- **wrangler.toml:**
  - `name = "alai-web"`
  - `pages_build_output_dir = "public"`
- **CF Pages Functions:** `/functions/api/contact.js` (contact form proxy)
- **Security headers:** `/public/_headers` (HSTS, CSP, X-Frame-Options, etc.)

## URL Behavior
- **Extensionless routing:** CF Pages auto-redirects `.html` extensions
  - `/ucenje/pcele.html` → 308 → `/ucenje/pcele`
  - `/ucenje/19-explorer/index.html` → `/ucenje/19-explorer/`
- **SPA fallback:** Enabled (serves `/index.html` for unmatched routes)

## Deploy Methods

### Method 1: Automatic (PREFERRED)
GitHub webhook → CF Pages auto-deploy on push to `master`

**Known issue (2026-04-23):** Webhook NOT reliably triggering. Root cause unknown.
**Workaround:** Manual deploy (Method 2) until fixed.

### Method 2: Manual (CURRENT)
```bash
export CLOUDFLARE_API_KEY="<key>"  # Bitwarden: "Cloudflare Global API Key"
export CLOUDFLARE_EMAIL="<email>"   # From Bitwarden credential

wrangler pages deploy /Users/makinja/ALAI/web/public \
  --project-name=alai-web \
  --branch=master \
  --commit-hash=$(git rev-parse HEAD) \
  --commit-message="$(git log -1 --pretty=%B)"
```

### Method 3: GitHub Actions (BACKUP - NOT YET IMPLEMENTED)
No `.github/workflows/` currently exists. Could be added as fallback if webhook continues to fail.

## Pre-Deploy Checklist (ZAKON PI2)
- [ ] `git status` — clean working directory
- [ ] `git log origin/master..HEAD` — verify no unpushed commits
- [ ] `curl -sI https://alai.no` — check current live version
- [ ] `git log master -5` — review recent commits
- [ ] If CI exists: `gh run list --limit 5` — check CI health

## Post-Deploy Verification (L2+)
```bash
# 1. Verify content propagation
curl -s https://alai.no/ucenje/pcele | grep -c "An-Nahl"  # Must be >0
curl -s https://alai.no/ucenje/19-explorer/ | wc -l      # Must be ~990 lines
curl -s https://alai.no/ucenje/ | grep -c "pcele"         # Must be >0

# 2. Verify CF serving
curl -sI https://alai.no | grep "^server: cloudflare"     # Must pass

# 3. Verify deployment status
wrangler pages deployment list --project-name alai-web | head -7
# Latest deployment source commit must match: git rev-parse HEAD

# 4. Verify Functions
curl -X POST https://alai.no/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"test","email":"test@example.com","message":"test"}' \
  -s -o /dev/null -w "%{http_code}"  # Must return 200 or 400 (validation), not 404/500
```

## Rollback Procedure
1. Identify last good deployment:
   ```bash
   wrangler pages deployment list --project-name alai-web
   ```
2. Note the commit SHA of the working deployment (e.g., `6e6ffc2`)
3. Deploy that commit:
   ```bash
   git checkout <good-commit-sha>
   wrangler pages deploy /Users/makinja/ALAI/web/public \
     --project-name=alai-web \
     --branch=master \
     --commit-hash=<good-commit-sha>
   ```
4. Verify rollback with post-deploy checks
5. If needed, create fix branch from master and deploy via worktree

## Troubleshooting

### Webhook Not Firing
**Symptom:** Git push succeeds, but no new CF Pages deployment
**Diagnosis:**
- Check GitHub webhook logs: Settings → Webhooks → Recent Deliveries
- Check CF Pages integration: CF Dashboard → Pages → alai-web → Settings → Builds & deployments
**Fix:** Manual deploy (Method 2) + investigate webhook config

### 404 on New Files
**Symptom:** New HTML files return 404 or serve wrong content
**Diagnosis:** Check if file exists in `public/` and was included in deploy
**Fix:** Verify `git ls-files public/` includes the file, then redeploy

### Stale Content After Deploy
**Symptom:** Deployment succeeds but old content still serves
**Diagnosis:** CF cache or DNS propagation delay
**Fix:**
- Wait 2-5 minutes for CF cache purge
- Check preview URL (`https://<sha>.alai-web.pages.dev`) to bypass cache
- Purge CF cache manually if needed: CF Dashboard → Caching → Purge Everything

## Credentials
- **Cloudflare Global API Key:** Bitwarden → "Cloudflare Global API Key"
- **GitHub PAT:** Embedded in git remote URL (DO NOT log or commit)

## Last Updated
- **Date:** 2026-04-23
- **By:** FlowForge (MC #9035)
- **Deploy:** Manual `wrangler pages deploy` (webhook broken)
