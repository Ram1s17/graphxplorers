class FordFulkersonSolverUtil {
    bfs(graph, source, sink, parent) {
        const visited = new Array(graph.length).fill(false);
        const queue = [source];
        visited[source] = true;
        parent[source] = -1;
        while (queue.length > 0) {
            const currNode = queue.shift();
            for (const [nextNode, capacity] of graph[currNode].entries()) {
                if (!visited[nextNode] && capacity > 0) {
                    visited[nextNode] = true;
                    parent[nextNode] = currNode;
                    queue.push(nextNode);
                    if (nextNode === sink) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    fordFulkerson(adjList, networkConfig, subtype, selectedStep) {
        const source = networkConfig.source, sink = networkConfig.sink;
        const residualGraph = adjList.map((node) => new Map(node));
        let step = 1;
        let pathNodes = [];
        let returnedValue = {
            sourceGraph: adjList 
        };
        const parent = new Array(adjList.length).fill(-1);
        while (this.bfs(residualGraph, source, sink, parent)) {
            if (subtype === 'path' && selectedStep === step) {
                returnedValue["residualGraph"] = residualGraph;
                return returnedValue;
            }
            if (subtype === 'capacities' && selectedStep === step) {
                returnedValue["sourceGraph"] = residualGraph;
            }
            pathNodes.push(sink);
            let pathFlow = Number.MAX_VALUE;
            for (let node = sink; node !== source; node = parent[node]) {
                const prevNode = parent[node];
                pathNodes.push(prevNode);
                pathFlow = Math.min(pathFlow, residualGraph[prevNode].get(node));
            }
            if (subtype === 'capacities' && selectedStep === step) {
                returnedValue["pathNodes"] = pathNodes.reverse();
                returnedValue["pathFlow"] = pathFlow;
                return returnedValue;
            }
            for (let node = sink; node !== source; node = parent[node]) {
                const prevNode = parent[node];
                residualGraph[prevNode].set(node, residualGraph[prevNode].get(node) - pathFlow);
                if (residualGraph[prevNode].get(node) === 0) {
                    residualGraph[prevNode].delete(node);
                }
                if (!residualGraph[node].has(prevNode)) {
                    residualGraph[node].set(prevNode, 0);
                }
                residualGraph[node].set(prevNode, residualGraph[node].get(prevNode) + pathFlow);
            }
            step += 1;
            pathNodes = [];
        }
        if (subtype === 'path' && selectedStep === step || subtype === 'mincut') {
            returnedValue["residualGraph"] = residualGraph;
            return returnedValue;
        }
        return step;
    }
}

module.exports = new FordFulkersonSolverUtil();