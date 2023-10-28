const express = require('express');  // Подключаем библиотеку Express для создания веб-приложения
const cors = require('cors');        // Подключаем библиотеку CORS для обработки CORS-запросов
const puppeteer = require('puppeteer');  // Подключаем библиотеку Puppeteer для веб-скрапинга

const app = express();  // Создаем экземпляр Express приложения
const port = 3000;  // Устанавливаем порт, на котором будет слушать сервер

app.use(cors({ origin: 'http://localhost:3000' }));  // Настраиваем CORS для разрешения запросов с localhost:3000
app.use(express.static(__dirname));  // Указываем Express использовать статическую директорию (__dirname - текущая директория)

// Маршрут для получения данных о героях
app.get('/getImages', async (req, res) => {
    try {
        const browser = await puppeteer.launch();  // Запускаем браузер через Puppeteer
        const page = await browser.newPage();  // Создаем новую страницу в браузере
        await page.goto('https://stratz.com/heroes');  // Переходим на страницу с данными о героях

        const heroData = await page.evaluate(() => {  // Используем функцию evaluate для выполнения JavaScript в контексте страницы
            const data = [];  // Создаем пустой массив для хранения данных о героях
            const links = document.querySelectorAll('a[href^="/heroes/"]');  // Находим все ссылки на героев

            links.forEach(link => {  // Перебираем найденные ссылки
                const imgElement = link.querySelector('img');  // Находим изображение героя
                if (imgElement) {  // Если изображение найдено
                    const id = link.getAttribute('id');  // Получаем ID героя
                    const imageUrl = imgElement.src;  // Получаем URL изображения
                    const heroObject = { id, imageUrl };  // Создаем объект с ID и URL
                    data.push(heroObject);  // Добавляем объект в массив
                }
            });

            return data;  // Возвращаем массив данных о героях
        });

        await browser.close();  // Закрываем браузер
        res.json(heroData);  // Отправляем данные о героях как JSON
    } catch (error) {
        res.status(500).send('Произошла ошибка при загрузке данных о контрпиках');  // Отправляем статус ошибки и сообщение
    }
});

// Маршрут для получения данных о контрпиках
app.get('/getCounterPicks/:heroId', async (req, res) => {
    try {
        const heroId = req.params.heroId;  // Получаем ID героя из параметра запроса
        const browser = await puppeteer.launch();  // Запускаем браузер через Puppeteer
        const page = await browser.newPage();  // Создаем новую страницу в браузере
        const url = `https://stratz.com/heroes/${heroId}/matchups`;  // Формируем URL для страницы с контрпиками
        await page.goto(url);  // Переходим на страницу с контрпиками

        const idSelectors = [];
        const counterPickSelectors = [];

        for (let i = 3; i <= 125; i++) {
            const idSelector = `body > main > div:nth-child(5) > div > div.hitagi__sc-1ah81hi-0.fnunRJ > div:nth-child(${i}) > a`;
            const id = await page.$eval(idSelector, element => element.getAttribute('href').split('/')[2]);
            idSelectors.push(id);

            const counterPickSelector = `body > main > div:nth-child(5) > div > div.hitagi__sc-1ah81hi-0.fnunRJ > div:nth-child(${i}) > a > div:nth-child(4) > div.hitagi__sc-1ah81hi-0.fbsuIs`;
            const counterPickText = await page.$eval(counterPickSelector, element => element.textContent);

            // Убираем символ процента и преобразовываем оставшееся значение в число
            const counterPick = parseFloat(counterPickText.replace('%', ''));

            counterPickSelectors.push(counterPick);
        }

        await browser.close();

        // Формируем массив объектов
        const newdata = idSelectors.map((id, index) => ({
            id,
            CounterPick: counterPickSelectors[index]
        }));
        res.json(newdata);  // Отправляем данные о контрпиках как JSON
    } catch (error) {
    res.status(500).send('Произошла ошибка при загрузке данных о контрпиках');  // Отправляем статус ошибки и сообщение
    }
});

app.listen(port, () => {
    console.log(`Сервер слушает на порту ${port}`);  // Выводим сообщение о запуске сервера
});


