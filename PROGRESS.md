# Progreso del proyecto

## Objetivo
Sistema con soft-delete para producto y usuario, responsive completo para proforma/carrito/header, y optimización de UX móvil.

---

## Constraints & Preferences
- Trabajo incremental ("poco a poco").
- Responsive prioriza realizar proformas desde celular fácil e intuitivamente.
- Soft-delete en producto con verificación de stock antes de desactivar.
- Menú lateral móvil debe cerrar con botón de retroceso Android (History API).
- Desktop en pantalla completa NO debe tener scroll horizontal.
- No usar hard DELETE ni en producto ni en usuario (preservar integridad referencial).
- Ceros a la izquierda en `codigo_smc_prod` deben conservarse (VARCHAR).

---

## Done

### Base de datos
- Creado `base de datos/migracion_20260704.sql` con todas las ALTER TABLE:
  - drop `proformas_temp`
  - rename `contraseña_usua` → `pass_usua`
  - ADD COLUMNs `activo_usua` / `ultimo_acceso`
  - cambios de tipo (INT→VARCHAR, FLOAT/DOUBLE→DECIMAL) en 30+ columnas
  - 21 índices, 22 FK faltantes
- Columna `activo_prod TINYINT(1) DEFAULT 1` en tabla `producto`
- Columna `activo_usua TINYINT(1) DEFAULT 1` en tabla `usuario`

### Soft-delete producto
- `readProducts()` en `consultasDeProductos.php` filtrado con `WHERE activo_prod = 1`
- `desactivar($id)` en modelo: verifica SUM de stock en inventario + inventario_arce; si > 0 retorna mensaje y no desactiva
- Endpoint `deactivateProduct` en `controladores/productos.php`
- Botón de desactivar (delete.svg) entre editar y seleccionar en `inventario.js`
- `searchInventories()` y `selectInventories()` agregan `if (!product) return false`
- `init()` filtra `filterInventories` después de carga paralela para excluir inventarios de productos desactivados

### Soft-delete usuario
- `readUsers()` en `consultasDeUsuarios.php`: se quitó `WHERE activo_usua = 1` — ahora devuelve todos los usuarios (activos e inactivos)
- `deleteUser()` existente: UPDATE `activo_usua = 0`
- Nuevo método `reactivarUser($id)` y endpoint en controlador
- `usuarios.js`: filas con `activo_usua == 0` reciben clase `.inactive-row` (fondo gris oscuro `#b0b0b0`)
- Usuarios inactivos: solo muestran botón ✅ reactivar (no editar/eliminar)
- Login (`comprobarUsuario.php`) ya bloquea usuarios con `activo_usua == 0`

### History API (menú lateral)
- `header.js`: `history.pushState({menu:'open'}, '')` al abrir menú
- Escucha `popstate` para cerrar el menú con botón de retroceso Android

### CSS Responsive
- `encabezamiento.css` reescrito: `position: sticky`, 4 breakpoints (1024/768/480px), nav lateral `width: 100%` en mobile, `transition: transform .3s ease`, fuente responsive
- `proforma.css` reescrito: sidebar responsive (1024px→28rem, 768px→columna), 4 breakpoints, cards adaptativas, inputs/labels 100% en mobile, columnas en unidades relativas, modalPdpf 95% en mobile
- `table.css` reescrito: inputs 100% en mobile, modales fullscreen en 480px, breakpoints

### Carrito móvil
- Barra inferior fija con total + conteo
- Sidebar se desliza desde abajo al tocarla
- Backdrop oscuro, cierra al tocar fuera
- Header de proforma (`#headerProduct`) compactado: padding reducido, selects en fila, labels `width: auto`

### Cards y grid
- Cards cuadradas con `aspect-ratio: 1` en todos los tamaños
- Grid columnas fijas: `repeat(4, 1fr)` desktop, `repeat(3)` 1024px, `repeat(2)` 768px/≤600px, `1fr` ≤480px
- Ícono PDF (`pdf.svg`) sobre la imagen si `catalogo_prod` no está vacío

### Fix `codigo_smc_prod`
- Quitado `JSON_NUMERIC_CHECK` en `readProducts()`
- Campos numéricos (`id_prod`, `fk_id_mrc_prod`, `fk_id_ctgr_prod`) casteados a `(int)` en PHP

### Guards `products.find()` en notaEntrega.js
Mismo patrón — 12 ocurrencias con guard:
- `pdfOrdenCompra()`: `if (!product) return;`
- `searchOCProd()`: `if (!ordenCompra || !producto) return false;`
- `tableOCProd()`: `if (!ordenCompra || !producto) return;`
- `createTable()`: `if (!oc_prod || !product) return;`
- `pdfNotaEntrega()`: `if (!product) return;`
- `tableNteProd()`: `if (!notaEntrega || !producto) return;`
- `searchInventoriesMW()`: `if (!product) return false;`
- `selectInventoriesMW()`: `if (!product) return false;`
- Sorting: `productoA ? String(...) : ''`
- `tableInventoriesMW()`: `if (!product) continue;`
- `searchNteProd()`: `if (!product) return false;`
- Guards en `tableNotaEntrega()` para `usuario`, `cliente`, `empresa`

### Devolución de Notas de Entrega
- Nueva columna `activo_ne TINYINT(1) DEFAULT 1` en `nota_entrega`
- Nuevas tablas: `devolucion` (cabecera) y `dvl_prod` (detalle)
- **PHP** `consultasDeNotasEntrega.php`: reemplazo de `deleteNotaEntrega()`/`deleteNe_inv()` por `devolverNotaEntrega($id_usua)`:
  - Verifica `activo_ne = 1`
  - INSERT en `devolucion` + `dvl_prod` por cada producto
  - Restaura stock al inventario correcto según `almacen_ne` (El Alto o La Paz)
  - Revierte `oc_prod.estado_ocpd = 0`
  - Marca `nota_entrega.activo_ne = 0`
- **Controlador**: endpoint `devolverNotaEntrega`
- **JS**: en `tableNotaEntrega()`, si `activo_ne == 1` muestra trash.svg para admin/gerente; si `activo_ne == 0` fila con clase `.returned-row`
- **CSS**: `.returned-row` con `background-color: #b0b0b0 !important`

---

## Bugs conocidos (resueltos)
1. `searchProforma()` línea 515: `Cannot read properties of undefined (reading 'nombre_usua')` — se debía a que `customers.find()`, `enterprises.find()` o `users.find()` devolvían `undefined`. **Solución:** se incluyeron usuarios desactivados en `readUsers()`.
2. `selectInventoriesMW()` línea 2528: `Cannot read properties of undefined (reading 'fk_id_mrc_prod')` — `products.find()` devolvía `undefined` para productos desactivados. **Solución:** `if (!product) return false;` en todas las ocurrencias de `products.find()` en proforma.js y notaEntrega.js.
3. `searchNteProd()` línea 1409: `Cannot read properties of undefined (reading 'codigo_prod')` — mismo patrón. **Solución:** guard en notaEntrega.js.

---

## Key Decisions
- Soft-delete con verificación de stock previa evita perder trazabilidad.
- History API para menú lateral sin cambiar navegación.
- 4 breakpoints (1024/768/600/480) cubren tablets, landscape y phones pequeños.
- Sidebar → slide-up panel fijo en ≤768px con barra inferior siempre visible.
- Cards cuadradas + columnas fijas evitan que una sola card ocupe todo el ancho.
- Sin `JSON_NUMERIC_CHECK` + casteo a `(int)` preserva ceros a la izquierda en VARCHAR.
- Modales a 100% en 480px maximizan espacio útil.
- Usuarios desactivados se muestran en la tabla con fila gris y botón de reactivar.

---

## Pendientes / Próximos pasos
- (a decisión del usuario)
