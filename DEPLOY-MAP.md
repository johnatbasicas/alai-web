# DEPLOY-MAP.md — ALAI Web

**ZAKON PI2** — Required for all deployable repos
**Canonical profile:** `~/system/specs/DEPLOY-BLUEPRINT.md` v2.0 §1C (Cloudflare Pages — static site)
**Maintained by:** pi-orchestrator | **Owner:** FlowForge
**Last verified:** 2026-05-08 (Faza 3 v2 alignment, MC #99897)
**Verification command (run before claiming current):**

```bash
curl -sI https://alai.no | grep -E "^(HTTP|server|cf-)" && \
wrangler pages deployment list --project-name alai-web 2>/dev/null | head -5 \
  || echo "wrangler not authenticated locally — check GH Actions runs instead: gh run list --repo johnatbasicas/alai-web --limit 5"
```

**Cloud profile:** Cloudflare Pages (project `alai-web`, account `d0ac2afb6bb5b298723b85a114151a04`)
**Status:** ACTIVE — CF nameservers live (OCD-1 RESOLVED 2026-06-22). www.alai.no 522 pending CF Pages custom domain add (OCD-4 OPEN).

---

## OPEN RISK / OCD Register (v2 §4 mandatory)

| OCD   | Status   | Description                                                                                                                                                                                                                                                                                                                       | Owner         | Resolution path                                           |
| ----- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | --------------------------------------------------------- |
| OCD-1 | RESOLVED | CF nameservers (aspen+wells.ns.cloudflare.com) ARE live as of 2026-06-22 (verified via `dig alai.no NS`). The one.com migration is complete. No action needed.                                                                                                                                                                    | CEO           | Done — verified 2026-06-22                                |
| OCD-2 | RESOLVED | CF Pages auto-deploy webhook from GitHub broken since 2026-04-23 — REPLACED by GH Actions workflow .github/workflows/deploy-pages.yml (FlowForge MC #9050)                                                                                                                                                                        | FlowForge     | Webhook disabled in CF dashboard; GH Actions is canonical |
| OCD-3 | OPEN     | GH Secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` setup status — verify current setup in repo settings                                                                                                                                                                                                                  | FlowForge     | gh repo view --json secrets ...                           |
| OCD-4 | OPEN     | www.alai.no returns HTTP 522 — CF DNS record for www already points to CF proxy IPs but `www.alai.no` is not registered as a custom domain in CF Pages project `alai-web`. Fix: CF Dashboard → Pages → alai-web → Custom Domains → Add `www.alai.no`. Then add redirect rule www→apex in `_redirects`. Do NOT change DNS records. | CEO/FlowForge | CF Dashboard action only — no code change needed          |

---

## Service Account / Identity Distinction (v2 §4 §1C adapted for CF Pages)

| Identity role          | Identity                                                                                                                            | Scope                                                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Build/Deploy token** | CF Scoped Token "Cloudflare API Token — alai-web Pages Deploy" (Bitwarden + GH Secret CLOUDFLARE_API_TOKEN) — Pages:Edit scope only | GH Actions runs `wrangler pages deploy` with this. **MUST NOT** use Cloudflare Global API Key for automation.               |
| **Runtime identity**   | None — static site, no server-side identity                                                                                         | CF Pages Functions (e.g. /functions/api/contact.js) run as Cloudflare-assigned worker identity. No customer-IAM equivalent. |

**Privilege separation:** scoped token (Pages:Edit) ≠ Global API Key. Global API Key is fallback ONLY (Bitwarden) for emergency rollback.

---

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

### Method 1: GitHub Actions (PREFERRED - IN SETUP)

**Status:** Workflow file created, awaiting CF API token + GH secrets setup

Workflow: `.github/workflows/deploy-pages.yml`

- **Trigger:** Push to `master` OR manual `workflow_dispatch`
- **Deploy:** `wrangler pages deploy` via cloudflare/wrangler-action@v3
- **Auth:** Scoped CF API token (Pages:Edit only, stored in GH Secrets)
- **Concurrency:** Cancel in-progress deploys on new push

**Setup required:** See `.github/SETUP-ACTIONS-DEPLOY.md` for manual steps (CF token + GH secrets)

Once active:

```bash
# Trigger deploy
git push origin master

# Watch progress
gh run watch --repo johnatbasicas/alai-web

# Verify
wrangler pages deployment list --project-name alai-web | head -7
```

### Method 2: CF Pages Webhook (BROKEN)

GitHub webhook → CF Pages auto-deploy on push to `master`

**Status:** NOT reliably triggering since 2026-04-23. Root cause unknown.
**Decision:** Replaced by GH Actions (Method 1). Webhook disabled in CF dashboard until root cause diagnosed.

### Method 3: Manual wrangler (FALLBACK)

```bash
export CLOUDFLARE_API_KEY="<key>"  # Bitwarden: "Cloudflare Global API Key"
export CLOUDFLARE_EMAIL="<email>"   # john@basicconsulting.no

wrangler pages deploy /Users/makinja/ALAI/web/public \
  --project-name=alai-web \
  --branch=master \
  --commit-hash=$(git rev-parse HEAD) \
  --commit-message="$(git log -1 --pretty=%B)"
```

**Use when:** GH Actions fails OR emergency rollback needed

## Pre-Deploy Checklist (ZAKON PI2)

- [ ] `git status` — clean working directory
- [ ] `git log origin/master..HEAD` — verify no unpushed commits
- [ ] `curl -sI https://alai.no` — check current live version
- [ ] `git log master -5` — review recent commits
- [ ] `gh run list --repo johnatbasicas/alai-web --limit 5` — check GH Actions health (must show recent successes)
- [ ] If last 5 runs = failure → FIX CI FIRST, do not push

## Post-Deploy Verification (L2+)

```bash
# 1. Verify GH Actions workflow succeeded
gh run list --repo johnatbasicas/alai-web --limit 1
# Status must be "completed" with conclusion "success"

# 2. Verify content propagation
curl -s https://alai.no/ucenje/pcele | grep -c "An-Nahl"  # Must be >0
curl -s https://alai.no/ucenje/19-explorer/ | wc -l      # Must be ~990 lines
curl -s https://alai.no/ucenje/ | grep -c "pcele"         # Must be >0

# 3. Verify CF serving
curl -sI https://alai.no | grep "^server: cloudflare"     # Must pass

# 4. Verify deployment status
wrangler pages deployment list --project-name alai-web | head -7
# Latest deployment source commit must match: git rev-parse HEAD

# 5. Verify Functions
curl -X POST https://alai.no/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"test","email":"test@example.com","message":"test"}' \
  -s -o /dev/null -w "%{http_code}"  # Must return 200 or 400 (validation), not 404/500
```

## Rollback Procedure

### Option A: CF Dashboard (FASTEST - 30 seconds)

1. Navigate to: https://dash.cloudflare.com/
2. Pages → alai-web → Deployments
3. Find last working deployment (green checkmark)
4. Click "..." → "Rollback to this deployment"
5. Confirm rollback
6. Verify: `curl -s https://alai.no/ucenje/ | grep -c "pcele"` > 0

### Option B: Git Revert + GH Actions (PREFERRED - audit trail)

1. Identify last good deployment:
   ```bash
   wrangler pages deployment list --project-name alai-web
   ```
2. Note the commit SHA (e.g., `6e6ffc2`)
3. Revert to that commit:
   ```bash
   git revert --no-commit HEAD..<good-commit-sha>
   git commit -m "Rollback to <good-commit-sha> — <reason>"
   git push origin master
   ```
4. GH Actions auto-deploys revert (3 min)
5. Verify with post-deploy checks

### Option C: Manual wrangler (FALLBACK - if GH Actions broken)

1. Identify last good commit SHA
2. Checkout that commit:
   ```bash
   git checkout <good-commit-sha>
   ```
3. Deploy manually (Method 3)
4. Return to master: `git checkout master`
5. Create fix branch if needed

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

- **Cloudflare Scoped Token (GH Actions):** Bitwarden → "Cloudflare API Token — alai-web Pages Deploy" (Pages:Edit scope)
- **Cloudflare Global API Key (Fallback):** Bitwarden → "Cloudflare Global API Key" (DO NOT use for automation after scoped token proven stable)
- **GitHub PAT:** Embedded in git remote URL (DO NOT log or commit)
- **GitHub Secrets:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (set via repo settings)

## Last Updated

- **Date:** 2026-04-23
- **By:** FlowForge (MC #9050)
- **Change:** GH Actions workflow created as auto-deploy fallback (webhook broken)
- **Status:** Awaiting CF scoped token + GH secrets setup (see `.github/SETUP-ACTIONS-DEPLOY.md`)
