# SENA Bienestar al Aprendiz — Mockup Funcional Interactivo (v2.0)

Prototipo interactivo de alta fidelidad para la gestión de actividades y control de asistencia de **Bienestar al Aprendiz del Servicio Nacional de Aprendizaje (SENA)**. Diseñado conforme a los **Requisitos Funcionales v2 (requisitos1.txt)**, los **Requisitos Depurados (requisitos2.txt)** y el **Levantamiento Base (requisitos3.txt)**.

---

## 🚀 Cómo Ejecutar la Aplicación

El proyecto está construido con React 18, Vite y Tailwind CSS:

```bash
# Iniciar el servidor de desarrollo:
npm run dev

# Compilar para producción:
npm run build
```

Acceso local: 👉 **[http://localhost:3000](http://localhost:3000)** (o el puerto asignado por Vite).

---

## 🎯 Arquitectura de Roles y Módulos Implementados

### 1. Administrador General (Coordinación de Bienestar)
*Persona representativa: Ing. Carlos Mendoza*
- **Panel Exclusivo de Supervisión y Métricas (RF-15)**:
  - **Ver Todas las Actividades**: Supervisión transversal centralizada de todas las actividades institucionales generadas por cualquier encargado o área, con filtros por categoría y estado de ciclo de vida (*Borrador, Publicado, En Curso, Finalizado*).
  - **Métricas de Cada Encargado**: Tabla comparativa y KPIs individuales por administrador de área (volumen de actividades creadas/gestionadas, asistencias totales convocadas, promedio de aprendices por evento y tasa de cumplimiento frente a metas Excel).
  - **Métricas de Asistencias a las Actividades**: Acreditaciones efectivas registradas con marca temporal inmutable, comparativa de cupo proyectado vs. real y evolución temporal/semanal.
  - **Métricas de Usuarios de la Plataforma**: Censo institucional con aprendices con perfil oficial completo vs. pendientes de onboarding inicial (RF-01, RF-02), distribución de usuarios por programa formativo, modalidad y aprendices únicos auditados.
- **Gestión de Encargados (RF-14, RF-16)**: Directorio de administradores de área con actividades asignadas y estado de cuenta.
- **Generación de Enlaces Exclusivos (RF-ADM-03, RF-ENC-01)**: Generador y revocador de URLs con token para el registro exclusivo de encargados por área.
- **Consulta de Aprendices y Auditoría (RF-ADM-05, RF-05)**: Buscador individual de aprendices y su historial de participaciones auditadas con marcas temporales inmutables de servidor.
- **⛔ Restricciones Normativas**: No puede crear, editar ni eliminar eventos (`RF-ADM-02`), ni descargar reportes operativos (`RF-ADM-06`).

---

### 2. Administrador de Área (Encargado)
*Personas representativas: Elena Ríos (Cultura), Lic. Mateo Silva (Actividad Física), Dra. Patricia Gómez (Prevención)*
- **Ingesta del Plan Anual con IA (RF-ENC-08 a RF-ENC-16)**:
  - Carga de archivo Excel multi-hoja (`Actividades 2026.xlsx`) o prueba demo con 1 clic.
  - Selección de hoja de categoría institucional y trimestre.
  - Detección de expresiones ambiguas (`RF-06`: *"por solicitud"*, *"todo el mes"*, *"según programación"*) con bloqueo preventivo de publicación hasta confirmación de fecha.
  - Generación y regeneración de portadas temáticas con IA (`RF-ENC-14, 15`).
  - Aprobación humana antes de incorporar actividades al catálogo en estado **Borrador**.
- **Ciclo de Vida de 4 Estados (RF-ENC-17 a RF-ENC-28)**:
  1. `Borrador`: Actividad creada o aprobada; solo visible para el encargado.
  2. `Publicado`: Visible para los aprendices en cartelera institucional; muestra información logística y estado programado.
  3. `En Curso`: Asistencia habilitada para confirmación presencial con 1 clic.
  4. `Finalizado`: Asistencia deshabilitada; métricas congeladas y lista para exportar.
- **Control de Aforo y Asistencias (RF-ENC-29)**: Monitoreo en tiempo real de asistencias efectivas confirmadas en sala respecto al cupo proyectado en Excel.
- **Exportación Oficial Formato GOR-F-013 (RF-ENC-30, RF-13, RF-14)**:
  - Auditoría previa de integridad (valida campos obligatorios, documentos únicos y firmas temporales).
  - Descarga real de archivo `.xlsx` estructurado con la cabecera institucional oficial del SENA y las filas de los participantes.

---

### 3. Aprendiz SENA
*Personas representativas: Sofía Castillo (Perfil Completo), Juan Pablo Duarte (Nuevo Ingreso)*
- **Onboarding Obligatorio Bloqueante (RF-APR-02, RF-APR-08)**: Si el aprendiz ingresa por primera vez o con perfil incompleto, una ventana modal bloquea la pantalla exigiendo diligenciar los 12 datos institucionales (Documento, Género, Ficha, Modalidad, Programa, Jornada, Nivel, Centro, Teléfono). Incluye botón para autocompletar datos de prueba.
- **Cartelera Pública (RF-APR-12)**: Acceso a todos los eventos en estado publicado o posterior, sin filtros restrictivos de centro ni programa.
- **Asistencia Presencial en 1 Clic con Firma Temporal Digital (RF-APR-18 a 21, RF-05)**: Habilitada cuando el evento está *En Curso*. Genera un timestamp inmutable del servidor (`YYYY-MM-DD HH:mm:ss`), animación de confeti 🎉 e impide duplicados.
- **Detalle Extendido (RF-APR-14)**: Modal de consulta rápida con metodología, propósito y aforo.
- **Historial Personal (RF-APR-23)**: Bitácora de participaciones con estado (*Asistió*) y fecha de registro con firma temporal de servidor.
- **Regla de Edición Mensual (RF-APR-10)**: Vista de configuración con bloqueo de cambios a una sola vez por mes por campo.

---

### 4. Notificaciones por Correo Electrónico Simuladas (RF-NOT-02 a RF-NOT-04)
- Bandeja interactiva accesible desde el icono de sobre en la barra superior.
- Muestra los correos generados automáticamente por el sistema:
  - Notificación de asistencia presencial al aprendiz (`RF-NOT-02`).
  - Notificación de publicación de evento al encargado del área (`RF-NOT-03`).

---

## 📂 Formatos y Archivos Institucionales Incluidos

1. **Plantilla Oficial Plan Anual (`Plan_Anual_Bienestar_SENA_2026.xlsx`)**: Descargable desde la vista de Carga Excel; contiene las 6 hojas de categorías SENA (*Cultura, Prevención, Habilidades, Actividad Física, Arte, Liderazgo*) con columnas oficiales y casos de prueba con expresiones ambiguas.
2. **Plantilla Oficial de Asistencia GOR-F-013 (`Listado ejemplo.xlsx`)**: Exportable desde cualquier evento con asistentes; incluye metadatos institucionales (Ciudad/Fecha, Regional, Centro, Objetivos, Propósito) y las columnas normativas de participantes junto con su marca temporal digital inmutable.
