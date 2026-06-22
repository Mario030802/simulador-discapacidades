Antes de hacer el git push, lo mejor es que les pases instrucciones claras para que cualquier integrante pueda clonar el proyecto y ejecutarlo en 10 minutos.

Requisitos que deben tener instalados
1. Node.js

Versión recomendada:

Node.js 22 LTS

Verificar:

node -v
npm -v
2. PostgreSQL

Versión recomendada:

PostgreSQL 17

Verificar:

psql --version

También pueden usar pgAdmin.

3. Git

Verificar:

git --version
4. Visual Studio Code

Con extensiones:

ESLint
Prettier
Prisma
Cómo levantar el proyecto
Clonar
git clone https://github.com/Mario030802/simulador-discapacidades.git
cd simulador-discapacidades
Backend

Entrar:

cd backend

Instalar dependencias:

npm install

Crear .env

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/accessibility_simulator"
Base de datos

Crear:

CREATE DATABASE accessibility_simulator;
Prisma

Ejecutar:

npx prisma migrate dev
Levantar backend
npm run dev

Debe aparecer:

Servidor ejecutándose en puerto 3000
Frontend

Abrir otra terminal:

cd frontend

Instalar:

npm install

Levantar:

npm run dev

Debe aparecer:

http://localhost:5173
Dependencias actuales
Backend
express
cors
axios
cheerio
prisma
@prisma/client
dotenv
typescript
ts-node-dev
Frontend
react
vite
typescript
Lo más importante

Tus compañeros NO necesitan instalar manualmente:

express
axios
react
vite
prisma

porque eso se descarga automáticamente con:

npm install

Lo único que sí deben tener instalado globalmente es:

Node.js
PostgreSQL
Git
VS Code
