# Simulador de Discapacidades

Prototipo del curso de Interacción Humano-Computadora. El usuario pega la URL de una página, el backend la
renderiza con un navegador headless (Puppeteer), y el frontend la muestra dentro de un iframe con filtros que
simulan condiciones (daltonismo, baja visión, dislexia), navegación por teclado con resaltado de foco, y un
panel de chequeos básicos de accesibilidad.

Estas instrucciones sirven para que cualquier integrante clone el proyecto y lo levante rápido.

## Requisitos

Solo se necesita instalado globalmente:

1. **Node.js** (recomendado 22 LTS). Verificar: `node -v` y `npm -v`.
2. **Git**. Verificar: `git --version`.
3. **Visual Studio Code** (opcional), con extensiones ESLint y Prettier.

No hace falta instalar PostgreSQL. El proyecto trae Prisma/Postgres configurado, pero **hoy la base de datos
está inerte**: ninguna parte del código la usa, así que no hay que crear base de datos ni correr migraciones
para que el prototipo funcione. (Ver nota al final.)

## Cómo levantar el proyecto

Clonar:

```
git clone https://github.com/Mario030802/simulador-discapacidades.git
cd simulador-discapacidades
```

### Backend

```
cd backend
npm install
npm run dev
```

`npm install` descarga las dependencias y, la primera vez, **Puppeteer baja su propio Chromium** (pesa y
tarda ~1 minuto). Al levantar debe aparecer:

```
Servidor ejecutándose en puerto 3000
```

No hace falta crear `.env` para correr el prototipo (el puerto está fijo en 3000 y el código no lee la base
de datos).

### Frontend

En otra terminal:

```
cd frontend
npm install
npm run dev
```

Debe aparecer una URL local, normalmente `http://localhost:5173` (si ese puerto está ocupado, Vite usa el
siguiente libre, p. ej. `5174`).

Por defecto el frontend le pega al backend en `http://localhost:3000`. Si necesitas cambiarlo, copia
`frontend/.env.example` a `frontend/.env` y ajusta `VITE_API_URL`.

## Dependencias reales

**Backend:** express, cors, cheerio, dotenv, puppeteer, prisma, @prisma/client (más TypeScript y ts-node-dev
para desarrollo). El fetch/render lo hace **Puppeteer**; cheerio solo posprocesa el HTML (inyecta `<base>` y
reescribe `<img src>` a absolutas).

**Frontend:** react, react-dom, vite, typescript (más ESLint para desarrollo).

Tus compañeros no instalan estas dependencias a mano: se bajan con `npm install`.

## Nota sobre la base de datos (Prisma/Postgres)

El repo incluye un `schema.prisma` con un modelo `Analysis` y `prisma.config.ts`, pero **el código no guarda
ni lee nada de la base de datos**. Está dejado como configuración para un posible trabajo futuro de
persistencia. Mientras siga inerte, no necesitas Postgres ni correr `prisma migrate`.
