import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTACTS_FILE = path.join(__dirname, '..', 'public', 'contacts.json');

// Читаем файл контактов
const contactsData = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf8'));

// Обновляем URL фотографий с правильным encoding
contactsData.contacts = contactsData.contacts.map(contact => ({
  ...contact,
  employee_photo_url: `/photos/${encodeURIComponent(contact.employee_photo_url.replace('/photos/', ''))}`
}));

// Сохраняем обновленный файл
fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contactsData, null, 2));

console.log('✅ URLs фотографий обновлены с proper encoding');
console.log('Пример URL:', contactsData.contacts[0].employee_photo_url);