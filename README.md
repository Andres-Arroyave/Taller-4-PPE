Taller #1: Aplicación de Gestión de Agencia de Viajes

Stack tecnológico: NestJS + Prisma 7 + SQLite (Backend) | Vue 3 + Vite + Vue Router (Frontend)

Este proyecto corresponde a la solución del Taller #1. La aplicación consiste en un sistema para gestionar una agencia de viajes, utilizando un backend desarrollado con NestJS y un frontend desarrollado con Vue 3.

El proyecto utiliza una API REST conectada a una base de datos SQLite mediante Prisma 7. También cuenta con paginación, búsqueda de paquetes turísticos, autenticación mediante JWT, contraseñas encriptadas y protección de rutas en el frontend mediante Navigation Guards.

Estructura del repositorio

El proyecto está dividido en dos partes principales:

backend-viajes/: Contiene el servidor desarrollado con NestJS, Prisma 7, SQLite, autenticación con JWT, bcrypt y el CRUD de los paquetes turísticos.
frontend-viajes/: Contiene la parte visual de la aplicación desarrollada con Vue 3 y Vite. Incluye la barra de búsqueda, paginación, formularios, inicio de sesión, registro y rutas protegidas.
Pasos para levantar el proyecto
1. Levantar el Backend

Para iniciar el backend con NestJS, Prisma 7 y SQLite se deben seguir estos pasos:

# Entrar a la carpeta del backend
cd backend-viajes

# Instalar las dependencias
npm install

# Copiar las variables de entorno
cp .env.example .env

# Crear o sincronizar la base de datos SQLite y generar el cliente de Prisma
npx prisma db push

# Poblar la base de datos con los 60 registros iniciales
npx tsx prisma/seed.ts

# Iniciar el servidor en modo desarrollo
npm run start:dev

El backend quedará disponible en:

http://localhost:3000

2. Levantar el Frontend

Después de iniciar el backend, se debe abrir otra terminal para ejecutar el frontend:

# Entrar a la carpeta del frontend
cd frontend-viajes

# Instalar las dependencias
npm install

# Copiar las variables de entorno
cp .env.example .env

# Iniciar el servidor de desarrollo
npm run dev

El frontend estará disponible en:

http://localhost:5173

Documentación de la arquitectura y archivos del proyecto
¿Qué son los módulos en NestJS?

En NestJS, los módulos se utilizan para organizar la aplicación. Cada módulo agrupa una funcionalidad específica del sistema, por ejemplo, usuarios, autenticación, base de datos o paquetes turísticos.

Los módulos se crean utilizando el decorador @Module() y permiten mantener el proyecto organizado y separar las diferentes responsabilidades.

Cada módulo puede tener cuatro propiedades principales:

imports: Son los módulos que necesita utilizar el módulo actual.
controllers: Son los encargados de recibir las peticiones HTTP como GET, POST, PATCH y DELETE, y devolver las respuestas.
providers: Son los servicios y otras clases que contienen la lógica del sistema y que pueden ser utilizadas mediante inyección de dependencias.
exports: Permite que un servicio o componente de un módulo pueda ser utilizado por otros módulos que lo importen.

NestJS funciona conectando todos estos módulos mediante un árbol de dependencias. El punto principal es el AppModule, que funciona como módulo raíz y desde allí se conectan los demás módulos de la aplicación.

Módulos del Backend

Los principales módulos utilizados en el backend son los siguientes:

1. AppModule

Archivo: src/app.module.ts

Rol: Módulo raíz de la aplicación.

Es el módulo principal del proyecto. Se encarga de importar y conectar los demás módulos utilizados por la aplicación, como PrismaModule, UsersModule, AuthModule y PaquetesModule.

Cuando se inicia el servidor desde main.ts, NestJS comienza a organizar las dependencias de la aplicación a partir de este módulo.

2. UsersModule

Archivo: src/users/users.module.ts

Rol: Módulo encargado de los usuarios.

Este módulo registra y exporta UsersService. No tiene controladores HTTP propios, ya que su función principal es manejar las operaciones relacionadas con los usuarios en la base de datos.

Entre sus funciones están consultar usuarios por correo, consultar usuarios por ID y crear nuevos usuarios. Estos métodos son utilizados principalmente por el módulo de autenticación.

3. AuthModule

Archivo: src/auth/auth.module.ts

Rol: Módulo de autenticación y seguridad.

Este módulo se encarga de manejar el registro y el inicio de sesión de los usuarios.

Utiliza UsersModule, PassportModule y JwtModule. También contiene la estrategia de autenticación JwtStrategy, el controlador AuthController y el servicio AuthService.

La autenticación se realiza mediante JWT, lo que permite proteger determinadas rutas de la aplicación y verificar si el usuario tiene una sesión válida.

4. PaquetesModule

Archivo: src/paquetes/paquetes.module.ts

Rol: Módulo encargado de los paquetes turísticos.

Aquí se agrupan el PaquetesController y el PaquetesService.

Este módulo también utiliza AuthModule para poder proteger las operaciones que modifican la información de los paquetes, como crear, editar y eliminar.

5. PrismaModule

Archivo: src/prisma/prisma.module.ts

Rol: Módulo encargado de la conexión con la base de datos.

Este módulo utiliza el decorador @Global(), por lo que PrismaService puede ser utilizado desde diferentes partes de la aplicación sin tener que importar manualmente PrismaModule en cada módulo.

Prisma es el encargado de facilitar la comunicación entre el backend y la base de datos SQLite.

Archivos del Backend

La carpeta backend-viajes/ contiene los siguientes archivos principales:

src/main.ts: Es el punto de entrada de la aplicación. Configura el puerto donde se ejecuta el servidor, habilita CORS para permitir la comunicación con el frontend y utiliza ValidationPipe para validar las peticiones.
src/app.controller.ts y src/app.service.ts: Son los archivos base de la aplicación y permiten verificar que el servidor esté funcionando mediante el endpoint GET /.
src/app.module.ts: Es el módulo principal que conecta los diferentes módulos de NestJS.
src/prisma/prisma.service.ts: Extiende PrismaClient y se encarga de manejar la conexión y desconexión con la base de datos SQLite.
src/prisma/prisma.module.ts: Define el módulo global utilizado para Prisma.
src/users/users.service.ts: Contiene las funciones relacionadas con los usuarios. Permite buscar usuarios por email con findOneByEmail, buscar por ID con findOneById y crear nuevos usuarios con create.
src/users/users.module.ts: Es el módulo encargado de organizar el servicio de usuarios.
src/auth/auth.controller.ts: Contiene las rutas relacionadas con la autenticación:
POST /auth/register: Registrar un usuario.
POST /auth/login: Iniciar sesión.
src/auth/auth.service.ts: Contiene la lógica principal de autenticación. Se encarga de encriptar las contraseñas utilizando bcrypt.hash, comprobar las credenciales con bcrypt.compare y generar el token JWT mediante jwtService.sign.
src/auth/jwt.strategy.ts: Define la estrategia que utiliza Passport para obtener el token desde el header Authorization: Bearer <token> y validar la información que contiene.
src/auth/jwt-auth.guard.ts: Es el guard encargado de proteger las rutas. Si el usuario no está autenticado o el token no es válido, se bloquea el acceso.
src/auth/dto/register.dto.ts: Contiene las reglas de validación utilizadas durante el registro, como comprobar que el email sea válido, que la contraseña tenga mínimo 6 caracteres y que se envíe el nombre completo.
src/auth/dto/login.dto.ts: Se utiliza para validar los datos necesarios para iniciar sesión.
src/auth/auth.module.ts: Organiza los diferentes componentes relacionados con la autenticación.
src/paquetes/paquetes.controller.ts: Contiene los endpoints REST utilizados para trabajar con los paquetes turísticos:
GET /paquetes: Consulta los paquetes. Es una ruta pública y permite utilizar page, limit y search.
GET /paquetes/:id: Permite consultar los detalles de un paquete específico. Es una ruta pública.
POST /paquetes: Permite crear un paquete y está protegida con JwtAuthGuard.
PATCH /paquetes/:id: Permite editar un paquete y está protegida con JwtAuthGuard.
DELETE /paquetes/:id: Permite eliminar un paquete y está protegida con JwtAuthGuard.
src/paquetes/paquetes.service.ts: Contiene la lógica para trabajar con los paquetes utilizando Prisma. Permite listar los paquetes, realizar búsquedas, utilizar paginación, consultar un paquete por ID, crear, actualizar y eliminar paquetes.
src/paquetes/dto/create-paquete.dto.ts: Contiene las validaciones necesarias para crear un paquete turístico, utilizando reglas como @IsString, @IsNumber, @Min, entre otras.
src/paquetes/dto/update-paquete.dto.ts: Es un DTO utilizado para actualizar paquetes existentes. Utiliza PartialType para permitir que los campos sean opcionales durante la actualización.
src/paquetes/dto/pagination-query.dto.ts: Se utiliza para recibir y validar los parámetros de paginación y búsqueda, como page, limit y search.
src/paquetes/paquetes.module.ts: Es el módulo que organiza todo lo relacionado con los paquetes turísticos.
prisma/schema.prisma: Contiene la estructura de la base de datos. Aquí se encuentran los modelos User y PaqueteTuristico, junto con sus tipos de datos y relaciones.
prisma/seed.ts: Es el archivo encargado de llenar la base de datos con información inicial. Genera 60 paquetes turísticos y crea un usuario administrador por defecto con el correo admin@viajes.com.
Archivos del Frontend

La carpeta frontend-viajes/ contiene la parte visual de la aplicación desarrollada con Vue 3 y Vite.

src/main.js: Es el punto de entrada de la aplicación Vue. Inicializa Vue Router y monta la aplicación en el elemento #app.
src/App.vue: Es el componente principal de la aplicación. Se encarga de mostrar la Navbar.vue y el contenido correspondiente a cada ruta mediante <router-view/>.
src/components/Navbar.vue: Contiene la barra de navegación. Revisa el estado de autenticación guardado en localStorage para mostrar la sesión actual y permitir cerrar sesión.
src/router/index.js: Contiene las rutas principales de la aplicación, como /, /login, /register, /paquetes/nuevo y /paquetes/editar/:id. También contiene el Navigation Guard beforeEach, que se encarga de evitar que usuarios sin token entren a las rutas privadas.
src/services/api.js: Contiene la configuración central de Axios. También tiene un interceptor que agrega automáticamente el token JWT en la cabecera Authorization: Bearer <token> cuando se realiza una petición.
src/services/auth.service.js: Se encarga de realizar las peticiones relacionadas con autenticación, principalmente el login y el registro.
src/services/paquetes.service.js: Contiene las funciones que realizan las peticiones HTTP relacionadas con los paquetes turísticos, incluyendo las operaciones CRUD y la paginación.
src/views/PaquetesView.vue: Es la vista principal donde se muestran los paquetes turísticos. Incluye la búsqueda y la paginación.
src/views/PaqueteFormView.vue: Contiene el formulario utilizado para crear y editar paquetes turísticos. El acceso a esta vista está protegido.
src/views/LoginView.vue: Contiene el formulario para iniciar sesión. Se encarga de validar las credenciales y guardar el token de autenticación.
src/views/RegisterView.vue: Contiene el formulario para registrar nuevos usuarios.
Resumen general del proyecto

En general, el proyecto está dividido entre un backend y un frontend que se comunican mediante una API REST.

El backend está desarrollado con NestJS y se encarga de la lógica del sistema, la autenticación, las validaciones y la comunicación con la base de datos SQLite mediante Prisma 7.

El frontend está desarrollado con Vue 3 y se encarga de la parte visual, permitiendo al usuario consultar, buscar, crear, editar y eliminar paquetes turísticos dependiendo de si tiene los permisos necesarios.

También se implementó autenticación mediante JWT. Los usuarios deben iniciar sesión para acceder a las operaciones privadas, mientras que la consulta de paquetes puede realizarse de forma pública.

Finalmente, se utilizaron 60 registros iniciales para poder probar correctamente la búsqueda y la paginación de los paquetes turísticos.