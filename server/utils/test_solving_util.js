const problemSolvingUtil = require('./problem_solving_util');

class TestSolvingUtil {
    shuffleQuestions(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    calculateTotalPoints(questions) {
        const points = questions.map((question) => {
            return question.question_points;
        });
        return points.reduce((partialSum, a) => partialSum + a, 0);
    }

    processTheoreticalQuestions(questions) {
        questions = questions.map((question) => {
            if (question.question_type === 'теоретический') {
                question.question_content.options.map((option) => {
                    option.userSelect = false;
                    return option;
                });
            }
            else {
                question.question_content.viewGraph = question.question_content.viewGraph.nodes.concat(question.question_content.viewGraph.edges);
                question.question_content.interactionGraph = question.question_content.interactionGraph.nodes.concat(question.question_content.interactionGraph.edges);
            }
            return question;
        });
        return questions;
    }

    checkAnswerForTheoreticalQuestion(answerOptions) {
        for (let answer of answerOptions) {
            if (answer.userSelect !== answer.isTrue) {
                return false;
            }
        }
        return true;
    }

    checkAnswerForPathQuestion(isTherePath, networkConfig, network) {
        if (isTherePath) {
            try {
                problemSolvingUtil.getOnlySelectedModesAndEdges(network);
                const { pathAdjacencyList, processedNodes } = problemSolvingUtil.checkNodesAndEdges(networkConfig, network.nodes, network.edges);
                problemSolvingUtil.getPath(networkConfig, pathAdjacencyList, processedNodes);
            }
            catch (e) {
                if (e.status === 400) {
                    return false;
                }
            }
        }
        else {
            try {
                const adjacencyList = problemSolvingUtil.getAdjacencyList(networkConfig, network.edges, false);
                problemSolvingUtil.checkIsTherePath(networkConfig, adjacencyList);
            }
            catch (e) {
                if (e.status === 400) {
                    return false;
                }
            }
        }
        return true;
    }

    checkAnswerForCapacitiesQuestion(networkConfig, network, pathNodes, pathFlow) {
        try {
            const srcAdjacencyList = problemSolvingUtil.getAdjacencyList(networkConfig, network.edges, false);
            const newAdjacencyList = problemSolvingUtil.getAdjacencyList(networkConfig, network.edges, true);
            problemSolvingUtil.checkNewCapacities(networkConfig, srcAdjacencyList, newAdjacencyList, pathNodes, pathFlow);
        }
        catch (e) {
            if (e.status === 400) {
                return false;
            }
        }
        return true;
    }

    getProcessedNodesForMinCut(networkConfig, adjacencyList) {
        let visited = null;
        let processedNodes = new Set();
        if (networkConfig.startsFromZero) {
            visited = new Array(networkConfig.countOfNodes).fill(false);
        }
        else {
            visited = new Array(networkConfig.countOfNodes + 1).fill(false);
        }
        processedNodes.add(networkConfig.source);
        problemSolvingUtil.dfs(adjacencyList, visited, networkConfig.source, processedNodes);
        processedNodes = Array.from(processedNodes);
        return processedNodes;
    }

    checkAnswerForMinCutQuestion(networkConfig, residualNetwork, sourceNetwork) {
        try {
            const residualAdjacencyList = problemSolvingUtil.getAdjacencyList(networkConfig, residualNetwork.edges, false);
            const processedNodes = this.getProcessedNodesForMinCut(networkConfig, residualAdjacencyList);
            const srcAdjacencyList = problemSolvingUtil.getAdjacencyList(networkConfig, sourceNetwork.edges, false);
            const selectedEdges = [];
            sourceNetwork.edges.map((edge) => {
                if (edge.selected) {
                    selectedEdges.push({
                        source: Number(edge.data.source),
                        target: Number(edge.data.target)
                    });
                }
                return edge;
            });
            problemSolvingUtil.checkEdgesOfMinCut(networkConfig, srcAdjacencyList, processedNodes, selectedEdges);
        }
        catch (e) {
            if (e.status === 400) {
                return false;
            }
        }
        return true;
    }

    getTypeOfTest(type) {
        let name = '';
        switch (type) {
            case 'theoretical':
                name = "теоретический";
                break;
            case 'interactive':
                name = "интерактивный";
                break;
            case 'mix':
                name = "общий";
                break;
            default:
                name = '';
        }
        return name;
    }
}

module.exports = new TestSolvingUtil();