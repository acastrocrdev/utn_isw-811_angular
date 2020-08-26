# Proyecto final: AutoCine (FrontEnd - Angular)

**Materia:** Aplicaciones Web Utilizando Software Libre
**Profesora:** Nathalie Paniagua López
**Cuatrimestre:** II-2020
**Universidad:** Universidad Técnica Nacional

## Notas de Angular:

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `npm run serve` for a dev server. Navigate to secure URL. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## ajustes de funcionamiento

Para el completo funcionamiento es necesario:

**Indispensable:**
**Requiere el BackEnd de Laravel para su funcionamiento.** ([https://github.com/acastrocrdev/utn_isw-811_laravel](https://github.com/acastrocrdev/utn_isw-811_laravel))

1.  Crear cuenta de desarrollador en Facebook ([https://developers.facebook.com/](https://developers.facebook.com/))
2.  Crear cuenta en Firebase ([https://console.firebase.google.com/](https://console.firebase.google.com/))
3.  Crear App en Firebase, activar la opción de autenticación y agregar Facebook y Google)
4.  Crear una cuenta en ([https://www.themoviedb.org/](https://www.themoviedb.org/)) y obtener el API Key.
5.  En el proyecto, modificar el archivo **'src/environments/environment.td'** y aplicar los siguientes cambios:

-   agregar API Key de
-   Ajustar a URL de API Laravel.
-   Agregar datos del json generado por Firebase.

## Capturas de pantalla

**Sección:** "Página Principal"
![Vista previa de: Página Principal](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/full_home.jpg)

**Sección:** "Ubicaciones" _(listado público, gestión desde la BD)_
![Vista previa de: Ubicaciones](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/ubicaciones.jpg)

**Sección:** "Productos" _(listado público, gestión desde panel interno)_
![Vista previa de: Productos](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/productos.jpg)

**Sección:** "Productos" _(Detalle público, gestión desde panel interno)_
![Vista previa de: Productos](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/productos_interna.jpg)

**Sección:** "Películas" _(listado público, gestión desde panel interno)_
![Vista previa de: Películas](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/peliculas.jpg)

**Sección:** "Películas" _(Detalle público, gestión desde panel interno)_
![Vista previa de: Películas](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/peliculas_detalle.jpg)

**Sección:** "Películas" _(Vista previa videos, gestión desde panel interno)_
![Vista previa de: Películas](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/peliculas_player.jpg)

**Sección:** "Acerca de"
![Vista previa de: Acerca de](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/acerca_de.jpg)

**Sección:** "Cartelera" _(Listado público, gestión desde panel interno)_
![Vista previa de: Cartelera](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/cartelera_.jpg)

**Sección:** "Reserva" _(Solo usuarios registrados, gestión de tiquetes desde BD)_
![Vista previa de: Reserva](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/reserva.jpg)

**Sección:** "Reserva Resumen" _(Simulación de recibo)_
![Vista previa de: Reserva Resumen](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/reserva_tiquete.jpg)

**Sección:** "Reserva Resumen PDF" _(Simulación de recibo)_
![Vista previa de: Reserva Resumen PDF](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/tiquete_pdf.JPG)

**Sección:** "Reservas" _(Detalle de reservas realizadas por cliente)_
![Vista previa de: Reservas](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/reservas_listado.jpg)

**Sección:** "Administración -> Edición / Creación de cartelera (funciones)"
![Vista previa de: Creación de cartelera](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/admin_cartelera_edit.jpg)

**Sección:** "Administración -> Listado de cartelera (funciones)"
![Vista previa de: Listado de cartelera](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/admin_cartelera_listado.jpg)

**Sección:** "Administración -> Edición / Creación de películas"
![Vista previa de: Creación de películas](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/admin_peliculas_edit.jpg)

**Sección:** "Administración -> Edición / Creación de películas" (Búsqueda y resultados de ([https://www.themoviedb.org/](https://www.themoviedb.org/))
![Vista previa de: Creación de películas" (Búsqueda y resultados de https://www.themoviedb.org/](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/admin_peliculas_edit_buscar.jpg)

**Sección:** "Administración -> Listado de películas"
![Vista previa de: Listado de películas](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/admin_peliculas_listado.jpg)

**Sección:** "Administración -> Edición / Creación de productos"
![Vista previa de: Creación de productos](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/admin_productos_edit.jpg)

**Sección:** "Administración -> Listado de productos"
![Vista previa de: Listado de productos](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/admin_productos_listado.jpg)

**Sección:** "Login con usuario interno y redes sociales"
![Vista previa de: Login con usuario interno y redes sociales](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/login.jpg)

**Sección:** "Notificaciones superiores"
![Vista previa de: Notificaciones superiores](https://raw.githubusercontent.com/acastrocrdev/utn_isw-811_angular/master/capturas/notificaciones.jpg)
