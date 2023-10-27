// Получаем ссылку на кнопку с id 'getDataButton'
const getDataButton = document.getElementById('getDataButton');

// Получаем ссылку на элемент с id 'heroesTableBody'
const heroesTableBody = document.getElementById('heroesTableBody');

// Получаем ссылку на контейнер для выбранных изображений с классом 'selected-heroes'
const selectedHeroesContainer = document.querySelector('.selected-heroes');

// Задаем ширину изображения
const imageWidth = 42;

// Задаем высоту изображения
const imageHeight = 62;

// Максимальное количество выбранных изображений
const MAX_SELECTED_HEROES = 5;

// Массив для хранения выбранных изображений и их id
let selectedHeroes = [];

// Добавляем обработчик события на кнопку 'Получить свежие данные о героях'
getDataButton.addEventListener('click', async () => {
    try {
        // Генерируем метку времени
        const timestamp = Date.now();

        // Отправляем запрос на сервер '/getImages' с меткой времени
        const response = await fetch('/getImages?timestamp=' + timestamp);

        // Получаем данные о героях в формате JSON
        const heroData = await response.json();

        // Очищаем таблицу героев перед добавлением новых данных
        heroesTableBody.innerHTML = '';

        // Данные для распределения героев по таблице
        const rowsData = [
            { count: 16, spacing: 4 },
            { count: 15, spacing: 40 },
            { count: 16, spacing: 4 },
            { count: 15, spacing: 40 },
            { count: 16, spacing: 4 },
            { count: 14, spacing: 40 },
            { count: 16, spacing: 4 },
            { count: 16, spacing: 0 }
        ];

        // Индекс текущего героя в массиве heroData
        let currentHeroIndex = 0;

        // Перебираем данные для распределения героев по таблице
        for (let i = 0; i < rowsData.length; i++) {
            const row = document.createElement('tr');
            const { count, spacing } = rowsData[i];

            for (let j = 0; j < count; j++) {
                if (currentHeroIndex < heroData.length) {
                    const hero = heroData[currentHeroIndex];
                    const imgCell = document.createElement('td');
                    const img = document.createElement('img');

                    // Устанавливаем путь к изображению героя
                    img.src = hero.imageUrl;
                    img.width = imageWidth;
                    img.height = imageHeight;
                    imgCell.appendChild(img);

                    // Добавляем обработчик события для изображения в основном блоке
                    img.addEventListener('click', () => {
                        addSelectedHero(hero);
                    });

                    row.appendChild(imgCell);
                    currentHeroIndex++;
                }
            }

            heroesTableBody.appendChild(row);

            if (i < rowsData.length - 1) {
                const spacerRow = document.createElement('tr');
                const spacerCell = document.createElement('td');

                // Устанавливаем высоту промежутка
                spacerCell.style.height = spacing + 'px';
                spacerRow.appendChild(spacerCell);
                heroesTableBody.appendChild(spacerRow);
            }
        }
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
});

// Функция для добавления выбранного героя
function addSelectedHero(hero) {
    if (selectedHeroes.length < MAX_SELECTED_HEROES) {
        // Проверяем, что не превышено максимальное количество выбранных героев
        const imageUrl = hero.imageUrl;
        // Проверяем, что данное изображение ещё не выбрано
        if (!selectedHeroes.some(selectedHero => selectedHero.image.src === imageUrl)) {
            const selectedHeroImage = document.createElement('img');
            selectedHeroImage.src = imageUrl;
            selectedHeroImage.width = imageWidth;
            selectedHeroImage.height = imageHeight;

            // Добавляем обработчик события для выбранного изображения
            selectedHeroImage.addEventListener('click', () => {
                removeSelectedHero(selectedHeroImage, hero.id);
            });

            // Добавляем выбранное изображение в контейнер
            selectedHeroesContainer.appendChild(selectedHeroImage);

            // Добавляем выбранного героя в массив
            selectedHeroes.push({ id: hero.id, image: selectedHeroImage });
        }
    }
}

// Функция для удаления выбранного героя
function removeSelectedHero(selectedHeroImage, heroId) {
    // Удаляем выбранное изображение из контейнера
    selectedHeroesContainer.removeChild(selectedHeroImage);

    // Удаляем выбранного героя из массива
    selectedHeroes = selectedHeroes.filter(hero => hero.id !== heroId);
}
