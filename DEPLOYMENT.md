# Деплой в Yandex Cloud

## 1. Создание PostgreSQL кластера

### В Yandex Cloud Console:
1. Перейти в **Managed Service for PostgreSQL**
2. Нажать **Создать кластер**
3. Настройки:
   - **Имя:** contacts-db
   - **Версия:** PostgreSQL 15
   - **Окружение:** Production или Development
   - **Класс хоста:** s2.micro (для начала)
   - **Хранилище:** 10 GB network-ssd
   - **Публичный доступ:** ✅ включить
   - **База данных:** contacts_db
   - **Пользователь:** создать нового

4. Сохранить **хост, порт, пользователя и пароль**

## 2. Импорт данных в облачную БД

```bash
# Из папки server/
psql -h c-XXXXX.rw.mdb.yandexcloud.net \
     -p 6432 \
     -U <username> \
     -d contacts_db \
     -f backup.sql
```

При запросе пароля введите пароль от БД.

## 3. Обновление переменных окружения

Создать файл `server/.env.production`:

```env
DB_HOST=c-XXXXX.rw.mdb.yandexcloud.net
DB_PORT=6432
DB_NAME=contacts_db
DB_USER=<your-username>
DB_PASSWORD=<your-password>

PORT=3001
```

## 4. Деплой Backend

### Вариант A: Yandex Cloud Functions (рекомендуется)

1. Упаковать backend в zip
2. Загрузить в Cloud Functions
3. Указать переменные окружения
4. Получить URL функции

### Вариант B: Compute Cloud (VM)

```bash
# На VM с Ubuntu
git clone <repo>
cd contacts/server
npm install
npm start
```

### Вариант C: Yandex Container Registry + Serverless Containers

```bash
# Создать Dockerfile для backend
docker build -t cr.yandex/<registry-id>/contacts-backend:latest .
docker push cr.yandex/<registry-id>/contacts-backend:latest
```

## 5. Обновление Frontend

В `src/App.jsx` изменить API URL:

```javascript
async function getContacts() {
  const res = await fetch('https://your-backend-url.ru/api/contacts');
  // ...
}
```

## 6. Проверка

- Frontend: https://your-bucket.website.yandexcloud.net
- Backend API: https://your-backend-url.ru/health
- Database: проверить подключение через psql

## Полезные команды

```bash
# Экспорт БД
pg_dump -U mokoloskov -d contacts_db --clean --if-exists -f backup.sql

# Импорт БД
psql -h <host> -p 6432 -U <user> -d contacts_db -f backup.sql

# Проверка подключения
psql -h <host> -p 6432 -U <user> -d contacts_db -c "SELECT COUNT(*) FROM contacts;"
```

## Стоимость (примерно)

- **PostgreSQL (s2.micro):** ~1500₽/мес
- **Object Storage:** ~1₽/GB
- **Cloud Functions:** первые 1M вызовов бесплатно
- **Egress трафик:** первые 100GB бесплатно

## Безопасность

1. Использовать SSL для подключения к БД
2. Настроить Security Groups
3. Хранить пароли в Yandex Lockbox
4. Включить 2FA для аккаунта
