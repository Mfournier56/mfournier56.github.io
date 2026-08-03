# Web de galería para GitHub Pages

## Estructura esperada

Sube todo el contenido de esta carpeta a tu repositorio de GitHub Pages:

```
index.html
style.css
script.js
obras.xlsx
Habitats/
Baloons/
BrokenFrame/
Other/
```

Dentro de cada carpeta mete las imágenes de las obras.

Ejemplo:

```
Habitats/habit_001.jpg
Baloons/balloon_001.jpg
BrokenFrame/broken_001.jpg
Other/other_001.jpg
```

## Excel

Edita `obras.xlsx` y rellena estas columnas exactamente:

| Imagen | Serie | Titulo | Dimensiones | Tecnica | Precio |
|---|---|---|---|---|---|
| habit_001.jpg | Habitats | Habitat I | 45 x 30 x 12 cm | Madera, resina y collage | Consultar |

La columna `Serie` debe contener uno de estos valores:

- Habitats
- Baloons
- BrokenFrame
- Other

## Contacto y compra

En `script.js`, cambia estas líneas:

```js
email: 'tuemail@dominio.com',
whatsapp: '',
instagram: 'https://www.instagram.com/mfournier1414/',
```

Si dejas `whatsapp` vacío, el botón "Solicitar compra" abrirá un correo.
Si pones tu número con prefijo internacional, por ejemplo `34600000000`, abrirá WhatsApp.

## Publicar en GitHub Pages

1. Entra en tu repositorio `mfournier1414.github.io`.
2. Sube todos estos archivos y carpetas.
3. Ve a Settings > Pages.
4. Source: Deploy from a branch.
5. Branch: main.
6. Folder: / root.

Tu web quedará publicada como página estática.
