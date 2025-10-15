# SmallAviationMonitor - Copilot Instructions

## Project Overview

SmallAviationMonitor is an aviation monitoring system designed to track and analyze small aircraft operations.

## Project Type

- **Phase**: Planning and Design
- **Future Stack**: To be determined based on requirements
- **Current Focus**: Product vision and functionality planning

## Development Guidelines

- Follow aviation industry standards and regulations
- Prioritize safety and reliability in all implementations
- Document all design decisions thoroughly
- Consider scalability for future enhancements

## Code Style (When Implementation Begins)

- Use clear, descriptive variable and function names
- Include comprehensive comments for complex logic
- Follow industry best practices for the chosen technology stack
- Implement proper error handling and logging

## Documentation Standards

- Keep all planning documents up to date
- Use clear, concise language
- Include diagrams and visual aids where appropriate
- Document assumptions and dependencies

## Verification & Deployment Policy (MANDATORY)

**CORE PRINCIPLES**:

- **NEVER PUSH UNTESTED CODE** - If it doesn't work locally, DO NOT push to GitHub/Cloudflare. Every push costs money.
- **Fix your own mistakes immediately** - Never ask permission to clean up your own mess. If you broke it, fix it without asking.

### 1. Local Verification FIRST (mandatory sequence)

Before committing/pushing/deploying, ALWAYS execute this workflow in order:

1. **Save-All** (ensure no "Keep/Undo" prompts visible)
2. **Local build**: `npm run build` in `frontend/` AND `backend/` — both MUST PASS
3. **Type check**: Resolve ALL TypeScript errors before proceeding
4. **Serve locally**: `npm run dev` in `frontend/`
5. **Playwright tests**: `npx playwright test` in `tests/` against `http://localhost:5173`
   - Verify all assertions PASS (anchors present, "Launch Web App Now" visible, no "Download APK")
   - Save snapshots to `tests/output/local/`
6. **Review snapshots**: Open PNGs and HTMLs to confirm correctness
7. **ONLY IF ALL PASS**: commit and push

If Playwright tests fail locally, DO NOT push. Fix the issue first.

### 2. GitHub Secrets Setup (user must configure once)

See `GITHUB-SECRETS-SETUP.md` for detailed instructions. Required secrets:

- `CLOUDFLARE_API_TOKEN` - Get from Cloudflare dashboard → My Profile → API Tokens
- `CLOUDFLARE_ACCOUNT_ID` - Get from `backend/wrangler.toml` or Cloudflare dashboard
- `VITE_GOOGLE_MAPS_API_KEY` - Get from Google Cloud Console → APIs & Services → Credentials

Never ask user to paste secrets in chat. Point them to GitHub Secrets UI at:
`https://github.com/[owner]/[repo]/settings/secrets/actions`

### 3. After Push - Verify Deployment

1. Wait for GitHub Actions workflow to complete
2. Check workflow status: `https://github.com/[owner]/[repo]/actions`
3. Verify Cloudflare Pages deployment succeeded
4. Fetch and inspect live URLs:
   - `https://smallaviationmonitor.pages.dev/` - must have x-app-name, x-build-sha, x-build-time, x-download-mode
   - `https://smallaviationmonitor.pages.dev/download` - must contain "Launch Web App Now", must NOT contain "Download APK"
   - `https://smallaviationmonitor.pages.dev/pwa` - must load (HTTP 200)
5. Provide evidence: commit SHA, deployment ID, timestamps, HTML excerpts

### 4. Type Safety Rules

- Import all types explicitly: `import type { D1Database, ExecutionContext } from '@cloudflare/workers-types';`
- Never leave "Cannot find name" errors unresolved
- Run `npm run build` in backend/ to verify types before committing

### 5. Edit Safety Rules

- Never use bulk-edit modes that create "Keep/Undo" prompts
- Use direct file edits only (replace_string_in_file with exact context)
- After multi-line rewrites, re-read the file to verify correctness
- Save-All before any build/test/commit operation

### 6. Communication Rules

- Do not claim success until ALL checks pass
- No "please try" language - perform steps yourself
- If something fails, fix it immediately without asking permission
- Report evidence (URLs, timestamps, commit SHA, deployment ID)

### 7. Money Awareness

Every failed Cloudflare build/deployment costs money. Therefore:

- NEVER push broken code
- NEVER push without local testing
- NEVER push with TypeScript errors
- NEVER push with failing Playwright tests
- Test locally first, always

These rules are binding for this repository. Violations waste money and user trust.

## No bulk-edit previews / Always save first (MANDATORY)

- Do NOT use any editing mode that creates a "Keep/Undo" bulk-edit preview. Use direct-on-disk edits only.
- Preferred tool: direct patch application that writes immediately to disk.
- Before ANY build/test/deploy:
  1.  Execute a Save‑All across the workspace.
  2.  Re-open changed files to spot-check final content.
  3.  Run `git status` to ensure changes are in the working tree and not stuck in an editor preview.
- Never run builds/tests while any "Keep/Undo" banner is visible.
