# Soma Digital — Horizon design prototype

A single-page installable PWA prototype of the **Horizon** design direction for
Soma Digital, a daily spiritual discovery app. Six screens — Home, Devotional
Detail, Kingdom Scrolling, Connect, Pray, Settings — switched client-side with
no page reload.

**This is a design prototype.** All content is sample data (see the
`SAMPLE_DATA` object at the top of the script in `index.html`). There is no
backend and nothing is persisted.

## Design language

- Achromatic: every surface, label and divider is paper, ink or graphite.
  The only chromatic colour is photography; actions use a single deep petrol
  green (`#0E3B37`).
- One primary object per screen, large controls, generous space.
- No shadows, no gradients (except one dark scrim under text on photography),
  no blur, no translucency. Separation comes from space and 1px hairlines.
- Inter only. Radius 4px only, on buttons and the video card.

## Run

Any static file server, e.g.:

```
python3 -m http.server 4179
```

Then open `http://localhost:4179`. Test viewport: 393×852.

Built as plain HTML/CSS/JS — no build step, no dependencies. Installable as a
PWA (manifest + service worker; opens offline after first load).
