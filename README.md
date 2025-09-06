# Delta
Delta is a full-scale stock market simulation software which can be personalised for any education setting. The platform allows for an admin portal, and real-time stock trades.

 <!-- LANGUAGES BREAKDOWN START -->
 [ LANGUAGES BREAKDOWN ]

JavaScript   --> 142,485 lines
TypeScript   --> 112,323 lines
JSX          --> 20,312 lines
PHP          --> 5,248 lines
Others       --> 8,921 lines

[ TOTAL LINES OF CODE: 289,289 ]
<!-- LANGUAGES BREAKDOWN END -->

The workflow will update the stats between these markers.  
*Remove `(STATIC EXAMPLE)` when adding it in your README, as it's just a placeholder. It's included here only to prevent automatic updates in this README.*

### Configure languages

The workflow uses cloc **language names** (not file extensions).

- **HIGHLIGHT_LANGS** → languages shown individually in the README; everything else is grouped under **Others**  
- **IGNORE_LANGS** → languages dropped completely (not shown, not counted)

Edit these in `.github/workflows/analyze-code.yml` under the job `env:` block:

```yaml
env:
# Use cloc LANGUAGE NAMES (not extensions). Example: "Vuejs Component" for .vue, "C#" for C#
# HIGHLIGHT_LANGS: show these languages individually; everything else goes to "Others"
HIGHLIGHT_LANGS: "JavaScript,TypeScript,JSX,Vuejs Component,PHP,C#"

# IGNORE_LANGS: drop these languages entirely (not shown and not counted)
IGNORE_LANGS: "JSON,HTML,CSS,SCSS,Sass,Markdown,SVG,XML,YAML,TOML,CSV,Text,Properties"
```
