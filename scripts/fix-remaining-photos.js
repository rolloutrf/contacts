import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTACTS_FILE = path.join(__dirname, '..', 'public', 'contacts.json');

// Mapping of problematic contacts to their correct photo files
const photoMapping = {
  'Григорий Чемерис': 'Grigoriĭ_Chemeris.jpg',
  'Дмитрий Вакин': 'Dmitriĭ_Vakin.jpg',
  'Дмитрий Манаенков': 'Dmitriĭ_Manaenkov.jpg'
};

// Read contacts data
const contactsData = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf8'));

console.log('Fixing remaining photo URLs...');

let fixedCount = 0;

contactsData.contacts = contactsData.contacts.map(contact => {
  const fullName = `${contact.employee_first_name_ru} ${contact.employee_last_name_ru}`;
  
  if (photoMapping[fullName]) {
    const newPhotoUrl = `/photos/${photoMapping[fullName]}`;
    console.log(`${fullName}: ${contact.employee_photo_url} → ${newPhotoUrl}`);
    fixedCount++;
    
    return {
      ...contact,
      employee_photo_url: newPhotoUrl
    };
  }
  
  return contact;
});

// Save updated contacts
fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contactsData, null, 2));

console.log(`✅ Fixed ${fixedCount} photo URLs`);
console.log('All photos should now load correctly');