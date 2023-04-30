export const authFeatureItems = [
    {
        img: 'images/auth_page/theory.png',
        title: "Теория",
        body: "Все необходимые теоретические материалы на одной странице."
    },
    {
        img: 'images/auth_page/test.png',
        title: "Тесты",
        body: "Проверь свои знания на тематических тестах!"
    },
    {
        img: 'images/auth_page/practice.png',
        title: "Практика",
        body: "Практикуйся, решая задачи с уровнями сложности!"
    },
    {
        img: 'images/auth_page/lk.png',
        title: "Прогресс",
        body: "Результаты решения тестов и задач сохраняются в личном кабинете!"
    }
];

export const mainFeatureItems = [
    {
        body: "Изучайте все необходимые темы из теории графов: основные понятия, транспортные сети, задачу поиска максимального потока и минимального разреза транспортной сети",
        buttonText: "К теории",
        path: '/theory'
    },
    {
        body: "Изучили теорию и хотите проверить свои знания? Если уверены в своих силах, то тематические тесты помогут Вам в этом! Выбирайте нужную тему и начинайте решать прямо сейчас!",
        buttonText: "К тестам",
        path: '/tests'
    },
    {
        body: "Решайте задачи о поиске максимального потока и минимального разреза с помощью интерактивного тренажера. Выбирайте уровень сложности, решайте и набирайте баллы!",
        buttonText: "К задачам",
        path: '/practice'
    }
];

export const getEdgeLabel = (networkConfig, node) => {
    return networkConfig.isDigitLabelsOnly ? node : networkConfig.letter + node;
};