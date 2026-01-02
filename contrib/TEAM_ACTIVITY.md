# Team Activity Board (Work in Progress)

Quick snapshot of what the team is actively working on. Update your branch status here as you work.

## Current Active Work
| Developer | Branch | Feature | Status | Started | Estimated |
|-----------|--------|---------|--------|---------|-----------|
| (Team) | feat/landing-cloudflare | LANDING_PAGE_CDN | planned | - | - |
| (Team) | feat/npm-package | NPM_PACKAGE_EXPORT | planned | - | - |
| (Team) | feat/cicd | GITHUB_ACTIONS_PUBLISH | planned | - | - |
| (Team) | feat/docker | DOCKER_SETUP | planned | - | - |

## How to use
1) **When starting a feature**: Add a row with your name, branch, and feature flag ID from `contrib/feature-flags.yaml`
2) **Daily updates**: Update the Status column (planned → active → ready for review)
3) **When merging**: Move to "Completed" section; update `feature-flags.yaml` status as well
4) **Clean up regularly**: Remove entries older than 2 weeks (completed features)

## Completed Recently
| Developer | Branch | Feature | Merged | Notes |
|-----------|--------|---------|--------|-------|
| OpenTheDoorz Team | feat/ui | WALLET_QR_CODE, TOKEN_SELECTOR_DROPDOWN, ADDRESS_ACTIVITY_LINK | 2026-01-02 | UI implementation with real-time balances |

## Tips
- Sync this board with `contrib/feature-flags.yaml` for consistency
- Use branch names from the flags registry
- Quick way to see what's blocking you or what teammates are doing
