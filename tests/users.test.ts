import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

beforeAll(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('User API', () => {
  test('POST /api/users creates a user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com', name: 'Testy', city: 'Austin' })
      .expect(201);

    expect(res.body.email).toBe('test@example.com');
  });

  test('GET /api/users?city=Austin filters by city', async () => {
    const res = await request(app)
      .get('/api/users?city=Austin')
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.every((u: any) => u.city === 'Austin')).toBe(true);
  });
});
