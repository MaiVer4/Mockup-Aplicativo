# EventFlow AI — Mockup Funcional Interactivo

Mockup funcional y demostrativo de alta fidelidad para el flujo de trabajo de gestión de eventos institucionales, análisis y abstracción de hojas de cálculo Excel mediante un modelo de Inteligencia Artificial, y control de asistencia con accesos basados en roles.

---

## 🚀 Cómo Ejecutar la Aplicación

El servidor de desarrollo ya se encuentra configurado y corriendo:

```bash
# Para iniciar o reiniciar el servidor de desarrollo en cualquier momento:
npm run dev
```

Abre en tu navegador favorito:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🎯 Flujo de Trabajo y Características Implementadas

### 1. Autenticación y Control de Acceso por Roles
En la barra superior encontrarás un **selector rápido de perfiles** y en el pie de página un **Modal de Login clásico**:
- **Admin General** (*Ing. Carlos Mendoza*):
  - Acceso total a todas las áreas (Música, Deportes, etc.).
  - Capacidad de subir archivos Excel de cualquier categoría.
  - Gestión completa de eventos (Publicar, Habilitar asistencia, Editar, Cerrar).
  - Acceso a métricas globales consolidadas.
- **Admin por Área - Música** (*Prof. Elena Ríos*):
  - Visualización y gestión restringida exclusivamente a eventos y métricas de **Música**.
- **Admin por Área - Deportes** (*Lic. Mateo Silva*):
  - Visualización y gestión restringida exclusivamente a eventos y métricas de **Deportes**.
- **Aprendiz** (*Sofía Castillo*):
  - Acceso restringido exclusivamente a la cartelera de eventos programados para el **día de hoy** que estén en estado *Publicado*.
  - Puede confirmar/marcar su asistencia en aquellos eventos donde el coordinador haya activado la opción *"Habilitar Asistencia"*.

---

### 2. Carga de Excel & Modelo de IA
Ubicado en la pestaña **"Carga Excel & IA"**:
- **Arrastrar y Soltar**: Admite archivos `.xlsx`, `.xls` y `.csv`.
- **Plantilla Oficial**: Botón *"Descargar Plantilla .xlsx"* que genera al instante un archivo Excel de ejemplo en tu computadora con las columnas requeridas (*Título*, *Propósito*, *Área*, *Capacidad*, *Horario*, *Lugar*).
- **Modo Demo con 1 Clic**: Botón para probar la experiencia completa sin necesidad de tener un archivo a mano.
- **Pipeline Visual de IA**:
  1. *Parseo Tabular*: Lectura de cabeceras y celdas.
  2. *Inferencia Semántica*: El modelo analiza y abstrae puntualmente el **Título** y el **Propósito** del evento.
  3. *Generación Visual*: Asignación automática de imágenes de alta resolución según la temática detectada (instrumentos musicales, canchas deportivas, etc.).
- **Previsualización e Importación**: Se muestran las tarjetas abstraídas con puntuación de confianza de la IA antes de incorporarlas en modo Borrador al sistema.

---

### 3. Tarjeta y Ciclo de Vida del Evento (Los 4 Botones de Acción)
Cada evento cuenta con:
- **Título**, **Propósito formativo** e **Imagen representativa**.
- **Área**, **Fecha**, **Horario**, **Lugar** y **Contador de Asistentes vs Aforo**.
- **Controles Operativos**:
  1. **Publicar Evento** / *Despublicar*: Cambia el estado entre Borrador y Publicado.
  2. **Habilitar Asistencia** / *Pausar*: Abre o cierra la posibilidad de que los aprendices se registren.
  3. **Editar Evento**: Abre un modal interactivo para modificar cualquier dato del evento.
  4. **Cerrar Evento**: Finaliza el evento definitivamente y congela las métricas para histórico.

---

### 4. Dashboard Informativo y Métricas en Tiempo Real
Ubicado en la pestaña **"Dashboard & Métricas"**:
- **KPIs Ejecutivos**: Total de Eventos, Total de Asistencias Acumuladas, Eventos con Asistencia Abierta en este instante, y Tasa de Ocupación global.
- **Gráfico Comparativo**: Barras visuales dinámicas de asistencia vs capacidad por evento.
- **Distribución de Estados**: Conteo de eventos Publicados, con Asistencia Abierta, Borradores y Cerrados.
- **Filtros Avanzados**: Búsqueda por texto en tiempo real, filtro por área y filtro por estado.
- **Tabla Maestra**: Permite ejecutar directamente los 4 botones de acción sobre cada fila.

---

### 5. Portal del Aprendiz (Simulación en Vivo)
- Vista limpia y moderna diseñada para el estudiante.
- Muestra el listado de eventos programados para la fecha actual.
- Al hacer clic en **"Confirmar / Aceptar Asistencia"**:
  - Se lanza una animación de confeti 🎉.
  - La tarjeta cambia a *"Asistencia Confirmada ✓"*.
  - El contador de asistentes se incrementa en vivo y se refleja inmediatamente en el Dashboard del Administrador.

---

### 6. Persistencia y Restablecimiento
- Todos los cambios (eventos creados, estados modificados, asistencias marcadas) se conservan en el `localStorage` del navegador para que no se pierdan al recargar.
- En la barra superior hay un botón **"Restablecer"** que permite volver a los datos de fábrica en cualquier momento con un solo clic.
