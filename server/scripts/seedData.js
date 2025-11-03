import pg from 'pg';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'contacts_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function seedData() {
  try {
    // Читаем JSON файл
    const jsonPath = join(__dirname, '../../public/contacts.json');
    const jsonData = readFileSync(jsonPath, 'utf-8');
    const contacts = JSON.parse(jsonData);

    console.log(`📦 Found ${contacts.length} contacts to import`);

    // Очищаем таблицу
    await pool.query('TRUNCATE TABLE contacts RESTART IDENTITY');
    console.log('🗑️  Table cleared');

    // Импортируем данные
    let imported = 0;
    for (const contact of contacts) {
      const facebookLink = contact['employee_facebook.link'] || contact.employee_facebook_link || '';
      
      await pool.query(
        `INSERT INTO contacts 
         (employee_id, company_name_ru, company_id, employee_photo_file, 
          employee_position_title, employee_last_name_ru, employee_first_name_ru, 
          employee_facebook_link) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          contact.employee_id,
          contact.company_name_ru,
          contact.company_id,
          contact.employee_photo_file,
          contact.employee_position_title,
          contact.employee_last_name_ru,
          contact.employee_first_name_ru,
          facebookLink
        ]
      );
      imported++;
    }

    console.log(`✅ Successfully imported ${imported} contacts`);

    // Обновляем sequence для auto-increment
    await pool.query(`SELECT setval('contacts_employee_id_seq', (SELECT MAX(employee_id) FROM contacts))`);

    await pool.end();
    console.log('✅ Data seeding complete!');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
