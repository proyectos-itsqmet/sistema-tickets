### Instals

1. npm install

### Git flow

Ramas principales:

1. main: Rama de producción (Solo para código estable)

- develop: Rama de integración y desarrollo general

2. Trabajar siempre en ramas:

- feature/: Nuevas funcionalidades, características, por ejemplo: Nueva pantalla, nuevo campo en formulario
- hotfix/: Correcciones urgentes en producción
- fix/: Correcciones generales y bugs menores
- release/: Preparaciones para un nuevo lanzamiento, por ejemplo: release/v1.2.0

3. Usar mensajes de commit claros y consistentes, por ejemplo:

- feat: Agregar login con Google
- fix: Corregir bug en formulario de registro
- chore: Actualizar dependencias
- docs: Añadir documentacion al README

### Branch - Develop

1. Cambiar a la rama de desarrollo git checkout develop
2. Actualizar el proyecto con los últimos cambios del remoto git pull origin develop
3. Crea la rama segun el flujo que vayas a realizar, por ejemplo git checkout -b feature/login
4. Agregar los cambios al área de staging git add .
5. Hacer commit git commit -m "feat: Creación de la pantalla login"
6. Sube la rama al remoto git push -u origin feature/login
7. comentario prueba
---

### Configs

1. npx create-vite@latest
2. Select react
3. TypeScript + SWC
4. Use rolldown-vite: No
5. Install with npm and start now: Yes

6. npm run dev

7. npm install react-router

8. npm install tailwindcss @tailwindcss/vite
9. Realizar configuraciones
10. npm install -D @types/node [Install and configure shadcn/ui for Vite.](https://ui.shadcn.com/docs/installation/vite)
11. npx shadcn@latest init

12. npx json-server --watch .\data\db.json --port 3001 (Para incializar json server)
