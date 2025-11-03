import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function createDatabase() {
  // Подключаемся к postgres для создания БД
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Создаем базу данных
    const dbName = process.env.DB_NAME || 'contacts_db';
    await client.query(`DROP DATABASE IF EXISTS ${dbName}`);
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`✅ Database '${dbName}' created`);

    await client.end();

    // Подключаемся к новой БД для создания таблицы
    const dbClient = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: dbName,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
    });

    await dbClient.connect();

    // Создаем таблицу
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        employee_id SERIAL PRIMARY KEY,
        company_name_ru TEXT,
        company_id INTEGER,
        employee_photo_file TEXT,
        employee_position_title TEXT,
        employee_last_name_ru TEXT,
        employee_first_name_ru TEXT,
        employee_facebook_link TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Table "contacts" created');

    await dbClient.end();
    console.log('✅ Database setup complete!');
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  }
}

createDatabase();
