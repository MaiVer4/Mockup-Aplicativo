# Visual design cleanup
A readability pass for dense SENA Bienestar mockup surfaces.
Branch: `feat/visual-design-cleanup`

## Specs
1. **S1 — User intent:** "Quiero que ahora añadas una nueva rama donde quiero que mejoremos el diseño visual, ya que se estan viendo algunas secciones sobrecargaddas de informacion o que cansan la vista"
2. **S2 — Preserve visual traceability:** Existing learner, area-manager, and administrator flows must remain recognizable while reducing repeated copy, dense blocks, and visual fatigue.
3. **S3 — Density goals:** Dense surfaces should use progressive disclosure, shorter supporting copy, quieter secondary metadata, and clearer primary actions without removing RF-relevant labels or states.

## Tasks
- T1 (S1-S3): Refine the learner/admin entry and dashboard hierarchy without changing role routes or actions. Route: Login → role portal/dashboard. Commit: pending (current work).
- T2 (S1-S3): Reduce density in participant filters and event detail/lifecycle surfaces while preserving RF-08/RF-09/RF-10/RF-11 visual cues. Route: event detail → participants/export. Commit: pending (current work).
- T3 (S1-S3): Run structural and Vite-served module checks; record any unavailable production build evidence. Commit: pending.

## Log
L1: "Quiero que ahora añadas una nueva rama donde quiero que mejoremos el diseño visual, ya que se estan viendo algunas secciones sobrecargaddas de informacion o que cansan la vista"
L2: Branch evidence: `feat/visual-design-cleanup` created from `feat/visual-flow-rf-alignment`; no source edits existed at branch creation.
L3: Initial hotspots selected from source review: Login role chooser and explanatory copy, Dashboard admin tabs/stat hierarchy, Participants six-filter panel, and EventDetailModal lifecycle/metadata/cover-management sections.
L4: Implementation evidence: advanced participant filters are progressive disclosure, mobile Login role descriptions are quieter, Dashboard tabs shorten on narrow screens, and EventDetailModal lifecycle/cover/status copy is condensed. `git diff --check` passed and Vite module smoke checks returned HTTP 200 for LoginView, DashboardView, ParticipantsView, and EventDetailModal.
