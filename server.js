const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

// Используем CORS middleware для обработки запросов с других доменов
app.use(cors({ origin: 'http://localhost:3000/getImages' }));

// Указываем текущую директорию как корневую для статических файлов
app.use(express.static(__dirname));

// Обработчик GET-запроса на путь '/getImages'
app.get('/getImages', async (req, res) => {
    try {
        // Запускаем браузер с использованием Puppeteer
        const browser = await puppeteer.launch();

        // Создаем новую страницу в браузере
        const page = await browser.newPage();

        // Переходим на страницу https://stratz.com/heroes
        await page.goto('https://stratz.com/heroes');

        // Извлекаем данные о героях с веб-страницы с помощью JavaScript в браузере
        const heroData = await page.evaluate(() => {
            const data = [];
            const links = document.querySelectorAll('a[href^="/heroes/"]');

            links.forEach(link => {
                const imgElement = link.querySelector('img');
                if (imgElement) {
                    const id = link.getAttribute('id'); // Получаем значение атрибута 'id' из элемента <a>
                    const imageUrl = imgElement.src;
                    const heroObject = { id, imageUrl }; // Создаем объект с id и URL изображения
                    data.push(heroObject); // Добавляем объект в массив data
                }
            });

            return data;
        });

        // Закрываем браузер
        await browser.close();

        // Отправляем данные о героях в виде JSON-ответа на запрос
        res.json(heroData);
    } catch (error) {
        // В случае ошибки, логгируем её и отправляем клиенту статус 500 с сообщением об ошибке
        console.error('Произошла ошибка при запросе данных:', error);
        res.status(500).send('Произошла ошибка при загрузке данных');
    }
});

// Запускаем сервер на указанном порту
app.listen(port, () => {
    console.log(`Сервер слушает на порту ${port}`);
});


