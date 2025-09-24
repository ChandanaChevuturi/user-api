import { prisma } from '../src/lib/prisma';
const cities = ['New York', 'San Francisco', 'Los Angeles', 'Seattle', 'Austin', 'Chicago'];
async function main() {
    const users = Array.from({ length: 20 }).map((_, i) => ({
        email: `user${i + 1}@example.com`,
        name: `User ${i + 1}`,
        city: cities[i % cities.length],
    }));
    await prisma.user.createMany({ data: users });
    console.log('✅ Seeded users');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
