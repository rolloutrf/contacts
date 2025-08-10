import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PHOTOS_DIR = path.join(__dirname, '..', 'public', 'photos');
const CONTACTS_FILE = path.join(__dirname, '..', 'public', 'contacts.json');

// Транслитерация кириллицы в латиницу
const translitMap = {
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ж': 'Zh', 'З': 'Z',
  'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P',
  'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch',
  'Ш': 'Sh', 'Щ': 'Shch', 'Ь': '', 'Ы': 'Y', 'Ъ': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh', 'з': 'z',
  'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
  'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
  'ш': 'sh', 'щ': 'shch', 'ь': '', 'ы': 'y', 'ъ': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'ё': 'yo', 'Ё': 'Yo'
};

function transliterate(text) {
  return text.split('').map(char => translitMap[char] || char).join('');
}

// Читаем список файлов в папке photos
const photoFiles = fs.readdirSync(PHOTOS_DIR).filter(file => file.endsWith('.jpg'));

const renameMap = new Map();

console.log('Переименовываем файлы фотографий...');

photoFiles.forEach(fileName => {
  const newFileName = transliterate(fileName);
  const oldPath = path.join(PHOTOS_DIR, fileName);
  const newPath = path.join(PHOTOS_DIR, newFileName);
  
  if (fileName !== newFileName) {
    fs.renameSync(oldPath, newPath);
    renameMap.set(fileName, newFileName);
    console.log(`${fileName} → ${newFileName}`);
  }
});

// Обновляем контакты с новыми именами файлов
const contactsData = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf8'));

contactsData.contacts = contactsData.contacts.map(contact => {
  const currentUrl = contact.employee_photo_url;
  const fileName = decodeURIComponent(currentUrl.replace('/photos/', ''));
  const newFileName = renameMap.get(fileName) || fileName;
  
  return {
    ...contact,
    employee_photo_url: `/photos/${newFileName}`
  };
});

fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contactsData, null, 2));

console.log('✅ Фотографии переименованы и контакты обновлены');
console.log(`📊 Переименовано ${renameMap.size} файлов`);