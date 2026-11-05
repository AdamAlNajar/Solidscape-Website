# Graph Report - Unit3_CS_Project  (2026-11-05)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 35 nodes · 48 edges · 9 communities (6 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 18,992 input · 118 output

## Graph Freshness
- Built from commit: `9b3b5770`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Express Contact Server
- Lightbox and Menu UI
- Package Metadata
- Dotenv Dependency
- Form Validation
- Contact Form Submission
- Express Dependency
- Nodemailer Dependency
- NPM Start Script

## God Nodes (most connected - your core abstractions)
1. `setUpContactForm()` - 5 edges
2. `clearError()` - 4 edges
3. `validateForm()` - 4 edges
4. `setUpLightbox()` - 3 edges
5. `showError()` - 3 edges
6. `sendForm()` - 3 edges
7. `updateCharCount()` - 3 edges
8. `express` - 3 edges
9. `nodemailer` - 3 edges
10. `closeLightbox()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `setUpContactForm()` --calls--> `clearError()`  [EXTRACTED]
  script.js → script.js  _Bridges community 4 → community 5_

## Import Cycles
- None detected.

## Communities (9 total, 3 thin omitted)

### Community 0 - "Express Contact Server"
Cohesion: 0.29
Nodes (5): app, express, nodemailer, path, PUBLIC_FILES

### Community 1 - "Lightbox and Menu UI"
Cohesion: 0.43
Nodes (6): closeLightbox(), LIMITS, openLightbox(), setUpLightbox(), setUpMenu(), toggleMenu()

### Community 2 - "Package Metadata"
Cohesion: 0.33
Nodes (5): description, main, name, private, version

### Community 3 - "Dotenv Dependency"
Cohesion: 0.67
Nodes (3): dependencies, dotenv@^16.4.7, dotenv

### Community 4 - "Form Validation"
Cohesion: 1.00
Nodes (3): clearError(), showError(), validateForm()

### Community 5 - "Contact Form Submission"
Cohesion: 1.00
Nodes (3): sendForm(), setUpContactForm(), updateCharCount()

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `Express Dependency` to `Express Contact Server`, `Package Metadata`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `nodemailer` connect `Nodemailer Dependency` to `Express Contact Server`, `Package Metadata`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Dotenv Dependency` to `Package Metadata`, `Express Dependency`, `Nodemailer Dependency`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._