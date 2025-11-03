import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'contacts_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts ORDER BY employee_id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Get single contact
app.get('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM contacts WHERE employee_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// Create new contact
app.post('/api/contacts', async (req, res) => {
  try {
    const {
      company_name_ru,
      company_id,
      employee_photo_file,
      employee_position_title,
      employee_last_name_ru,
      employee_first_name_ru,
      employee_facebook_link
    } = req.body;

    const result = await pool.query(
      `INSERT INTO contacts 
       (company_name_ru, company_id, employee_photo_file, employee_position_title, 
        employee_last_name_ru, employee_first_name_ru, employee_facebook_link) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [company_name_ru, company_id, employee_photo_file, employee_position_title, 
       employee_last_name_ru, employee_first_name_ru, employee_facebook_link]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// Update contact
app.put('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company_name_ru,
      company_id,
      employee_photo_file,
      employee_position_title,
      employee_last_name_ru,
      employee_first_name_ru,
      employee_facebook_link
    } = req.body;

    const result = await pool.query(
      `UPDATE contacts 
       SET company_name_ru = $1, company_id = $2, employee_photo_file = $3, 
           employee_position_title = $4, employee_last_name_ru = $5, 
           employee_first_name_ru = $6, employee_facebook_link = $7
       WHERE employee_id = $8
       RETURNING *`,
      [company_name_ru, company_id, employee_photo_file, employee_position_title,
       employee_last_name_ru, employee_first_name_ru, employee_facebook_link, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Delete contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM contacts WHERE employee_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});
