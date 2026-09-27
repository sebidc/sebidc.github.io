# sebi.dc

Sebi dela Cruz’s portfolio and project directory.

**Live:** https://sebidc.github.io/

## Pages

- `/` — Home
- `/about/` — Profile and tools
- `/work/` — Public websites and code projects
- `/directory/` — Searchable directory of pages and project sites
- `/socials/` — Social platforms and editable profile links

Project sites such as `/sebi.emojis/` are published from their own repositories. This site links to them without copying or replacing them.

## Update social links

Edit [content/socials.md](content/socials.md), replacing `PLACEHOLDER` with a public HTTPS URL. Email accepts a `mailto:` link. Empty and placeholder entries appear as “Link coming soon”. Remove a row to hide a platform; add a row for any additional service.

The live Socials page reads this file automatically. To also update the static fallback (used without JavaScript), rebuild the pages:

```sh
python3 scripts/build.py
```

Commit your changes, then push to `main`. GitHub Pages publishes from the repository root. No package installation is needed.

## Local preview

```sh
python3 -m http.server 8766
```

Open http://localhost:8766/.

## Design

Everforest Dark Soft colors, Agrandir titles, and Gramatika body text. Font files and original mascot were carried over from Sebi’s existing portfolio and emoji gallery. The previous Framer assets remain available in the repository for reference; the new pages use `/assets/`.
