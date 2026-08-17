# Scripture Cards site

## Run locally

The JSON files need to be loaded over HTTP, so opening `index.html` directly with a `file://` URL will not work reliably. This repository includes a zero-dependency local server:

```powershell
npm run dev
```

Then open <http://127.0.0.1:4173> in a browser. No `npm install` step is required.

To use another port in PowerShell:

```powershell
$env:CARD_SITE_PORT = "8080"
npm run dev
```

## Test the data

Run the local data checks with:

```powershell
npm test
```

The tests verify:

- every card and question JSON file parses successfully;
- required fields contain valid values;
- IDs are unique within each file;
- localized Hidden Words and question files contain matching IDs;
- every referenced card image exists locally.
