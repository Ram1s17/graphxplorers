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

    checkEvaluationCriteria(evaluationCriteria, points) {
        let correctPoints = Array.from({ length: points }, (_, i) => i + 1);
        let possiblePoints = new Set();
        for (let criteria of evaluationCriteria) {
            possiblePoints.add(criteria.points);
        }
        possiblePoints = Array.from(possiblePoints);
        const diff = correctPoints.filter(points => !possiblePoints.includes(points));
        if (diff.length !== 0 || correctPoints.length !== possiblePoints.length) {
            throw ApiError.BadRequest(`Не заданы критерии для следующего количества баллов: ${diff.join(', ')}`);
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

    convertAdjacencyListToNetwork(networkConfig, adjacencyList, nodesList, subtype) {
        const nodes = nodesList.map((node) => {
            node.data.label = networkConfig.letter + node.data.id;
            if (subtype === 'mincut' && (node.data.id == networkConfig.source || node.data.id == networkConfig.sink)) {
                node.classes = 'colored';
            }
            return node;
        });
        const edges = [];
        for (let i = 0; i < adjacencyList.length; i++) {
            for (let targetNode of adjacencyList[i].entries()) {
                edges.push({
                    data: {
                        source: String(i),
                        target: String(targetNode[0]),
                        label: String(targetNode[1]),
                        capacity: targetNode[1]
                    }
                });
            }
        }
        return { nodes, edges };
    }

    convertAdjacencyListToCapacitiesNetwork(networkConfig, networks, nodesList) {
        const nodes = nodesList.map((node) => {
            node.data.label = networkConfig.letter + node.data.id;
            networks.pathNodes.includes(Number(node.data.id)) ? node.selected = true : node.selected = false;
            if (node.data.id == networkConfig.source || node.data.id == networkConfig.sink) {
                node.classes = 'colored';
            }
            return node;
        });
        const edgesSrc = [];
        for (let i = 0; i < networks.sourceGraph.length; i++) {
            for (let targetNode of networks.sourceGraph[i].entries()) {
                edgesSrc.push({
                    data: {
                        source: String(i),
                        target: String(targetNode[0]),
                        label: String(targetNode[1]),
                        capacity: targetNode[1]
                    },
                    selected: networks.pathNodes.includes(i) && networks.pathNodes.includes(targetNode[0]) && 
                              networks.pathNodes.indexOf(targetNode[0]) - networks.pathNodes.indexOf(i) === 1 ? true : false
                });
            }
        }
        const residualGraph = networks.sourceGraph.slice();
        for (let i = 0; i < networks.pathNodes.length - 1; i++) {
            if (!residualGraph[networks.pathNodes[i+1]].has(networks.pathNodes[i])) {
                residualGraph[networks.pathNodes[i+1]].set(networks.pathNodes[i], 0);
            }
        }
        const edgesRsdl = [];
        for (let i = 0; i < residualGraph.length; i++) {
            for (let targetNode of residualGraph[i].entries()) {
                edgesRsdl.push({
                    data: {
                        source: String(i),
                        target: String(targetNode[0]),
                        label: String(targetNode[1]),
                        capacity: targetNode[1]
                    }
                });
            }
        }
        return {
            processedNodesAndEdgesSrc: { nodes, edges: edgesSrc },
            processedNodesAndEdgesRsdl: { nodes, edges: edgesRsdl }
        };
    }
}

module.exports = new ProblemManagementUtil();