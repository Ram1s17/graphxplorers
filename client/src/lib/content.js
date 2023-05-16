export const authFeatureItems = [
    {
        img: 'images/auth_page/theory.png',
        title: "Теория",
        body: "Все необходимые теоретические материалы на одной странице."
    },
    {
        img: 'images/auth_page/test.png',
        title: "Тесты",
        body: "Проверь свои знания на теоретических и интерактивных тестах!"
    },
    {
        img: 'images/auth_page/practice.png',
        title: "Практика",
        body: "Практикуйся, решая задачи различного уровня сложности!"
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
        body: "Изучили теорию и хотите проверить свои знания? Теоретические тесты помогут Вам в этом! А интерактивные тесты позволят улучшить понимание отдельных этапов решения задач",
        buttonText: "К тестам",
        path: '/tests'
    },
    {
        body: "Решайте задачи поиска максимального потока и минимального разреза с помощью интерактивного тренажера. Выбирайте уровень сложности, решайте и набирайте баллы!",
        buttonText: "К задачам",
        path: '/practice'
    }
];

export const getNodeLabel = (networkConfig, node) => {
    return networkConfig.isDigitLabelsOnly ? node : networkConfig.letter + node;
};

export const getSubtypeLabel = (subtype) => {
    let label = '';
    switch (subtype) {
        case 'path':
            label = "выбор пути";
            break;
        case 'capacities':
            label = "ввод пропускных способностей";
            break;
        case 'mincut':
            label = "минимальный разрез";
            break;
        default:
            label = '';
    }
    return label;
};

export const getLabelForTypeOfTest = (type) => {
    let label = '';
    switch (type) {
        case 'theoretical':
            label = "Теоретический тест";
            break;
        case 'interactive':
            label = "Интерактивный тест";
            break;
        case 'mix':
            label = "Общий тест";
            break;
        default:
            label = '';
    }
    return label;
};

export const cytoscapeConfig = {
    zoom: 1,
    userPanningEnabled: false,
    userZoomingEnabled: false,
    autolock: true,
    autounselectify: true,
    style: { width: '95%', height: '95%' },
    stylesheet: [
        {
            selector: 'node',
            style: {
                width: 38,
                height: 38,
                'background-color': '#E9E9E9',
                'text-valign': 'center',
                'text-halign': 'center',
                'label': 'data(label)'
            }
        },
        {
            selector: ':selected',
            style: {
                'background-color': '#FF7878',
            }
        },
        {
            selector: '.colored',
            style: {
                'background-color': '#FFF',
                'border-width': '2px'
            }
        },
        {
            selector: 'edge',
            style: {
                width: 2,
                'line-color': '#000',
                'target-arrow-color': '#000',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'text-background-color': '#FFF2C6',
                'text-background-opacity': 1,
                'label': 'data(label)',

            }
        },
        {
            selector: ':selected',
            style: {
                'line-color': '#FF7878',
                'target-arrow-color': '#FF7878',
            }
        }
    ]
};

export const stylesheetForMincut = [
    {
        selector: 'node',
        style: {
            width: 38,
            height: 38,
            'background-color': '#E9E9E9',
            'text-valign': 'center',
            'text-halign': 'center',
            'label': 'data(label)'
        }
    },
    {
        selector: '.colored',
        style: {
            'background-color': '#FFF',
            'border-width': '2px'
        }
    },
    {
        selector: 'edge',
        style: {
            width: 2,
            'line-color': '#000',
            'target-arrow-color': '#000',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'text-background-color': '#FFF2C6',
            'text-background-opacity': 1,
            'label': 'data(label)',

        }
    },
    {
        selector: ':selected',
        style: {
            'line-color': '#FF7878',
            'target-arrow-color': '#FF7878',
        }
    }
];