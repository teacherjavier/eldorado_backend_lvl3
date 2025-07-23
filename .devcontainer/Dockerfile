FROM node:20

# Instala herramientas básicas de desarrollo
RUN apt-get update && apt-get install -y less man-db sudo

# Asegura que el usuario 'node' por defecto tenga acceso a sudo sin contraseña
RUN echo "node ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/node \
    && chmod 0440 /etc/sudoers.d/node

# Establece el directorio de trabajo por defecto para cualquier comando
WORKDIR /app
