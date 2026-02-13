# Настройка GitHub Pages для yellowpages-info.com

## Шаг 1: Активация GitHub Pages

1. Откройте репозиторий: https://github.com/slobodin007-commits/yellow_pages
2. Перейдите в **Settings** (Настройки)
3. В левом меню выберите **Pages**
4. В разделе **Source** (Источник):
   - Branch: выберите `main`
   - Folder: выберите `/ (root)`
5. Нажмите **Save** (Сохранить)

## Шаг 2: Настройка домена yellowpages-info.com

### В GitHub:
Файл `CNAME` уже создан в репозитории с содержимым:
```
yellowpages-info.com
```

### У регистратора домена:

Добавьте следующие DNS записи:

**Вариант А (рекомендуемый):** A-записи на IP GitHub
```
A запись:
@  →  185.199.108.153
@  →  185.199.109.153
@  →  185.199.110.153
@  →  185.199.111.153

CNAME запись:
www  →  slobodin007-commits.github.io
```

**Вариант Б:** Только CNAME
```
CNAME запись:
@  →  slobodin007-commits.github.io
www  →  slobodin007-commits.github.io
```

## Шаг 3: Включение HTTPS

1. Вернитесь в **Settings → Pages**
2. Подождите 5-10 минут пока DNS обновится
3. Установите галочку **Enforce HTTPS** (Принудительный HTTPS)

## Шаг 4: Проверка

После настройки DNS (может занять до 24 часов, обычно 5-10 минут):

- Откройте: https://yellowpages-info.com
- Проверьте: https://www.yellowpages-info.com
- Проверьте: https://slobodin007-commits.github.io/yellow_pages

Все три адреса должны открывать ваш сайт.

## Дополнительно: Обновление контента

Чтобы обновить сайт:

1. Отредактируйте файлы локально
2. Закоммитьте изменения:
   ```bash
   git add .
   git commit -m "Описание изменений"
   git push origin main
   ```
3. GitHub Pages автоматически обновит сайт через 1-2 минуты

## Текущий статус

✅ Репозиторий: https://github.com/slobodin007-commits/yellow_pages
✅ CNAME файл создан
✅ Сайт готов к публикации
⏳ Осталось: активировать GitHub Pages и настроить DNS

## Полезные ссылки

- [Документация GitHub Pages](https://docs.github.com/en/pages)
- [Настройка custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [IP адреса GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain)
