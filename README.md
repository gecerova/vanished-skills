# Ottoman Lost Professions Website

This is a static site that reads data from a Google Spreadsheet via Sheet.best and displays entries as vertical cards. You can filter by Profession or Craft. Deployed on GitHub Pages.

## Setup

1. Clone repo.
2. Replace `LOGO_URL_HERE` in `index.html` with your logo’s URL.
3. Commit and push to GitHub.
4. In repo settings, enable GitHub Pages from `main` branch root.
5. Visit `https://<yourusername>.github.io/<repo>`.

## How it works

- Fetches data from Sheet.best as JSON.
- Filters using dropdown buttons.
- Renders cards with entry name, category, image, description.
