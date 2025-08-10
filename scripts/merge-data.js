import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Пути к файлам данных
const EMPLOYEE_FILE = '/Users/mokoloskov/Desktop/employee_[92]_08.08.2025.json';
const COMPANY_FILE = '/Users/mokoloskov/Desktop/company_[56]_08.08.2025.json';
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'contacts.json');

// Функция для определения функции по должности
function getFunction(position) {
  const pos = position.toLowerCase();
  if (pos.includes('design') || pos.includes('дизайн')) return 'Design';
  if (pos.includes('developer') || pos.includes('разработчик') || pos.includes('программист')) return 'Development';
  if (pos.includes('product') || pos.includes('продукт')) return 'Product';
  if (pos.includes('marketing') || pos.includes('маркетинг')) return 'Marketing';
  if (pos.includes('manager') || pos.includes('менеджер')) return 'Product';
  return 'Development'; // по умолчанию
}

// Функция для генерации URL фото на основе имени файла
function getPhotoUrl(photoFile) {
  // Используем локальные фотографии с URL encoding для кириллицы
  return `/photos/${encodeURIComponent(photoFile)}`;
}

// Простая hash функция для генерации постоянных ID
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Конвертация в 32-битное целое
  }
  return hash;
}

// Маппинг индустрий
function mapIndustry(industry) {
  const industryMap = {
    'Финансы': 'Банки',
    'Технологии': 'Маркетплейсы',
    'Логистика': 'Логистика',
    'Медиа': 'Социальные сети'
  };
  return industryMap[industry] || 'Банки';
}

async function mergeData() {
  try {
    console.log('Загружаем данные...');
    
    // Читаем файлы
    const employeesRaw = fs.readFileSync(EMPLOYEE_FILE, 'utf8');
    const companiesRaw = fs.readFileSync(COMPANY_FILE, 'utf8');
    
    const employees = JSON.parse(employeesRaw);
    const companies = JSON.parse(companiesRaw);
    
    console.log(`Найдено ${employees.length} сотрудников и ${companies.length} компаний`);
    
    // Создаем карту компаний для быстрого поиска
    const companyMap = new Map();
    companies.forEach(company => {
      companyMap.set(company.company_id, company);
    });
    
    // Объединяем данные
    const contacts = employees.map((employee, index) => {
      const company = companyMap.get(employee.company_id);
      
      return {
        id: index + 1,
        employee_photo_url: getPhotoUrl(employee.employee_photo_file),
        employee_first_name_ru: employee.employee_first_name_ru,
        employee_last_name_ru: employee.employee_last_name_ru,
        employee_position_title: employee.employee_position_title,
        company_name_ru: employee.company_name_ru,
        industry: company ? mapIndustry(company.company_industry) : 'Банки',
        function: getFunction(employee.employee_position_title),
        // Дополнительные поля для будущего использования
        company_url: company ? company.company_url : '',
        company_country: company ? company.company_country : '',
        facebook_link: employee.employee_facebook_link || ''
      };
    });
    
    // Создаем итоговую структуру
    const result = {
      contacts: contacts
    };
    
    // Сохраняем результат
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf8');
    
    console.log(`✅ Данные успешно объединены и сохранены в ${OUTPUT_FILE}`);
    console.log(`📊 Создано ${contacts.length} контактов`);
    
    // Статистика по индустриям
    const industryStats = {};
    contacts.forEach(contact => {
      industryStats[contact.industry] = (industryStats[contact.industry] || 0) + 1;
    });
    
    console.log('\n📈 Статистика по индустриям:');
    Object.entries(industryStats).forEach(([industry, count]) => {
      console.log(`  ${industry}: ${count}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка при объединении данных:', error);
    process.exit(1);
  }
}

// Запускаем скрипт
mergeData();