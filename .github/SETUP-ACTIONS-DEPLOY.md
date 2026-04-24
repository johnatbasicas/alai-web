# GitHub Actions Auto-Deploy Setup — Manual Steps Required

**Status:** BLOCKED — requires Alem intervention
**Date:** 2026-04-23
**MC Task:** #9050
**Context:** GH → CF Pages webhook unreliable, need GH Actions as fallback auto-deploy

## Current State
- ✅ Workflow file created: `.github/workflows/deploy-pages.yml`
- ❌ GitHub token lacks `admin:repo_hook` or `repo` scope (cannot set secrets via gh CLI)
- ❌ Cloudflare scoped API token NOT created (currently using Global API Key)
- ❌ GitHub secrets NOT set

## Required: Cloudflare Scoped API Token

**Why:** Current Global API Key has full account access. Need minimal scope token for Pages deploy only.

**Steps to create (via Cloudflare Dashboard):**
1. Login to Cloudflare: https://dash.cloudflare.com/
   - Email: john@basicconsulting.no
   - Password: (from Bitwarden "Cloudflare Global API Key")

2. Navigate to: My Profile → API Tokens → Create Token

3. Configure token:
   - **Token name:** `alai-web Pages Deploy (GH Actions)`
   - **Permissions:**
     - Account → Cloudflare Pages → Edit
     - User → Memberships → Read
   - **Account Resources:**
     - Include → Specific account → ALAI Holding AS (`d0ac2afb6bb5b298723b85a114151a04`)
   - **Zone Resources:** NOT NEEDED (Pages is account-level)
   - **Client IP Address Filtering:** (leave empty — GitHub Actions IPs rotate)
   - **TTL:** Start now, never expire

4. Click "Continue to summary" → "Create Token"

5. **COPY THE TOKEN** (shown ONCE — cannot retrieve later)

6. Save to Bitwarden:
   ```bash
   bw get template item | jq '.type = 1 | .name = "Cloudflare API Token — alai-web Pages Deploy" | .login.username = "john@basicconsulting.no" | .login.password = "PASTE_TOKEN_HERE" | .notes = "Scoped token for GH Actions auto-deploy to CF Pages. Permissions: Pages:Edit + User:Memberships:Read. Account: d0ac2afb6bb5b298723b85a114151a04"' | bw encode | bw create item --session $(cat /tmp/bw-session)
   ```

## Required: GitHub Repository Secrets

**Why:** Workflow needs CF API token and account ID to deploy via wrangler

**Steps (via GitHub Web UI — gh CLI blocked):**
1. Navigate to: https://github.com/johnatbasicas/alai-web/settings/secrets/actions

2. Click "New repository secret"

3. Add secret #1:
   - **Name:** `CLOUDFLARE_API_TOKEN`
   - **Secret:** (paste token from step 5 above)
   - Click "Add secret"

4. Add secret #2:
   - **Name:** `CLOUDFLARE_ACCOUNT_ID`
   - **Secret:** `d0ac2afb6bb5b298723b85a114151a04`
   - Click "Add secret"

## Verification After Setup

Once secrets are added, test the workflow:

```bash
cd /Users/makinja/ALAI/web

# Create empty commit to trigger workflow
git commit --allow-empty -m "Test: GH Actions auto-deploy workflow"
git push origin master

# Watch workflow run
gh run watch --repo johnatbasicas/alai-web

# Verify deployment
curl -sI https://alai.no | grep "^server: cloudflare"
wrangler pages deployment list --project-name alai-web | head -7
```

Expected result:
- GH Actions workflow completes successfully
- New deployment visible in `wrangler pages deployment list`
- alai.no serves new content within 3 minutes

## Rollback Plan

If GH Actions deploy fails:
1. Check workflow logs: `gh run view --repo johnatbasicas/alai-web`
2. Verify secrets are set: https://github.com/johnatbasicas/alai-web/settings/secrets/actions
3. Fallback to manual deploy:
   ```bash
   export CLOUDFLARE_API_KEY="<from Bitwarden: Cloudflare Global API Key>"
   export CLOUDFLARE_EMAIL="john@basicconsulting.no"
   wrangler pages deploy /Users/makinja/ALAI/web/public \
     --project-name=alai-web \
     --branch=master \
     --commit-hash=$(git rev-parse HEAD)
   ```

## Security Notes

- Scoped token has MINIMAL permissions (Pages:Edit only, single account)
- Token rotation: recommend every 90 days (manual — no auto-rotation available)
- Token stored in GitHub Secrets (encrypted at rest, masked in logs)
- Global API Key remains in Bitwarden as fallback (do NOT delete until GH Actions proven stable)

## Next Steps

After Alem completes token + secrets setup:
1. FlowForge commits workflow file
2. FlowForge updates DEPLOY-MAP.md with GH Actions as primary method
3. FlowForge runs test deploy (empty commit)
4. FlowForge verifies L2+ (curl + deployment list)
5. FlowForge marks MC #9050 ready with test run ID
