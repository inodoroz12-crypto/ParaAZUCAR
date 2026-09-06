# TEAM AZUCAR — página para Jonathan

Esta versión está preparada para que la subas a **GitHub Pages** y funcione sin
Supabase, Firebase, servidor propio, claves ni tokens.

## Qué hace el muro nuevo

La página detecta automáticamente el repositorio donde está publicada.

Los amigos pueden:

- escribir su nombre/apodo;
- escribir un mensaje para Jonathan / Azucar;
- tocar **“Continuar en GitHub + subir dibujo”**;
- GitHub abre un nuevo aporte ya rellenado;
- antes de publicarlo pueden arrastrar/pegar/elegir una imagen o GIF;
- después de publicar, la web lee esos aportes y los muestra en el **Muro del grupo**.

Los aportes se guardan como **GitHub Issues**, así que no necesitás una base de
datos externa.

> Importante: para publicar mensajes o imágenes, el visitante necesita una
> cuenta de GitHub. Para solamente ver la página y leer el muro no necesita
> iniciar sesión.

## Publicar — una sola vez

1. Creá un repositorio **público** en GitHub.
2. Subí **todo lo que hay dentro de esta carpeta** a la raíz del repositorio:
   - `index.html`
   - `data.js`
   - `.nojekyll`
   - `assets/`
3. Verificá que la pestaña **Issues** esté habilitada.
   - En la mayoría de repositorios públicos viene habilitada.
   - Si no aparece: `Settings` → `General` → `Features` → activar `Issues`.
4. `Settings` → `Pages`.
5. En **Source** elegí `Deploy from a branch`.
6. Elegí `main` y `/(root)`.
7. Guardá.

Eso es todo. No hace falta editar el nombre del repositorio dentro del código:
la página lo detecta desde la URL de GitHub Pages.

## Cómo funciona una publicación

El botón de la web abre:

`github.com/TU-USUARIO/TU-REPO/issues/new`

con el nombre y el mensaje ya puestos.

El amigo solo tiene que:
1. iniciar sesión en GitHub si todavía no lo hizo;
2. opcionalmente adjuntar su dibujo/imagen;
3. tocar **Submit new issue**.

Después puede volver a la página y tocar **Actualizar muro**.

## Seguridad / moderación

Como los aportes son Issues de GitHub:
- vos podés editarlos o cerrarlos desde la pestaña `Issues`;
- si cerrás un aporte, deja de mostrarse en la web;
- nadie obtiene permisos para modificar tu página;
- no hay claves privadas expuestas en JavaScript.

## Dibujos permanentes de cada integrante

La sección original **“El grupo para Azucar”** sigue funcionando con `data.js`.
Cuando tengas los dibujos definitivos, podés agregarlos ahí como tarjetas
permanentes. El nuevo muro es para aportes inmediatos de los visitantes.

## Frases de Azucar

La sección **Azucar Dictionary** también quedó intacta para ir agregando sus
palabras y frases reales con el tiempo.
