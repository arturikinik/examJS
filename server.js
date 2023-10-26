// server.js

const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:3000/getImages' }));
app.use(express.static(__dirname));

app.get('/getImages', async (req, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://stratz.com/heroes');

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

        await browser.close();
        res.json(heroData); // Отправляем массив объектов вместо URL изображений
    } catch (error) {
        console.error('Произошла ошибка при запросе данных:', error);
        res.status(500).send('Произошла ошибка при загрузке данных');
    }
});

app.listen(port, () => {
    console.log(`Сервер слушает на порту ${port}`);
});

