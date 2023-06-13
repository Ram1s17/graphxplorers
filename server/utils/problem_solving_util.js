const ApiError = require('../exceptions/api_error');

class ProblemSolvingUtil {
    convertGraph(graph, isFlowType) {
        let nodes = JSON.parse(JSON.stringify(graph.nodes));
        nodes = nodes.map((node) => {
            if (node.data.id == graph.config.source || node.data.id == graph.config.sink) {
                node.classes = 'colored';
            }
            if (graph.config.isDigitLabelsOnly) {
                node.data.label = String(node.data.id);
                return node;
            }
            else {
                node.data.label = String(graph.config.letter + node.data.id);
                return node;
            }
        });
        let edges = JSON.parse(JSON.stringify(graph.edges));
        edges = edges.map((edge) => {
            if (isFlowType) {
                edge.data.label = String(edge.data.flow + '/' + edge.data.capacity);
                return edge;
            }
            else {
                delete edge.data.flow;
                edge.data.label = String(edge.data.capacity);
                return edge;
            }
        });
        return nodes.concat(edges);
    }

    getAdjacencyList(networkConfig, edgesList, isWithNewCapacities) {
        let adjacencyList = null;
        if (networkConfig.startsFromZero) {
            adjacencyList = new Array(networkConfig.countOfNodes).fill().map(() => {
                return new Map();
            });
        }
        else {
            adjacencyList = new Array(networkConfig.countOfNodes + 1).fill().map(() => {
                return new Map();
            });
        }
        for (let edge of edgesList) {
            if (!isWithNewCapacities) {
                adjacencyList[+edge.data.source].set(+edge.data.target, edge.data.capacity);
            }
            else {
                adjacencyList[+edge.data.source].set(+edge.data.target, edge.data.newCapacity);
            }
        }
        return adjacencyList;
    }

    getOnlySelectedModesAndEdges(graph) {
        graph.nodes = graph.nodes.filter(node => node.selected);
        graph.edges = graph.edges.filter(edge => edge.selected);
        if (graph.nodes.length === 0) {
            throw ApiError.BadRequest('Не выбрана ни одна вершина!');
        }
        if (graph.edges.length === 0) {
            throw ApiError.BadRequest('Не выбрана ни одна дуга!');
        }
    }

    checkNodesAndEdges(networkConfig, nodesList, edgesList) {
        const nodes = nodesList.map((node) => {
            return +node.data.id
        });
        if (!nodes.includes(networkConfig.source)) {
            throw ApiError.BadRequest('Исток не выбран!');
        }
        if (!nodes.includes(networkConfig.sink)) {
            throw ApiError.BadRequest('Сток не выбран!');
        }
        let pathAdjacencyList = null;
        if (networkConfig.startsFromZero) {
            pathAdjacencyList = new Array(networkConfig.countOfNodes).fill().map(() => {
                return new Map();
            });
        }
        else {
            pathAdjacencyList = new Array(networkConfig.countOfNodes + 1).fill().map(() => {
                return new Map();
            });
        }
        const processedNodes = new Set();
        let src, trgt;
        for (let edge of edgesList) {
            src = +edge.data.source;
            trgt = +edge.data.target;
            if (!nodes.includes(src) || !nodes.includes(trgt)) {
                throw ApiError.BadRequest('Выбрана дуга, но не выбрана(-ы) вершина(-ы)!');
            }
            if (pathAdjacencyList[src].size === 1) {
                throw ApiError.BadRequest(`Из вершины ${src} исходит более 1 дуги!`);
            }
            pathAdjacencyList[src].set(trgt, edge.data.capacity);
            processedNodes.add(src);
            processedNodes.add(trgt);
        }
        if (nodes.length !== processedNodes.size) {
            throw ApiError.BadRequest('Выбраны вершины, но не выбрана дуга между ними/Выбрана изолированная вершина!');
        }
        return { pathAdjacencyList, processedNodes };
    }

    customDFS(graph, visited, now, pathNodes, processedCapacities) {
        visited[now] = true;
        for (let neig of graph[now].keys()) {
            if (!visited[neig]) {
                pathNodes.add(neig);
                processedCapacities.add(graph[now].get(neig));
                this.customDFS(graph, visited, neig, pathNodes, processedCapacities);
            }
        }
    }

    getPath(networkConfig, pathAdjacencyList, srcProcessedNodes) {
        if (pathAdjacencyList[networkConfig.sink].size > 0) {
            throw ApiError.BadRequest('Выбран неверный путь!');
        }
        let visited = null;
        let pathNodes = new Set();
        let processedCapacities = new Set();
        if (networkConfig.startsFromZero) {
            visited = new Array(networkConfig.countOfNodes).fill(false);
        }
        else {
            visited = new Array(networkConfig.countOfNodes + 1).fill(false);
        }
        pathNodes.add(networkConfig.source);
        this.customDFS(pathAdjacencyList, visited, networkConfig.source, pathNodes, processedCapacities);
        if (pathNodes.size !== srcProcessedNodes.size) {
            throw ApiError.BadRequest('Выбран неверный путь!');
        }
        return { pathNodes, processedCapacities };
    }

    getPathNetworkFromAdjacencyList(networkConfig, adjacencyList, pathNodes) {
        let edges = [];
        pathNodes = Array.from(pathNodes);
        let i = 0;
        while (pathNodes[i] !== networkConfig.sink) {
            if (!adjacencyList[pathNodes[i]].has(pathNodes[i + 1])) {
                adjacencyList[pathNodes[i]].set(pathNodes[i + 1], 0);
            }
            if (!adjacencyList[pathNodes[i + 1]].has(pathNodes[i])) {
                adjacencyList[pathNodes[i + 1]].set(pathNodes[i], 0);
            }
            i++;
        }
        for (let j = 0; j < adjacencyList.length; j++) {
            for (let edge of adjacencyList[j].entries()) {
                edges.push({
                    data: {
                        source: j,
                        target: edge[0],
                        capacity: edge[1],
                        label: String(edge[1])
                    }
                });
            }
        }
        return edges;
    }

    getPathFlow(pathCapacities) {
        let pathFlow = Number.MAX_VALUE;
        for (let i = 0; i < pathCapacities.length; i++) {
            if (pathCapacities[i] < pathFlow) {
                pathFlow = pathCapacities[i];
            }
        }
        return pathFlow;
    }

    checkNewCapacities(networkConfig, srcAdjacencyList, newAdjacencyList, pathNodes, pathFlow) {
        let i = 0;
        let newCapacity = 0;
        while (pathNodes[i] !== networkConfig.sink) {
            if (srcAdjacencyList[pathNodes[i]].get(pathNodes[i + 1]) - newAdjacencyList[pathNodes[i]].get(pathNodes[i + 1]) !== pathFlow) {
                throw ApiError.BadRequest('Введены неправильные пропускные способности!');
            }
            else {
                newCapacity = srcAdjacencyList[pathNodes[i]].get(pathNodes[i + 1]) - pathFlow;
                srcAdjacencyList[pathNodes[i]].set(pathNodes[i + 1], newCapacity);
            }
            if (newAdjacencyList[pathNodes[i + 1]].get(pathNodes[i]) - srcAdjacencyList[pathNodes[i + 1]].get(pathNodes[i]) !== pathFlow) {
                throw ApiError.BadRequest('Введены неправильные пропускные способности!');
            }
            else {
                newCapacity = srcAdjacencyList[pathNodes[i + 1]].get(pathNodes[i]) + pathFlow;
                srcAdjacencyList[pathNodes[i + 1]].set(pathNodes[i], newCapacity);
            }
            i++;
        }
    }

    getResidualNetwork(networkConfig, nodesList, adjacencyList) {
        const nodes = nodesList.map((node) => {
            let processedNode = {
                data: node.data,
                position: node.position
            };
            if (processedNode.data.id == networkConfig.source || processedNode.data.id == networkConfig.sink) {
                processedNode.classes = 'colored';
            }
            return processedNode;
        });
        let edges = [];
        for (let j = 0; j < adjacencyList.length; j++) {
            for (let edge of adjacencyList[j].entries()) {
                if (edge[1] !== 0) {
                    edges.push({
                        data: {
                            source: j,
                            target: edge[0],
                            capacity: edge[1],
                            label: String(edge[1])
                        }
                    });
                }
            }
        }
        return nodes.concat(edges);
    }

    getNetworkWithNewCapacities(nodesList, edgesList) {
        const nodes = nodesList.map((node) => {
            return {
                data: node.data,
                position: node.position,
                selected: node.selected
            };
        });
        const edges = edgesList.map((edge) => {
            edge.data.capacity = (edge.data?.newCapacity || edge.data?.newCapacity === 0 ? edge.data.newCapacity : edge.data.capacity);
            edge.data.label = (edge.data?.newCapacity || edge.data?.newCapacity === 0 ? String(edge.data.newCapacity) : String(edge.data.capacity));
            return edge;

        });
        return nodes.concat(edges);
    }

    getUpdatedFlowNetwork(networkConfig, nodesList, edgesList, pathNodes, pathFow) {
        const nodes = nodesList.map((node) => {
            let processedNode = {
                data: {
                    id: node.data.id,
                    label: String(node.data.label)
                },
                position: node.position
            };
            if (processedNode.data.id == networkConfig.source || processedNode.data.id == networkConfig.sink) {
                processedNode.classes = 'colored';
            }
            return processedNode;
        });
        let edges = edgesList.map((edge) => {
            let newEdge;
            if (pathNodes.indexOf(+edge.data.source) !== -1 && pathNodes.indexOf(+edge.data.target) !== -1 && pathNodes.indexOf(+edge.data.target) - pathNodes.indexOf(+edge.data.source) === 1) {
                newEdge = {
                    data: {
                        source: edge.data.source,
                        target: edge.data.target,
                        capacity: edge.data.capacity,
                        flow: edge.data.flow + pathFow,
                    }
                };
            }
            else {
                newEdge = {
                    data: {
                        source: edge.data.source,
                        target: edge.data.target,
                        capacity: edge.data.capacity,
                        flow: edge.data.flow,
                    }
                };
            }
            newEdge.data.label = String(newEdge.data.flow) + '/' + String(newEdge.data.capacity);
            return newEdge;
        });
        return nodes.concat(edges);
    }

    checkCurrentFlow(prevFlow, pathFlow, currentFlow) {
        if (prevFlow + pathFlow !== currentFlow) {
            throw ApiError.BadRequest('Введена неправильная величина!');
        }
    }

    dfs(graph, visited, now, proccessedNodes) {
        visited[now] = true;
        for (let neig of graph[now].keys()) {
            if (!visited[neig]) {
                proccessedNodes.add(neig);
                this.dfs(graph, visited, neig, proccessedNodes);
            }
        }
    }

    checkIsTherePath(networkConfig, adjacencyList) {
        let visited = null;
        let processedNodes = new Set();
        if (networkConfig.startsFromZero) {
            visited = new Array(networkConfig.countOfNodes).fill(false);
        }
        else {
            visited = new Array(networkConfig.countOfNodes + 1).fill(false);
        }
        processedNodes.add(networkConfig.source);
        this.dfs(adjacencyList, visited, networkConfig.source, processedNodes);
        if (visited[networkConfig.sink]) {
            throw ApiError.BadRequest('Путь существует. Подумайте ещё раз!');
        }
    }

    checkNodesOfMinCut(networkConfig, nodesList, adjacencyList) {
        const selectedNodes = (nodesList.filter(node => node.selected)).map((node) => {
            return Number(node.data.id);
        });
        if (selectedNodes.length === 0) {
            throw ApiError.BadRequest('Не выбрана ни одна вершина!');
        }
        let visited = null;
        let processedNodes = new Set();
        if (networkConfig.startsFromZero) {
            visited = new Array(networkConfig.countOfNodes).fill(false);
        }
        else {
            visited = new Array(networkConfig.countOfNodes + 1).fill(false);
        }
        processedNodes.add(networkConfig.source);
        this.dfs(adjacencyList, visited, networkConfig.source, processedNodes);
        processedNodes = Array.from(processedNodes);
        const diff = selectedNodes.filter(node => !processedNodes.includes(node));
        if (diff.length !== 0 || processedNodes.length !== selectedNodes.length) {
            throw ApiError.BadRequest('Вершины выбраны неверно!');
        }
        return selectedNodes;
    }

    checkEdgesOfMinCut(networkConfig, adjacencyList, selectedNodes, edges) {
        if (edges.length === 0) {
            throw ApiError.BadRequest('Не выбрана ни одна дуга!');
        }
        const minCut = [];
        for (let source = 0; source < networkConfig.countOfNodes; source++) {
            if (selectedNodes.includes(source)) {
                for (let target of adjacencyList[source].keys()) {
                    if (!selectedNodes.includes(target)) {
                        minCut.push({
                            source,
                            target
                        });
                    }
                }
            }
        }
        if (minCut.length !== edges.length || !(minCut.every((edgeOfMinCut) => edges.some(edge => edgeOfMinCut.source === edge.source && edgeOfMinCut.target === edge.target)))) {
            throw ApiError.BadRequest('Выбранные дуги не образуют минимальный разрез!');
        }
    }

    calculatePoints(evaluationCriteria, mistakes) {
        const stageNamesMap = new Map([
            ["path", "max_count_of_path_mistakes"],
            ["newCapacities", "max_count_of_new_capacities_mistakes"],
            ["currentFlow", "max_count_of_current_flow_mistakes"],
            ["minCut", "max_count_of_min_cut_mistakes"]
        ]);
        let isPossiblePointsFounded = true;
        let resultPoints = 0;
        for (let criteria of evaluationCriteria) {
            for (let stageName of Object.keys(mistakes)) {
                if (criteria[stageNamesMap.get(stageName)] < mistakes[stageName]) {
                    isPossiblePointsFounded = false;
                    break;
                }
            }
            if (isPossiblePointsFounded) {
                resultPoints = criteria.points;
                break;
            }
            isPossiblePointsFounded = true;
        }
        let countOfMistakes = Object.values(mistakes).reduce((partialSum, a) => partialSum + a, 0);
        return { countOfMistakes, resultPoints };
    }

    convertProblem(problems) {
        const processedProblems = problems.map((problem) => {
            let processedGraph = this.convertGraph(problem.graph, false);
            return { ...problem, graph: processedGraph };
        });
        return processedProblems;
    }
}

module.exports = new ProblemSolvingUtil();