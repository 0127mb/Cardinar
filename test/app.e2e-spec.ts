import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { describe, it } from 'node:test';

describe('Cardinar API E2E Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;

  beforeAll(async () => {
    // Set test database URL
    process.env.DB_URL =
      'postgres://postgres:123456@localhost:5433/cardinar_test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix('api');

    dataSource = moduleFixture.get(DataSource);

    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    await app.init();

    // Wait for database to be ready
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  afterAll(async () => {
    try {
      // Cleanup: Drop all tables and recreate schema
      if (dataSource && dataSource.isInitialized) {
        const entities = dataSource.entityMetadatas;
        for (const entity of entities) {
          const repository = dataSource.getRepository(entity.name);
          await repository
            .query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`)
            .catch(() => {});
        }
        await dataSource.destroy();
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    } finally {
      await app.close();
    }
  });

  describe('Colors Module', () => {
    let colorId: number;

    it('POST /colors - should create a new color', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/colors')
        .send({
          title: 'Black',
          color: '#000000',
        });
      //@ts-ignore
      expect(response.status).toBe(201);
      //@ts-ignore
      expect(response.body).toHaveProperty('id');
      //@ts-ignore
      expect(response.body.title).toBe('Black');
      //@ts-ignore
      expect(response.body.color).toBe('#000000');
      //@ts-ignore
      colorId = response.body.id;
    });

    it('GET /colors - should return all colors', async () => {
      const response = await request(app.getHttpServer()).get('/api/colors');
      //@ts-ignore
      expect(response.status).toBe(200);
      //@ts-ignore
      expect(Array.isArray(response.body)).toBe(true);
      //@ts-ignore
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /colors/:id - should return color by id', async () => {
      const response = await request(app.getHttpServer()).get(
        `/api/colors/${colorId}`,
      );
      //@ts-ignore
      expect(response.status).toBe(200);
      //@ts-ignore
      expect(response.body.id).toBe(colorId);
    });

    it('PUT /colors/:id - should update color', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/colors/${colorId}`)
        .send({
          title: 'White',
          color: '#FFFFFF',
        }); //@ts-ignore

      expect(response.status).toBe(200); //@ts-ignore
      expect(response.body.title).toBe('White');
    });

    it('DELETE /colors/:id - should delete color', async () => {
      const response = await request(app.getHttpServer()).delete(
        `/api/colors/${colorId}`,
      );
      //@ts-ignore
      expect(response.status).toBe(200);
    });
  });

  describe('Materials Module', () => {
    it('POST /materials - should create material', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/materials')
        .send({
          title: 'Leather',
          description: 'Premium leather material',
        });
      //@ts-ignore
      expect(response.status).toBe(201); //@ts-ignore
      expect(response.body.title).toBe('Leather');
    });

    it('GET /materials - should return all materials', async () => {
      const response = await request(app.getHttpServer()).get('/api/materials');
      //@ts-ignore
      expect(response.status).toBe(200);
      //@ts-ignore
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Banners Module', () => {
    it('POST /banners - should create banner', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/banners')
        .send({
          title: 'Summer Sale',
          image: 'banner.jpg',
          isActive: true,
        });
      //@ts-ignore
      expect(response.status).toBe(201);
      //@ts-ignore
      expect(response.body.title).toBe('Summer Sale');
    });

    it('GET /banners - should return all banners', async () => {
      const response = await request(app.getHttpServer()).get('/api/banners');
      //@ts-ignore
      expect(response.status).toBe(200);
      //@ts-ignore
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent color', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/colors/99999',
      );
      //@ts-ignore
      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid color data', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/colors')
        .send({
          title: '', // Empty title should fail validation
          color: '#000000',
        });
      //@ts-ignore
      expect(response.status).toBe(400);
    });
  });
});
function beforeAll(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}

function afterAll(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}

function expect(status: any) {
  throw new Error('Function not implemented.');
}
