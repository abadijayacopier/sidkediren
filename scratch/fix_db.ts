import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding missing columns to profil_desa...');
  
  const columns = [
    { name: 'hero_title', type: 'VARCHAR(200)' },
    { name: 'hero_subtitle', type: 'TEXT' },
    { name: 'welcome_title', type: 'VARCHAR(200)' },
    { name: 'welcome_message', type: 'LONGTEXT' },
    { name: 'hero_image', type: 'TEXT' },
    { name: 'welcome_image', type: 'TEXT' },
    { name: 'running_text', type: 'TEXT' },
    { name: 'slider_images', type: 'LONGTEXT' }
  ];

  for (const col of columns) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE profil_desa ADD COLUMN ${col.name} ${col.type} NULL;`);
      console.log(`Added column ${col.name}`);
    } catch (e: any) {
      if (e.message.includes('Duplicate column name')) {
        console.log(`Column ${col.name} already exists`);
      } else {
        console.error(`Error adding column ${col.name}:`, e.message);
      }
    }
  }

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
