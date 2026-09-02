# Data Engineering Fundamentals — Quiz Practice

A static, multi-subject quiz-practice app. Pick a **subject**, a **scope** (a single
chapter/module, or "Mixed" to pool everything in that subject), and **how many
questions** you want. The app pulls that many at random from the scope, walks you
through them one at a time with immediate right/wrong feedback and an explanation,
and — for anything you get wrong — shows the correct answer in a review list at the
end. Your best score and attempt count per scope are saved in your browser's
`localStorage`.

Subjects bundled today:

- **Fundamentals of Data Engineering** (Joe Reis & Matt Housley) — every chapter and
  appendix, grounded directly in the book's text.
- **DP-700: Microsoft Fabric Data Engineer** — 6 modules (241 questions) generated
  from the official module source files.

Fully static: no backend, no API keys, no build-time network calls. Deploys to
GitHub Pages.

## How the question bank is built

Each subject lives under `subjects/<subject>/` and contains a `source/` folder plus
hand-authored question files:

```
subjects/
  fundamentals-of-data-engineering/
    source/                    # book chapters (reference)
    questions/chapter-3.json   # practice questions
    questions-terms/           # key-terms questions
  dp-700/
    source/                    # module files M1.1.md … M6.1.md
    questions/module-1.json    # practice questions per module
```

Question files are JSON with the shape
`{ "questions": [{ question, options, correctIndex, explanation }, ...] }`.

`scripts/build-questions.mjs` merges each subject's question files with chapter or
module metadata into `public/data/questions.json` — the single file the app fetches
at runtime — shuffling each question's option order along the way so the correct
answer's position carries no pattern. This is a deterministic local merge with no
external calls; it runs automatically before `dev` and `build`.

For module-based subjects (like dp-700), the build derives module numbers by scanning
`subjects/<id>/source/` for files named `M<number>.<part>.md` and groups them into a
single scope per module. Add a new subject by adding a folder under `subjects/` and an
entry in the `SUBJECTS` list in `scripts/build-questions.mjs`.

To add or edit a question, edit the relevant file under `subjects/<subject>/questions/`
(or add a new `subjects/<subject>/questions/<chapterId>.json` file) and rerun the build —
no other step is required.

## Development

```
npm install
npm run dev        # local dev server
npm run build      # build the question bank + static site into dist/
npm run preview    # serve the production build locally
```

## Deploy to GitHub Pages

1. Push this repo to GitHub (branch `main`).
2. In the repo settings: **Settings → Pages → Source: GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and deploys on every
   push to `main`. It needs no secrets — the question bank is fully static.

## Tech stack

- [Vite](https://vitejs.dev) + TypeScript (no UI framework)
- Progress (best score, attempt count per scope) stored in `localStorage`
