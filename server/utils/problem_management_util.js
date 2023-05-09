const ApiError = require('../exceptions/api_error');

class ProblemManagementUtil {
    checkConfig(networkConfig) {
        if (!networkConfig.isDigitLabelsOnly && !networkConfig.letter) {
            throw ApiError.BadRequest("Выбрана опция с буквенными наименованиями вершин, но не выбрана буква!");
        }
        if (networkConfig.source === networkConfig.sink) {
            throw ApiError.BadRequest("Исток и сток не могут совпадать!");
        }
    }

    checkAdjacencyList(networkConfig, adjacencyList, source, sink) {
        if (adjacencyList[source].size === 0) {
            throw ApiError.BadRequest("Из истока не выходит ни одна дуга!");
        }
        if (adjacencyList[sink].size !== 0) {
            throw ApiError.BadRequest("Из стока не должны выходить дуги!");
        }
        let hasSinkSrcNodes = false, start = 0, end = networkConfig.countOfNodes - 1;
        let processedNodes = null;
        if (networkConfig.startsFromZero) {
            processedNodes = new Array(networkConfig.countOfNodes).fill(0);
        }
        else {
            start = 1;
            end = networkConfig.countOfNodes;
            processedNodes = new Array(networkConfig.countOfNodes + 1).fill(0);
        }
        for (let i = start; i <= end; i++) {
            if (i !== source && i !== sink && adjacencyList[i].size === 0) {
                throw ApiError.BadRequest(`Из вершины ${networkConfig.letter + i} не выходит ни одна дуга!`);
            }
            for (let targetNode of adjacencyList[i].keys()) {
                if (targetNode === source) {
                    throw ApiError.BadRequest("В исток не должны входить дуги!");
                }
                else if (targetNode === sink) {
                    hasSinkSrcNodes = true;
                }
                else {
                    processedNodes[targetNode] += 1;
                }
            }
        }
        for (let j = start; j <= end; j++) {
            if (j !== source && j !== sink && processedNodes[j] === 0) {
                throw ApiError.BadRequest(`В вершину ${networkConfig.letter + j} не входит ни одна дуга!`);
            }
        }
        if (!hasSinkSrcNodes) {
            throw ApiError.BadRequest("В сток не входит ни одна дуга!");
        }
    }

    checkEvaluationCriteria(evaluationCriteria) {
        const possinblePoints = Object.keys(evaluationCriteria).reverse();
        const stageNames = Object.keys(evaluationCriteria['1']);
        const mapOfStageNames = new Map([
            ["path", "Выбор пути"],
            ["newCapacities", "Ввод новых пропускных способностей"],
            ["currentFlow", "Обновление величины текущего потока"],
            ["minCut", "Нахождение минимального разреза"]
        ]);
        let i = +possinblePoints[0], countOfMatches = 0;
        while (i !== 1) {
            for (let stageName of stageNames) {
                if (evaluationCriteria[i][stageName] > evaluationCriteria[i-1][stageName]) {
                    throw ApiError.BadRequest(`Количество ошибок на этапе «${mapOfStageNames.get(stageName)}» для ${i} баллов превышает значение на данном этапе для ${i-1} баллов!`);
                }
                if (evaluationCriteria[i][stageName] === evaluationCriteria[i-1][stageName]) {
                    countOfMatches += 1;
                }
            }
            if (countOfMatches === 4) {
                throw ApiError.BadRequest(`Критерии для ${i} и ${i-1} баллов ничем не различаются!`);
            }
            countOfMatches = 0;
            i--;
        }
    }

    processGraph(graph) {
        graph.nodes = graph.nodes.map((node) => {
            return {
                data: {
                    id: node.data.id
                },
                position: node.position
            };
        });
        graph.edges = graph.edges.map((edge) => {
            return {
                data: {
                    source: edge.data.source,
                    target: edge.data.target,
                    capacity: edge.data.capacity,
                    flow: 0
                }
            };
        });
    }
}

module.exports = new ProblemManagementUtil();