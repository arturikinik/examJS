const getDataButton = document.getElementById('getDataButton');
const heroesTableBody = document.getElementById('heroesTableBody');
const selectedHeroesContainer = document.querySelector('.selected-heroes'); // Контейнер для выбранных изображений
const imageWidth = 42; // Ширина изображения
const imageHeight = 62; // Высота изображения
const MAX_SELECTED_HEROES = 5; // Максимальное количество выбранных изображений

let selectedHeroes = []; // Массив для хранения выбранных изображений и их id

getDataButton.addEventListener('click', async () => {
    try {
        const timestamp = Date.now();
        const response = await fetch('/getImages?timestamp=' + timestamp);
        const heroData = await response.json();

        heroesTableBody.innerHTML = '';

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


        let currentHeroIndex = 0;

        for (let i = 0; i < rowsData.length; i++) {
            const row = document.createElement('tr');
            const { count, spacing } = rowsData[i];

            for (let j = 0; j < count; j++) {
                if (currentHeroIndex < heroData.length) {
                    const hero = heroData[currentHeroIndex];
                    const imgCell = document.createElement('td');
                    const img = document.createElement('img');
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
                spacerCell.style.height = spacing + 'px';
                spacerRow.appendChild(spacerCell);
                heroesTableBody.appendChild(spacerRow);
            }
        }
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
});

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


function removeSelectedHero(selectedHeroImage, heroId) {
    // Удаляем выбранное изображение из контейнера
    selectedHeroesContainer.removeChild(selectedHeroImage);

    // Удаляем выбранного героя из массива
    selectedHeroes = selectedHeroes.filter(hero => hero.id !== heroId);
}
