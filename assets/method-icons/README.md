# Delight & Savor method icons

Canonical four-part method:

1. Find It — acorn
2. Follow It — oak leaf
3. Frame It — oak tree
4. Keep It — open commonplace book

Keep It completes the cycle rather than adding to it: find the thing, follow its
development, frame its meaning, keep what became yours. It covers narration,
commonplace entries and composition.

Visual direction: monochrome juniper (#3F6260), transparent background,
naturalist-inspired line drawing, consistent visual weight, no text baked into
the images.

## Where the assets live

The production files are in **`/images/`**, not in this folder — that is where
every page references them from.

| Move | Line art (the shorthand) | Colour (used once) |
| --- | --- | --- |
| Find It | `images/method-acorn.png` | `images/method-acorn-color.png` |
| Follow It | `images/method-leaf.png` | `images/method-leaf-color.png` |
| Frame It | `images/method-oak.png` | `images/method-oak-color.png` |
| Keep It | `images/method-book.png` | `images/method-book-color.png` |

Line art is normalised to a 200px height (45–86KB each); colour to 340px
(142–336KB). All eight are transparent PNGs, trimmed to the artwork.

## How they are used

The **juniper line art is the recurring shorthand** — the homepage methodology
row, the Teacher's Notebook analytical framework, and the step cards on both
Summer Foundations pages.

The **colour set appears exactly once**, on `philosophy.html`, where the method
gets its full explanation. Using it more would tip the site from literary toward
botanical.

Labels and descriptions are native HTML/CSS in each page, never baked into the
artwork, so the rows restack on a phone and screen readers get real text. The
images carry `alt=""` and sit in an `aria-hidden` wrapper because the adjacent
type already names each move.

Referenced by: `index.html`, `philosophy.html`, `teachers-notebook.html`,
`Summer-Foundations-Sales-Page.html`, `summer-foundations-omam.html`.

## If you replace an asset

Keep the same filename and the pages pick it up with no code change. Export a
genuinely transparent PNG — several of the originals were stock previews with
the transparency checkerboard baked in as opaque pixels, which had to be
flood-filled back out.
