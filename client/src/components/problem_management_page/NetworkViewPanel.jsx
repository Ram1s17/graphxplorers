import React, { useRef, useEffect, useContext } from "react";
import { Col } from "react-bootstrap";
import CytoscapeComponent from 'react-cytoscapejs';
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { getNodeLabel } from "../../lib/content";
import { checkDeletedNode } from "../../lib/validationUtil";
import { useParams } from "react-router-dom";

const NetworkViewPanel = () => {
    let cyRef = useRef(null);
    const { modalWinStore, problemManagementStore } = useContext(Context);
    const { id } = useParams();

    useEffect(() => {
        cyRef.current.on('dbltap', function (evt) {
            if (evt.target === cyRef.current) {
                if (problemManagementStore.networkConfig.countOfNodes >= 12) {
                    modalWinStore.setIsErrorType(true);
                    modalWinStore.setTitle('Ошибка');
                    modalWinStore.setBody('Количество вершин не должно превышать 12!');
                }
                else {
                    const x = evt.position.x;
                    const y = evt.position.y;
                    const id = problemManagementStore.networkConfig.startsFromZero ? problemManagementStore.networkConfig.countOfNodes : problemManagementStore.networkConfig.countOfNodes + 1;
                    cyRef.current.add(
                        {
                            data: {
                                id,
                                label: getNodeLabel(problemManagementStore.networkConfig, id)
                            },
                            position: { x, y }
                        }
                    );
                    problemManagementStore.setNodesList(cyRef.current.json().elements.nodes);
                    problemManagementStore.setNetworkConfig({ ...problemManagementStore.networkConfig, countOfNodes: problemManagementStore.networkConfig.countOfNodes + 1 });
                }
            }
        });

        cyRef.current.on('tap', 'node', (event) => {
            if (problemManagementStore.networkConfig.countOfNodes <= 4) {
                modalWinStore.setIsErrorType(true);
                modalWinStore.setTitle('Ошибка');
                modalWinStore.setBody('Количество вершин не должно быть меньше 4!');
            }
            else {
                const node = event.target;
                if (!checkDeletedNode(problemManagementStore.networkConfig, node.id())) {
                    modalWinStore.setIsErrorType(true);
                    modalWinStore.setTitle('Ошибка');
                    modalWinStore.setBody('Доступно удаление только последней по порядку вершины!');
                }
                else {
                    if (problemManagementStore.networkConfig.source == +node.id() || problemManagementStore.networkConfig.sink == +node.id()) {
                        modalWinStore.setIsErrorType(true);
                        modalWinStore.setTitle('Ошибка');
                        modalWinStore.setBody('Поменяйте исток/сток перед удалением вершины!');
                    }
                    else {
                        cyRef.current.remove(node);
                        problemManagementStore.setNodesList(cyRef.current.json().elements.nodes);
                        if (cyRef.current.json()?.elements?.edges) {
                            problemManagementStore.setEdgesList(cyRef.current.json().elements.edges);
                        }
                        else {
                            problemManagementStore.setEdgesList([]);
                        }
                        problemManagementStore.setNetworkConfig({ ...problemManagementStore.networkConfig, countOfNodes: problemManagementStore.networkConfig.countOfNodes - 1 });
                    }
                }
            }
        });

        cyRef.current.on('tap', 'edge', (event) => {
            const edge = event.target;
            cyRef.current.remove(edge);
            if (cyRef.current.json()?.elements?.edges) {
                problemManagementStore.setEdgesList(cyRef.current.json().elements.edges);
            }
            else {
                problemManagementStore.setEdgesList([]);
            }
        });
    }, []);

    useEffect(() => {
        cyRef.current.center();
        cyRef.current.elements().remove();
        cyRef.current.add([...problemManagementStore.nodesList, ...problemManagementStore.edgesList]);
    }, [problemManagementStore.nodesList, problemManagementStore.edgesList]);

    useEffect(() => {
        if (problemManagementStore.nodesList.length) {
            const sourceNodes = cyRef.current.json()?.elements?.nodes;
            const sourceEdges = cyRef.current.json()?.elements?.edges;
            cyRef.current.elements().remove();
            cyRef.current.add(new Array(problemManagementStore.networkConfig.countOfNodes).fill().map((node, index) => {
                if (problemManagementStore.networkConfig.startsFromZero) {
                    return {
                        data: {
                            id: index,
                            label: problemManagementStore.networkConfig.letter + index,
                        },
                        position: sourceNodes[index].position
                    };
                }
                else {
                    return {
                        data: {
                            id: index + 1,
                            label: problemManagementStore.networkConfig.letter + (index + 1)
                        },
                        position: sourceNodes[index].position
                    };
                }
            }));
            if (problemManagementStore.networkConfig.startsFromZero === problemManagementStore.sourceStartsFromZero) {
                if (sourceEdges) {
                    cyRef.current.add(sourceEdges);
                    problemManagementStore.setEdgesList(cyRef.current.json().elements.edges);
                }
                else {
                    problemManagementStore.setEdgesList([]);
                }
            }
            else {
                problemManagementStore.setEdgesList([]);
                problemManagementStore.setSourceStartsFromZero(problemManagementStore.networkConfig.startsFromZero);
            }
            problemManagementStore.setNodesList(cyRef.current.json().elements.nodes);
        }
    }, [problemManagementStore.networkConfig.isDigitLabelsOnly,
    problemManagementStore.networkConfig.startsFromZero,
    problemManagementStore.networkConfig.letter]);

    const showNetwork = () => {
        modalWinStore.setGraphElements(problemManagementStore.sourceNetwork);
        modalWinStore.setIsGraphType(true);
    };

    return (
        <Col id="network-view-panel" className='d-flex flex-column justify-content-center align-items-center'
            onMouseOver={() => cyRef.current.center()}
        >
            {id != 'new' && <p className='text-black fs-6 mb-0' >Посмотреть исходное состояние транспортной сети: <i onClick={showNetwork} className="bi bi-eye-fill"></i></p>}
            <CytoscapeComponent
                elements={[]}
                zoom={1}
                userPanningEnabled={false}
                userZoomingEnabled={false}
                autolock={false}
                autounselectify={true}
                style={{ width: '95%', height: '95%' }}
                stylesheet={[
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
                    }
                ]}
                cy={(cy) => { cyRef.current = cy }} />
        </Col>
    );
};

export default observer(NetworkViewPanel);