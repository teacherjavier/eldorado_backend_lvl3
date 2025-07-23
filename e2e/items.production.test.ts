import supertest from 'supertest';
import app, { server } from '../src/presentation/server';
import pool from '../src/infrastructure/database/postgres.connection';

const request = supertest(app);

describe('API de Items - Tests E2E de Producción', () => {

    // Antes de que empiecen los tests de esta suite, limpiamos la base de datos.
    beforeAll(async () => {
      await pool.query('TRUNCATE TABLE items RESTART IDENTITY CASCADE;');
    });
  
    // Después de que TODOS los tests de esta suite hayan terminado, cerramos todo.
    afterAll((done) => {
      server.close(() => {
        pool.end(done);
      });
    });
  // =================================================================
  // SUITE 1: Ciclo de Vida Completo
  // =================================================================
  describe('Test de Ciclo de Vida Completo', () => {
    // Este test se ejecuta en una base de datos limpia gracias a que es el primero
    // en correr dentro de esta suite tras la limpieza del adaptador.
    it('debe crear, obtener, actualizar y eliminar un item correctamente', async () => {
      // 1. CREAR (POST)
      const createResponse = await request
        .post('/api/v1/items')
        .send({ name: 'Laptop Pro', price: 1200 })
        .expect(201);
      
      const itemId = createResponse.body.id;

      // 2. OBTENER (GET por ID)
      const getResponse = await request
        .get(`/api/v1/items/${itemId}`)
        .expect(200);

      expect(getResponse.body.id).toBe(itemId);

      // 3. ACTUALIZAR (PUT)
      const updateResponse = await request
        .put(`/api/v1/items/${itemId}`)
        .send({ name: 'Laptop Pro X', price: 1350 })
        .expect(200);
      
      expect(parseFloat(updateResponse.body.price)).toBe(1350);

      // 4. VERIFICAR ACTUALIZACIÓN (GET por ID de nuevo)
      const getUpdatedResponse = await request
        .get(`/api/v1/items/${itemId}`)
        .expect(200);
      expect(getUpdatedResponse.body.name).toBe('Laptop Pro X');

      // 5. ELIMINAR
      await request.delete(`/api/v1/items/${itemId}`).expect(204);

      // 6. VERIFICAR ELIMINACIÓN (GET por ID final)
      await request.get(`/api/v1/items/${itemId}`).expect(404);
    });
  });

  // =================================================================
  // SUITE 2: Validación de Entradas y Casos Límite
  // =================================================================
  describe('Validación de Entradas y Casos Límite', () => {
    
    describe('POST /api/v1/items', () => {
      // Limpiamos la tabla antes de cada test de validación de POST
      beforeEach(async () => {
        await pool.query('TRUNCATE TABLE items RESTART IDENTITY CASCADE;');
      });

      it('debe devolver 400 si falta el nombre', async () => {
        await request.post('/api/v1/items').send({ price: 100 }).expect(400);
      });

      it('debe devolver 400 si falta el precio', async () => {
        await request.post('/api/v1/items').send({ name: 'Test Item' }).expect(400);
      });

      it('debe devolver 400 si el nombre es un string vacío', async () => {
        await request.post('/api/v1/items').send({ name: '', price: 100 }).expect(400);
      });

      it('debe devolver 400 si el precio es negativo', async () => {
        await request.post('/api/v1/items').send({ name: 'Negative Price Item', price: -50 }).expect(400);
      });

      it('debe devolver 400 si el precio no es un número', async () => {
        await request.post('/api/v1/items').send({ name: 'Invalid Price Item', price: 'fifty' }).expect(400);
      });
    });
    
    describe('PUT /api/v1/items/:id', () => {
      let existingItemId: string;

      beforeEach(async () => {
        // Se limpia y crea un item nuevo antes de cada test de esta sub-suite.
        await pool.query('TRUNCATE TABLE items RESTART IDENTITY CASCADE;');
        const res = await request.post('/api/v1/items').send({ name: 'Item to Update', price: 50 });
        existingItemId = res.body.id;
      });

      it('debe devolver 400 si el nombre se actualiza a un string vacío', async () => {
        await request.put(`/api/v1/items/${existingItemId}`).send({ name: '', price: 75 }).expect(400);
      });

      it('debe devolver 400 si el precio se actualiza a un valor negativo', async () => {
        await request.put(`/api/v1/items/${existingItemId}`).send({ name: 'Updated Name', price: -10 }).expect(400);
      });
    });
  });

  // =================================================================
  // SUITE 3: Recursos Inexistentes e Inválidos
  // =================================================================
  describe('Recursos Inexistentes e Inválidos', () => {
    beforeEach(async () => {
      await pool.query('TRUNCATE TABLE items RESTART IDENTITY CASCADE;');
    });

    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const invalidId = '123-abc-invalid-id';
    
    it('GET debe devolver 404 para un ID inexistente', async () => {
        await request.get(`/api/v1/items/${nonExistentId}`).expect(404);
    });

    it('GET debe devolver 400 para un formato de ID inválido', async () => {
        await request.get(`/api/v1/items/${invalidId}`).expect(400);
    });

    it('PUT debe devolver 404 para un ID inexistente', async () => {
        await request.put(`/api/v1/items/${nonExistentId}`).send({ name: 'Ghost', price: 99 }).expect(404);
    });
    
    it('PUT debe devolver 400 para un formato de ID inválido', async () => {
        await request.put(`/api/v1/items/${invalidId}`).send({ name: 'Ghost', price: 99 }).expect(400);
    });

    it('DELETE debe devolver 404 para un ID inexistente', async () => {
        await request.delete(`/api/v1/items/${nonExistentId}`).expect(404);
    });

    it('DELETE debe devolver 400 para un formato de ID inválido', async () => {
        await request.delete(`/api/v1/items/${invalidId}`).expect(400);
    });
  }); 
});