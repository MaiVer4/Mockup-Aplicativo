# Visual flow RF alignment
A visual-flow refinement for the SENA Bienestar mockup.
Branch: `feat/visual-flow-rf-alignment`

## Specs
1. **S1 — Visual-only evaluation:** "Solo quiero que hagas una verificacion si esta visualmente bien el flujo"
2. **S2 — RF/prompt traceability:** "Debes evaluar de que lo que te envie de RF, y el prompt este bien visualmente en el flujo"
3. **S3 — RF-03 recovery:** "ROL APRENDIZ: Autenticar con google o documento y contraseña, cerrar sesión y recuperar acceso de forma segura via email"
4. **S4 — RF-04 profile:** "ROL APRENDIZ: Permitir al aprendiz consultar/actualizar su perfil; aplicar cambios solo a futuras participaciones y conservar instantánea histórica."
5. **S9 — Learner profile fields and password:** "quiero que se puedan editar todos los campos de ese usuario de aprendiz desde el perfil, tambien quiero que añadas en perfil lo del cambio de contraseña."
6. **S10 — Learner registration email:** "En el formulario de registro de aprendiz en el login o registro quiero que quites le campo obligatorio de Correo SENA"
7. **S11 — Training center lock:** "Quiero que el centro de formacion en el perfil no se pueda modificar"
7. **S5 — RF-08 lifecycle:** "ROL ENCARGADO_AREA: Publicar actividad aprobada con ventana de apertura/cierre y estados controlados. Solo la actividad aprobada y publicada, con ventana activa, acepta participaciones."
8. **S6 — RF-11 notifications:** "ROL ENCARGADO_AREA: Notificar automaticamente via email las publicaciónes de actividades, sus cambios, su apertura/cierre y cancelación"
9. **S7 — RF-15 supervision:** "ROL ADMIN: Ver todas las actividades, métricas de cada encargado, métricas de asistencias a las actividades y de usuarios de la pataforma."
10. **S8 — Role restrictions:** The visual flow must make the administrator a supervisory role and the area manager the operational role; the learner flow must make onboarding, billboard, detail, attendance, and history legible as separate stages.

## Tasks
- T1 (S1-S4, S9-S11): Improve learner recovery, onboarding/profile, history, all permitted profile fields, locked training center, password entry point, and registration email flow. Route: Login → registration/Google → onboarding/profile/password → billboard → attendance/history. Commit: 531b8e9 plus pending correction.
- T2 (S5-S6): Improve event lifecycle visuals with approval, opening/closing window, cancellation, and notification states. Route: import → review → draft → publish → active window → final/cancelled. Commit: 68d75e0.
- T3 (S7-S8): Clarify administrator supervision and role boundaries in dashboard/navigation copy. Route: admin dashboard → activities/metrics/users/audit. Commit: 68d75e0.
- T4 (S1-S8): Run structural/build checks and record visual-flow verification limitations. Commit: pending.

## Log
L1: Quiero que hagas esta verificacion de funcionalidades y que cumpla con los requisitos:

 Warning: Gentle AI: receipt-driven-development status is unavailable: native `gentle-ai review mode status` failed (package-local-binary-missing)

Tambien tienes este archivo @REQUISITOS_DEPURADOS_v2.docx que debes tener muy en cuenta por si el mockup comple con las funcionalidades
L2: User clarified: "Osea solo es el mockup visual"
L3: User clarified: "No es nada de funcionalidad"
L4: User clarified: "Solo quiero que hagas una verificacion si esta visualmente bien el flujo"
L5: User clarified: "Debes evaluar de que lo que te envie de RF, y el prompt este bien visualmente en el flujo"
L6: User authorized implementation after the visual assessment: "Revisa que no hayan cambios en github por traer y traelos ... Y luego implementa las mejoras que me dijiste"
L7: Remote evidence: `git fetch origin --prune`; `HEAD...origin/main` = `0 0`; only untracked `REQUISITOS_DEPURADOS_v2.docx` exists locally.
L8: Implementation evidence: commit `68d75e0` added visual-only RF alignment for learner recovery/profile/history, event lifecycle, RF-11 notification legend, and admin supervision boundaries. `git diff --check` passed. `npm run build` remained unavailable because Vite was not installed; `npm install --ignore-scripts` timed out.
L9: User requirement change: "quiero que se puedan editar todos los campos de ese usuario de aprendiz desde el perfil, tambien quiero que añadas en perfil lo del cambio de contraseña." and "En el formulario de registro de aprendiz en el login o registro quiero que quites le campo obligatorio de Correo SENA". Reopen T1; update S4 and add S9-S10.
L10: T1 implementation evidence: all permitted learner profile fields are editable from Mi Perfil, Centro de Formación remains institution-controlled, the learner shell exposes Cambiar contraseña, and registration accepts any email while treating Correo SENA as optional. `git diff --check` passed and Vite returned HTTP 200 for `/`, `/src/App.jsx`, and `/src/views/ApprenticePortal.jsx`.
L11: User correction: "Quiero que el centro de formacion en el perfil no se pueda modificar". Keep the field visible but disabled/read-only in Mi Perfil.
