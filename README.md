# Cambio App

Aplicación de conversión de divisas construida con Next.js, React, TypeScript y TanStack Query. La interfaz consume datos de VAT Comply para listar monedas soportadas y obtener tasas de cambio de referencia.

## Descripción

La aplicación permite:

- Seleccionar una moneda de origen y una moneda de destino.
- Ingresar un monto y ver la conversión en tiempo real.
- Validar si es un monto valido (no negativo).
- Mostrar el nombre completo de las monedas seleccionadas.
- Mostrar la fecha de referencia entregada por la API.
- Consultar las monedas soportadas desde VAT Comply sin exponer directamente esa integración en la UI.

## Tecnologías

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack Query
- VAT Comply API

## Requisitos

- Node.js 20 o superior
- npm

## Instalación

1. Clona el repositorio.
2. Entra al proyecto.
3. Instala las dependencias.

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Después abre el navegador en la URL que muestre Next.js en consola. Normalmente será:

```bash
http://localhost:3000
```

Si el puerto `3000` ya está ocupado, Next.js usará otro puerto disponible automáticamente.

## Build de producción

```bash
npm run build
```

## Ejecutar la build de producción

```bash
npm run start
```

## Lint

```bash
npm run lint
```

## Scripts disponibles

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: genera la build de producción.
- `npm run start`: ejecuta la build generada.
- `npm run lint`: ejecuta ESLint.


## Fuente de datos

La app usa VAT Comply como fuente externa de datos:

- Base URL externa: `https://api.vatcomply.com`
- No requiere API key.
- La lista de monedas soportadas depende de la respuesta real de VAT Comply.

La integración se encapsula en:

- `src/lib/vatcomply.ts`

## Endpoints internos

La UI no consume VAT Comply directamente. Usa rutas internas de Next.js:

- `/api/currencies`: devuelve la lista de monedas soportadas.
- `/api/exchange-rates?base=USD&symbols=EUR`: devuelve la tasa de cambio solicitada.

Esto permite mantener la lógica de integración desacoplada de los componentes presentacionales.

## Arquitectura

El proyecto sigue una separación de responsabilidades basada en patrón contenedor/presentacional y principios SOLID.

- Los contenedores manejan estado, queries y composición de datos.
- Los componentes presentacionales solo renderizan props.
- Los helpers concentran formato y lógica pura reutilizable.
- Las constantes se mantienen separadas para limpiar los componentes.

### Ejemplo de organización

- `src/app/home/containers`: lógica de estado y orquestación.
- `src/app/home/components`: componentes visuales de la pantalla.
- `src/app/home/helpers`: funciones puras para formato y transformación.
- `src/app/home/constants`: constantes del módulo.
- `src/components/ui`: componentes UI reutilizables.

## Flujo principal

1. La aplicación consulta las monedas soportadas.
2. El usuario selecciona origen, destino e ingresa un monto.
3. TanStack Query solicita la tasa correspondiente.
4. El contenedor transforma la respuesta.
5. Los componentes presentacionales renderizan el resultado.

## Componentes reutilizables actuales

- `InputField`: campo reutilizable con adornos opcionales.
- `Select`: select reutilizable.
- `Card`: contenedor visual reutilizable.

## Información útil

- La fecha mostrada en la conversión usa la fecha entregada por la API de VAT Comply.
- Como la API entrega una fecha y no una hora exacta, la UI muestra `00:00 UTC` como referencia del día de la tasa.
- No todas las monedas del mundo están soportadas por VAT Comply. La aplicación solo muestra las monedas válidas para esa API.

## Posibles advertencias al ejecutar

Durante `npm run dev` o `npm run build`, Next.js puede mostrar una advertencia relacionada con múltiples lockfiles y la inferencia del root del workspace. Esa advertencia no impide que la app funcione, pero conviene corregirla si querés una configuración más limpia.

## Estructura base del proyecto

```text
src/
	app/
		api/
			currencies/
			exchange-rates/
		home/
			components/
			constants/
			containers/
			helpers/
			hooks/
	components/
		providers/
		ui/
	lib/
```

## Verificación rápida

Si querés comprobar que todo está correcto después de instalar dependencias:

```bash
npm run lint
npm run build
```

## Decisiones técnicas

### Next.js

Se eligió Next.js como framework principal porque permite combinar rendering del lado del servidor con rutas API nativas. Las rutas `/api/currencies` y `/api/exchange-rates` se implementan directamente en el proyecto sin necesidad de un backend separado. Esto simplifica la infraestructura y centraliza la integración con VAT Comply en el servidor.

### TypeScript

El uso de TypeScript aporta tipado estático a toda la codebase. Las interfaces  como `VatComplyRatesResponse`, `CurrencyOption` y los props de los componentes definen contratos claros entre capas, detectan errores en tiempo de compilación y facilitan el mantenimiento si el proyecto fuera a crecer en un futuro.

### Tailwind CSS

Tailwind CSS permite escribir estilos directamente en el JSX usando clases utilitarias. Reduce la necesidad de archivos CSS separados, mantiene los estilos cerca del componente que los usa además de la facilidad de integración con el ecosistema de NextJS.

### TanStack Query

TanStack Query (React Query) se eligió para manejar las peticiones HTTP del lado del cliente. Provee caché automático, estados de carga y error, y evita peticiones redundantes cuando los datos ya están disponibles. En esta aplicación se usa para solicitar las tasas de cambio al endpoint interno cada vez que cambia la combinación de monedas, sin necesidad de manejar ese estado manualmente con `useState` y `useEffect`.
