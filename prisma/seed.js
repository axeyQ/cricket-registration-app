// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Check if admin user already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: 'admin' },
  });

  if (!existingAdmin) {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
      },
    });
    
    console.log('Admin user created successfully!');
  } else {
    console.log('Admin user already exists, skipping creation.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });