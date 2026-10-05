# Vega Saavn Provider

A Vega App provider for searching and streaming JioSaavn/Saavn songs through Vega's provider system.

## Install

1. Push this repository to GitHub.
2. In Vega, open **Settings → Extensions/Providers → Add Source**.
3. Enter the full GitHub repository URL.
4. Install **Saavn**.

This provider targets the current Vega provider API (`Post`/`Info`/`Stream`).

## Important

This is a third-party provider using an unofficial/public Saavn API. Vega does not host the media. Availability of API endpoints and stream URLs can change.

The provider focuses on song search and playback. It does not reproduce Echo's native music queue/background-player UI.

## Files

- `providers/saavn/catalog.ts` — home categories
- `providers/saavn/posts.ts` — Saavn search/feed
- `providers/saavn/meta.ts` — song metadata
- `providers/saavn/stream.ts` — audio stream choices
- `providers/saavn/settings.ts` — quality preference
- `manifest.json` — provider registration

## Build

This repository follows the Vega provider template. Run:

```bash
npm install
npm run build
```

Then commit the generated `dist/` directory.

Reference: https://github.com/vega-org/providers-template
