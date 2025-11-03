# Contacts App v9.5 (with PostgreSQL backend)

## Запуск приложения

### Требования
- Node.js 18+
- PostgreSQL 15

### Backend (PostgreSQL + Express)

```bash
cd server
npm install

# Создать базу данных и таблицы
npm run db:create

# Импортировать данные из JSON
npm run db:seed

# Запустить сервер (порт 3001)
npm start
# или в режиме разработки с авто-перезагрузкой:
npm run dev
```

### Frontend (React + Vite)

```bash
# В корне проекта
npm install
npm run dev   # запускает Vite на 5173
```

## Фичи
- Карточки + модалка с контактами
- Поиск/фильтры по имени, компании, индустрии, функции
- Тёмная тема (переключатель в хедере)
- React Query + Devtools
- TailwindCSS + Radix UI
- REST API с PostgreSQL
- CRUD операции для контактов

## API Endpoints

- `GET /api/contacts` - получить все контакты
- `GET /api/contacts/:id` - получить контакт по ID
- `POST /api/contacts` - создать новый контакт
- `PUT /api/contacts/:id` - обновить контакт
- `DELETE /api/contacts/:id` - удалить контакт

## Развертывание

Проект автоматически развертывается в Yandex Object Storage при каждом пуше в ветку `main` с помощью GitHub Actions.
