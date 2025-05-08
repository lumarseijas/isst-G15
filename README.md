# **Reserva de Servicios de Belleza**

Este proyecto es una plataforma de reservas online dirigida a pequeños negocios de belleza (peluquerías, centros de estética, etc.) para que puedan gestionar su disponibilidad, citas, servicios y clientes de forma eficiente y moderna.

---

## Características Principales

-  Registro e inicio de sesión con autenticación segura (Google Sign-In)
-  Gestión de citas online y presenciales
-  Visualización de disponibilidad y servicios
-  Panel de administración para el negocio
-  Notificaciones automáticas por email
-  Valoraciones y comentarios sobre servicios
-  Integración con Google Calendar
-  Arquitectura basada en microservicios (Spring Boot)

---

##  Tecnologías y Herramientas Utilizadas

### Frontend
-  React
-  CSS (estilos)
-  Axios (peticiones HTTP)
-  React Router DOM (rutas)
-  LocalStorage 

### Backend
-  Java + Spring Boot
-  Spring Security + OAuth2
-  Spring Data JPA + Hibernate
-  MySQL (base de datos)
-  Spring-boot starter-mail (notificaciones por correo)

### Otros
-  JUnit (pruebas unitarias)
-  Postman (pruebas API)
-  GitHub: [Repositorio](https://github.com/lumarseijas/isst-G15)
-  Trello: [Trello](https://trello.com/b/uJJV9c7g/isst-grupo15-belleza)
-  VSCode

---
### 1. Instalaciones necesarias

Asegúrate de tener instalado lo siguiente:

- [MYSQL](https://dev.mysql.com/downloads/installer/)
- [JAVA JDK](https://adoptium.net/es/)
- [MAVEN](https://maven.apache.org/download.cgi) (descargar el .zip y añadir a PATH)
- Node.js y npm

Luego, en la carpeta del frontend (`reserva-belleza-web`), ejecuta:

```bash
npm install
npm install axios
npm install react-router-dom
npm install @react-oauth/google jwt-decode
npm install @react-oauth/google
npm install @react-oauth/google axios
npm install jwt-decode
```
### 2. Configurar la base de datos
1. Abre la terminal y entra en MySQL: 
```bash
mysql -u root -p
```
2. Crea la base de datos, llamada base:
```bash
CREATE DATABASE base;
```
3. Importa el script `relleno.sql`.
### 3. Ejecutar el backend
Desde la raíz del proyecto backend (donde está el pom.xml):
```bash
mvn spring-boot:run
```
Esto lanzará el backend en:
```bash
http://localhost:5000
```
### 4. Ver la página web: 
Desde la carpeta `reserva-belleza-web`, ejecuta:
```bash
 npm run dev
```
Abre tu navegador en:
```bash
http://localhost:5173
```
---

## Pasos para el Cliente

### 1. Registrarse
- Haz clic en **"Iniciar Sesión"** o **"Registrarse"**
- Puedes usar tu email o iniciar sesión con Google

### 2. Reservar una cita
- En la página de **Reserva**, selecciona el servicio
- Consulta horarios disponibles
- Confirma la cita

Recibirás un email de confirmación y, en el apartado de **"Mis Citas"** puedes añadirla a Google Calendar la cita o bien descargar un archivo .ics para añadirlo a otros calendarios como iCloud, Outlook...

Además 24 horas antes, recibirás automáticamente un email de recordatorio de tu cita. 

### 3. Gestionar tus citas
- En **"Mis Citas"** puedes ver, cancelar o modificar tus reservas
- No podrás cancelar ni modificar tu reserva si quedan menos de 24 horas

### 4. Valorar un servicio
- Después de la cita, puedes dejar una valoración y comentario
- También se pueden ver las valoraciones de otros usuarios desde la página de **Servicios**

### 5. Gestionar tu perfil
- Al hacer click en tu avatar, puedes modificar la información de tu perfil: nombre, teléfono, avatar o contraseña
  
---
## Seguridad

-  Autenticación con Google OAuth2
-  Contraseñas cifradas (bcrypt)
-  Acceso restringido por roles (cliente/admin)

---

##  Pruebas

-  Pruebas unitarias con **JUnit**
-  Pruebas funcionales con **Manuales**
-  Pruebas de integración con **Postman**

---

##  Equipo

Desarrollado por el grupo G15 de ISST:
- Elsa Sastre Del Olmo
- Khaoula Boualouan
- Guillermo Azcoitia Plaza
- Lucía Martínez Seijas
- Cristina Rodríguez Lozano

---

¡Gracias por visitar nuestro proyecto! 


