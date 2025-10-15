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

To prevent regressions and avoid asking the user to manually verify, every change that affects build, deploy, or runtime behavior MUST follow this policy:

1. Triple‑check before stating “fixed” or “working”. You must verify:
	- Local build: `npm run build` in `frontend/` completes successfully.
	- GitHub status: Latest workflow `Deploy to Cloudflare` completed successfully for the current commit SHA.
	- Cloudflare deployment: Identify the latest deployment ID/URL for project `smallaviationmonitor` and environment `Production`.
	- Live site verification: Fetch and inspect the live URLs to confirm expected content is present and unexpected content is absent.

2. Required live checks (fetch, not screenshots):
	- `https://smallaviationmonitor.pages.dev/`
	- `https://smallaviationmonitor.pages.dev/download` must contain “Launch Web App Now” and must NOT contain “Download APK”.
	- `https://smallaviationmonitor.pages.dev/pwa` must load (HTTP 200) and include PWA shell content.

3. Evidence in replies:
	- Provide the commit SHA deployed, deployment ID (from Cloudflare Pages), and timestamps.
	- Include a short excerpt of fetched HTML (or a clear summary) showing the expected markers.
	- If anything fails, state it clearly and fix it before asking the user to test.

4. Environment variables:
	- For production builds, ensure `VITE_GOOGLE_MAPS_API_KEY` is available to the build. In GitHub Actions, pass it via `${{ secrets.VITE_GOOGLE_MAPS_API_KEY }}`.
	- Never request the user to paste secrets into chat. Use repo secrets or Cloudflare Pages variables.

5. Cloudflare Pages rules:
	- Prefer GitHub‑connected deployments; if not connected, deploy via `wrangler pages deploy` and report the returned deployment URL.
	- Avoid stale builds: always `npm run build` immediately before `wrangler pages deploy`.
	- If Pages shows caching, trigger a fresh deployment instead of asking the user to clear cache.

6. Edit safety:
	- Avoid destructive multi-insert/duplicate edits. After any multi‑line file rewrite, re-open the file and re-run `npm run build` to catch syntax errors before committing.
	- Do not leave the workspace with unresolved lint/type/build errors.

7. Communication:
	- Do not claim success until all checks pass. If waiting is required, wait long enough (≥6 minutes) and then re-check.
	- No “please try” language—perform steps yourself and provide results.

These rules are binding for this repository.
