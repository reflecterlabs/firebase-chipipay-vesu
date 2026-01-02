# Contributing (Trunk-Based Workflow)

This repo follows a lightweight trunk-based workflow with small, short-lived branches and feature flags. The goal: trunk always deployable, low-friction merges, quick rollback via flags, and **transparent contributor coordination**.

## Workflow for developers

### Step 1: Plan and Announce
- Create branch from `trunk`: `git checkout -b feat/feature-name`
- If feature involves multiple files or will be developed over days, **announce it early**
- Update `contrib/feature-flags.yaml` with the new flag (set `status: planned`)
- Push to remote so contributors see what's in progress: `git push origin feat/feature-name`

### Step 2: Develop Behind Flags
- Add flag to both `lib/config/featureFlags.ts` (code) and `contrib/feature-flags.yaml` (docs) with `default: false`
- Wrap new code: `if (isEnabled('MY_FLAG')) { ... }`
- Keep commits small and logical; rebase on `trunk` daily to avoid drift
- **Update `contrib/feature-flags.yaml` daily** with progress (change `last_updated`, add notes if needed)

### Step 3: Check for Overlaps
- Before opening PR, review `contrib/feature-flags.yaml` to see what contributors are working on
- Use `git diff trunk --stat` to inspect scope and ensure no unexpected conflicts
- If your changes overlap with another contributor's branch, coordinate via the registry or async comments.

### Step 4: Rebase and Merge
- `git fetch origin && git rebase origin/trunk` to include latest changes
- Ensure flag is still set correctly (default `false` if not fully ready)
- Mark flag status in `contrib/feature-flags.yaml` (e.g., `status: active` if merging ready code, or `status: cleanup` if it's stable enough to remove)
- Open PR with clear notes on what's changing

### Step 5: Post-Merge (if applicable)
- If feature is validated, flip flag to `true` in a separate small commit: this signals "feature is live"
- After 2-3 stable releases, remove flag and dead code in a cleanup PR

## Branching and cadence
- Branch from `trunk`; keep branches short-lived (ideally < 3 days).
- Rebase/merge from `trunk` daily to avoid drift.
- Prefer small PRs: target < 10 files or < 500 LOC. If larger, split.
- Make changes additive when possible (add new code/flags instead of rewriting). 
- Use feature flags for incomplete work; default to `false` until the feature is ready.

## Hotspot files and rules
- `.env.example`: add-only, no renames/deletes; keep alphabetical; dummy values only. List new vars in the PR.
- `package.json` / lockfiles: avoid large upgrades inside feature branches; do them in dedicated chore PRs.
- `lib/config/featureFlags.ts` and `contrib/feature-flags.yaml`: add flags; do not rename; remove in a cleanup PR once stable.
- Design tokens / `tailwind.config.js`: add tokens minimally; group stylistic changes in a focused PR.
- Shared config (auth/network): call out changes explicitly in the PR if modified.

## Feature flags (no Remote Config in the SDK)

Feature flags serve **two purposes**:
1. **Code control**: Merge incomplete features to trunk without breaking prod (safe defaults)
2. **Contributor visibility**: See who's working on what and their progress in `contrib/feature-flags.yaml`

### How to use
1) Add flag to **both**:
   - `lib/config/featureFlags.ts` (code that runs)
   - `contrib/feature-flags.yaml` (contributor documentation with status, date)
2) Develop behind the flag (do not break the existing path).
3) Keep `contrib/feature-flags.yaml` updated as you work (update `last_updated` daily, note status changes)
4) Turn flag `true` when validated and ready to activate.
5) Cleanup: remove flag and dead code after a couple of stable releases.

### Rollback
If a flagged feature causes issues, flip the flag to `false` in `featureFlags.ts` (one-line change) and deploy; no need to revert the whole merge.

## Working in parallel / conflict avoidance
- **Check `contrib/feature-flags.yaml` before starting**: see what others are building
- Announce when touching hotspot files (env, flags, config, design tokens) in the registry or PR notes.
- Keep changes additive (especially env and flags) to reduce conflicts.
- Before opening a PR, use the checklist in `contrib/scope-checklist.yaml` and inspect scope: `git diff trunk --stat` and `git diff trunk --name-only`.
- Rebase onto latest `trunk` before requesting review.
- If env conflicts arise, keep both additions, re-sort, and update the PR notes on new vars.

## PR expectations
- Describe scope and list hotspot changes (env/flags/config).
- Note new env vars and their purpose.
- Specify flag defaults and planned cleanup if applicable.
- Mention if flag was already registered in `contrib/feature-flags.yaml` or if this PR adds it.
- Keep tests/build green; mention what was run.

### PR template snippet
```
## Resumen
- ...

## Cambios en config/env/flags
- featureFlags: agrega FLAG_LENDING_V2 (default false), registrado en contrib/feature-flags.yaml
- .env.example: agrega API_FOO_BASE_URL (dummy)

## Rollout / flags
- FLAG_LENDING_V2=false (activar cuando esté listo; ver contrib/feature-flags.yaml)

## Tests
- npm test / lint / dev smoke
```

## Defaults for SDK consumers
- Do not require Firebase Remote Config or external setup.
- Feature flags should work with env defaults only; Remote Config is for internal use only if ever needed.
