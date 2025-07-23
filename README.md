# Coding Interview Backend Level 3 - Entrega Final

## 📝 Descripción de la Solución

Este repositorio contiene la solución completa para la prueba técnica. Se ha desarrollado una API REST robusta y lista para producción que permite realizar operaciones CRUD sobre una entidad `Item`, cumpliendo y superando todos los requisitos especificados.

La implementación se ha realizado siguiendo las mejores prácticas de la industria en cuanto a arquitectura de software, calidad de código, testing y operatividad.

---

## ✅ Cumplimiento de Requisitos

Se ha dado respuesta a cada uno de los requisitos fundamentales de la tarea:

* **Persistencia de Datos:**
    * Se ha elegido **PostgreSQL** como motor de base de datos relacional.
    * El servicio se ejecuta en un entorno **Docker**, y los datos de la base de datos se persisten en un **volumen de Docker**, garantizando que la información no se pierda tras reiniciar o reconstruir los contenedores.
    
* **Código Listo para Producción:**
    * La solución se ha construido sobre una **Arquitectura Limpia (Hexagonal)**, que separa la lógica de negocio de los detalles de infraestructura, garantizando la mantenibilidad y escalabilidad.
    * Se utiliza **Docker y Docker Compose** para un entorno de desarrollo y despliegue consistente y reproducible.
    * Se ha implementado **logging estructurado** con **Pino**, generando logs en formato JSON, ideales para sistemas de monitorización.
    * La **configuración es centralizada**, se carga desde variables de entorno y se valida al inicio para prevenir arranques con un estado inválido.
    * Se ha implementado un **manejador de errores global** que captura todos los errores y devuelve respuestas HTTP coherentes y seguras.
    * La API está completamente documentada con **Swagger/OpenAPI**.

* **Superación de Tests E2E:**
    * La implementación actual pasa **exitosamente todos los tests** proporcionados en el archivo original `/e-2-e/index.test.ts`, gracias a una capa de adaptación (`src/server.ts`) que garantiza la compatibilidad.
    * Adicionalmente, se ha creado una nueva suite de tests (`/e-2-e/items.production.test.ts`) con una cobertura mucho más exhaustiva para asegurar la robustez del servicio.

---

## 🏛️ Decisiones de Arquitectura

La elección principal ha sido la **Arquitectura Limpia (Clean Architecture)**. Este patrón de diseño se centra en la separación de conceptos, organizando el código en capas independientes (Dominio, Aplicación, Infraestructura, Presentación).

Los beneficios clave de esta elección son:

* **Independencia del Framework y la Base de Datos:** La lógica de negocio no depende de Express o PostgreSQL. Podrían ser sustituidos con un impacto mínimo.
* **Alta Testeabilidad:** La lógica de negocio (casos de uso) puede ser probada de forma unitaria, sin necesidad de levantar un servidor web o una base de datos.
* **Mantenibilidad a Largo Plazo:** El código es más fácil de entender, modificar y escalar, ya que las responsabilidades están claramente definidas.

---

## 🛠️ Stack Tecnológico

* **Lenguaje:** TypeScript
* **Framework:** Node.js + Express
* **Base de Datos:** PostgreSQL
* **Contenerización:** Docker & Docker Compose
* **Testing:** Jest & Supertest
* **Logging:** Pino
* **Documentación API:** Swagger/OpenAPI
* **Otros:** CORS, Dotenv

---

## 🚀 Cómo Ejecutar el Proyecto

Este proyecto está configurado para funcionar de dos maneras: automáticamente con VS Code Dev Containers, o manualmente desde cualquier terminal.

### Opción 1: Entorno Automatizado (Recomendado con VS Code)

> ⚠️ **Advertencia Importante:** La suite de tests es destructiva y borrará los datos de la tabla `items` al ejecutarse. No la ejecutes si tienes datos importantes en tu base de datos de desarrollo.

> 💡 **Requisitos:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo antes de empezar, y la extensión [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) para VS Code, instalada.

1.  Abre la carpeta del proyecto en VS Code.
2.  Haz clic en la notificación **"Reopen in Container"** que aparecerá abajo a la derecha (o usa Ctrl+Shift+P y busca en el menú de comandos **"Dev Containers: Rebuild and Reopen in Container"**, y haz clic ahí.
3.  Espera a que VS Code construya y levante el entorno.
4.  Una vez dentro, abre la terminal integrada de VS Code (`Ctrl + ñ`). Ya estarás dentro del contenedor y en la carpeta correcta.

* **Para instalar dependencias (solo la primera vez):**
    ```bash
    npm install
    ```
* **Para iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    - La API estará disponible en: http://localhost:3000/api/v1/items
    
* **Para ejecutar los tests:**
    ```bash
    npm test
    ```

---
### Opción 2: Entorno Manual (Cualquier Terminal)

> ⚠️ **Advertencia Importante:** La suite de tests es destructiva y borrará los datos de la tabla `items` al ejecutarse. No la ejecutes si tienes datos importantes en tu base de datos de desarrollo.

> 💡 **Requisitos:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo antes de empezar.

Todos los comandos deben ejecutarse desde la **raíz del proyecto**.

1.  **Preparar:** Crea un archivo `.env` en la raíz del proyecto a partir de la plantilla `.env.example`.

2.  **Limpieza Previa (Recomendado):**
    * Este comando detiene y elimina cualquier contenedor del proyecto de una sesión anterior.
    ```bash
    docker-compose -f .devcontainer/docker-compose.yml down
    ```

3.  **Construir e Iniciar Contenedores en segundo plano:**
    ```bash
    docker-compose --env-file ./.env -f .devcontainer/docker-compose.yml up --build -d
    ```

4.  **Instalar Dependencias en el Contenedor (solo la primera vez):**
    ```bash
    docker-compose -f .devcontainer/docker-compose.yml exec api npm install
    ```

5.  **Ejecutar los Tests:**
    ```bash
    docker-compose -f .devcontainer/docker-compose.yml exec api npm test
    ```

6. **Iniciar el Servidor para Probar Manualmente:**
    ```bash
    docker-compose -f .devcontainer/docker-compose.yml exec api npm run dev
    ```
    - La API estará disponible en: http://localhost:3000/api/v1/items

7.  **Para Detener Todo:**
    ```bash
    docker-compose -f .devcontainer/docker-compose.yml down
    ```
---

## 📖 Documentación de la API

La documentación completa e interactiva de la API, generada con Swagger, está disponible en la siguiente ruta una vez que el servicio esté en marcha:

**[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

 **Persistencia de Datos:**
    * Se puede comprobar corriendo la API, creando y modificando items, cerrando el entorno y volviendo a abrirlo.
    
    * Ejemplo:
       1.- Abrir el proyecto en VSCode
       2.- Levantar la API con "npm run dev"
       3.- Ir a http://localhost:3000/api-docs en el navegador
       4.- Crear items, cerrar el entorno (cerrando VSCode, o haciendo clic en el menú "Archivo", "Cerrar conexión remota).       
       5.- Abrir el proyecto en un terminal (PowerShell, por ejemplo)
       6.- Levantar el entorno con "docker-compose --env-file ./.env -f .devcontainer/docker-compose.yml up --build -d"
       7.- Levantar la API con "docker-compose -f .devcontainer/docker-compose.yml exec api npm run dev"
       8.- Ir a http://localhost:3000/api-docs en el navegador y comprobar que los datos aún existen desde la API, con GetAllItems. 
       9.- Alternativamente, en http://localhost:3000/api/v1/items también nos mostrará una lista de items existentes en la Base de Datos.

       ⚠️ **Advertencia Importante:** La suite de tests es destructiva y borrará los datos de la tabla `items` al ejecutarse. 
       Si la corremos entre estos dos procesos, no podremos comprobar la persistencia de datos.


---

## 🔮 Propuestas de Mejora y Visión Estratégica (Resumen)

El servicio actual es una base robusta. Los siguientes pasos se centrarían en evolucionarlo hacia un sistema de producción completo:

* **Seguridad y Control de Acceso:** Implementación de autenticación y autorización con JWT.
* **Catálogo de Productos Avanzado:** Evolución del modelo para incluir categorías y características, stock de proveedores, etc.
* **Motor de Promociones:** Implementación de descuentos, up-selling y cross-selling.
* **Escalabilidad y Rendimiento:** Introducción de una capa de caché (Redis) y operaciones asíncronas.

**➡️ Para un análisis detallado de cada propuesta, por favor, consulta el documento [STRATEGY.md](STRATEGY.md).**
