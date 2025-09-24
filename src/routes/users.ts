import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { createUserSchema, updateUserSchema, queryUsersSchema } from '../validators/user.schema.js';

export const usersRouter = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: List users with filters, pagination, and sorting.
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *       - in: query
 *         name: email
 *         schema: { type: string }
 *       - in: query
 *         name: createdBefore
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: createdAfter
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, name, email], default: createdAt }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       200:
 *         description: A paged list of users
 */
usersRouter.get('/', async (req, res) => {
  const parsed = queryUsersSchema.parse(req.query);
  const { city, name, email, createdAfter, createdBefore, page, pageSize, sortBy, order } = parsed;

  const where: any = {};
  if (city) where.city = { equals: city };
  if (name) where.name = { contains: name, mode: 'insensitive' };
  if (email) where.email = { contains: email, mode: 'insensitive' };
  if (createdAfter || createdBefore) {
    where.createdAt = {};
    if (createdAfter) where.createdAt.gte = new Date(createdAfter);
    if (createdBefore) where.createdAt.lte = new Date(createdBefore);
  }

  const [total, data] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  res.json({
    meta: { total, page, pageSize, hasNextPage: page * pageSize < total },
    data,
  });
});

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User found }
 *       404: { description: Not found }
 */
usersRouter.get('/:id', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ error: 'NotFound' });
  res.json(user);
});

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a user
 */
usersRouter.post('/', async (req, res) => {
  const body = createUserSchema.parse(req.body);
  const user = await prisma.user.create({ data: body });
  res.status(201).json(user);
});

/**
 * @openapi
 * /api/users/{id}:
 *   patch:
 *     summary: Update a user (partial)
 */
usersRouter.patch('/:id', async (req, res) => {
  const body = updateUserSchema.parse(req.body);
  try {
    const user = await prisma.user.update({ where: { id: req.params.id }, data: body });
    res.json(user);
  } catch (e: any) {
    if (e?.code === 'P2025') return res.status(404).json({ error: 'NotFound' });
    throw e;
  }
});

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 */
usersRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e: any) {
    if (e?.code === 'P2025') return res.status(404).json({ error: 'NotFound' });
    throw e;
  }
});
