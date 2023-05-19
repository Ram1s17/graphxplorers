export const checkCapacityAndFlow = (val) => {
    if (val === '' || val.includes('e') || val.includes('E') || val.includes('.') || val.includes(',') || val.includes('-') || Number(val) < 0) {
        return false;
    }
    return true;
};

const checkNode = (networkConfig, node) => {
    if (node === '' || node.includes('e') || node.includes('E') || node.includes('.') || node.includes(',') || node.includes('-') ) {
        return {
            bool: false,
            message: 'Введено некорректное значение вершины!'
        };
    }
    if (networkConfig.startsFromZero && (Number(node) < 0 || Number(node) > (networkConfig.countOfNodes - 1))) {
        return {
            bool: false,
            message: 'В исходном графе отсутвует такая вершина!'
        };
    }
    if (!networkConfig.startsFromZero && (Number(node) < 1 || Number(node) > networkConfig.countOfNodes)) {
        return {
            bool: false,
            message: 'В исходном графе отсутвует такая вершина!'
        };
    }
    return {
        bool: true
    };
};

export const checkNodes = (networkConfig, edgesList, sourceNode, targetNode) => {
    const resSrc = checkNode(networkConfig, sourceNode);
    const resTrgt = checkNode(networkConfig, targetNode);
    if (!resSrc.bool) {
        return {
            res: false,
            message: resSrc.message
        };
    }
    if (!resTrgt.bool) {
        return {
            res: false,
            message: resTrgt.message
        };
    }
    if (sourceNode == targetNode) {
        return {
            res: false,
            message: 'Начало и конец дуги совпадают'
        };
    }
    const resEdge = checkIsThereEdgeInArr(edgesList, sourceNode, targetNode);
    if (!resEdge.bool) {
        return {
            res: false,
            message: resEdge.message
        };
    }
    return {
        res: true
    };
};

const checkIsThereEdgeInArr = (edgesList, sourceNode, targetNode) => {
    const matches = edgesList.filter(edge => edge.source === Number(sourceNode) && edge.target === Number(targetNode));
    if (matches.length > 0) {
        return {
            bool: false,
            message: 'Такая дуга уже была добавлена!'
        };
    }
    return {
        bool: true
    };
};

export const checkDeletedNode = (networkConfig, node) => {
    if (networkConfig.startsFromZero && node == networkConfig.countOfNodes - 1) {
        return true;
    }
    else if (!networkConfig.startsFromZero && node == networkConfig.countOfNodes) {
        return true;
    }
    return false;
};

export const checkNumberValue = (val) => {
    if (val === '' || val.includes('e') || val.includes('E') || val.includes('.') || val.includes(',') || val.includes('-') || Number(val) < 0 || Number(val) > 15) {
        return false;
    }
    return true;
};