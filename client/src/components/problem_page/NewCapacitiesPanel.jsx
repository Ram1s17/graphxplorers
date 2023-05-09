import React, { useEffect, useRef, useContext, useMemo } from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import CytoscapeComponent from 'react-cytoscapejs';
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { checkCapacityAndFlow } from "../../lib/validationUtil";
import { getNodeLabel } from "../../lib/content";

const NewCapacitiesPanel = () => {
    let cyRef = useRef();
    const { store, modalWinStore, problemSolvingStore } = useContext(Context);
    const sourceNodeSelect = useRef();
    const targetNodeSelect = useRef();
    const newCapacityInput = useRef();

    useEffect(() => {
        problemSolvingStore.setAreCapacitiesUpdated(false);
    }, []);

    useEffect(() => {
        cyRef.center();
        cyRef.elements().remove();
        cyRef.add(problemSolvingStore.newCapacitiesNetwork);
    }, [problemSolvingStore.newCapacitiesNetwork]);

    const renderTooltip = (props) => (
        <Tooltip {...props}>
            Обновите значения пропускных способностей дуг на выбранном пути
        </Tooltip>
    );

    const sourceNodesList = useMemo(() => {
        return Array.from(problemSolvingStore.pathNodes);
    }, [problemSolvingStore.pathNodes]);

    const targetNodesList = useMemo(() => {
        return Array.from(problemSolvingStore.pathNodes);
    }, [problemSolvingStore.pathNodes]);

    const updateCapacity = () => {
        const newCapacity = newCapacityInput.current.value;
        if (!checkCapacityAndFlow(newCapacity)) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('Введено некорректное значение пропускной способности!');
        }
        else {
            const sourceNodeValue = Number(sourceNodeSelect.current.value);
            const targetNodeValue = Number(targetNodeSelect.current.value);
            if (sourceNodeValue === targetNodeValue) {
                modalWinStore.setIsErrorType(true);
                modalWinStore.setTitle('Ошибка');
                modalWinStore.setBody('Начало и конец дуги совпадают!');
            }
            else if (targetNodesList.indexOf(targetNodeValue) - sourceNodesList.indexOf(sourceNodeValue) !== 1 &&
                sourceNodesList.indexOf(sourceNodeValue) - targetNodesList.indexOf(targetNodeValue) !== 1) {
                modalWinStore.setIsErrorType(true);
                modalWinStore.setTitle('Ошибка');
                modalWinStore.setBody('Выбрана дуга, не входящая в исходный путь!');
            }
            else {
                let sourceNode = 0, targetNode = 0;
                const edges = cyRef.json().elements.edges.map((el) => {
                    sourceNode = +el.data.source;
                    targetNode = +el.data.target;
                    if (sourceNode === sourceNodeValue && targetNode === targetNodeValue) {
                        el.data.newCapacity = Number(newCapacityInput.current.value)
                        el.data.label = Number(newCapacityInput.current.value);
                    }
                    return el;
                });
                problemSolvingStore.setNewCapacitiesNetwork((cyRef.json().elements.nodes).concat(edges));
            }
        }
        newCapacityInput.current.value = '';
    };

    const switchNodes = () => {
        const sourceNode = sourceNodeSelect.current.value;
        const targetNode = targetNodeSelect.current.value;
        sourceNodeSelect.current.value = targetNode;
        targetNodeSelect.current.value = sourceNode;
    };

    const checkCapacities = async () => {
        try {
            await problemSolvingStore.checkCapacitiesAndUpdateFlow(cyRef.json().elements);
            modalWinStore.setIsSuccessType(true);
            modalWinStore.setTitle('Правильно');
            modalWinStore.setBody('Новые пропускные способности введены верно. Вы молодец!');
        }
        catch (e) {
            if (e?.status === 401) {
                await store.logout();
                store.setError({ bool: true, message: e?.message });
            }
            else if (e?.status === 500 || e?.status === 503) {
                store.setError({ bool: true, message: e?.message });
            }
            else if (e?.status === 400) {
                let newCapacitiesMistakes = problemSolvingStore.mistakes["newCapacities"];
                problemSolvingStore.setMistakes({...problemSolvingStore.mistakes, newCapacities: newCapacitiesMistakes + 1});
                modalWinStore.setIsErrorType(true);
                modalWinStore.setTitle('Ошибка');
                modalWinStore.setBody(e?.message);
            }
        }
    };

    return (
        <div className='d-flex flex-column justify-content-center mb-2'>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <p className='main-font-bold fs-5 mb-0'>Введите новые пропускные способности:</p>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                >
                    <i className='bi bi-question-octagon me-2 fs-5'></i>
                </OverlayTrigger>
            </div>
            <div id='new-capacities-panel' className='color-2 rounded-4 main-border mb-2'
                onMouseOver={() => cyRef.center()}>
                <CytoscapeComponent
                    elements={problemSolvingStore.newCapacitiesNetwork}
                    zoom={1}
                    userPanningEnabled={false}
                    userZoomingEnabled={false}
                    autolock={true}
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
                            selector: ':selected',
                            style: {
                                'background-color': '#FF7878',
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
                    cy={(cy) => { cyRef = cy }} />
            </div>
            <div className='d-flex justify-content-between align-items-center'>
                <div className='d-flex justify-content-start align-items-center color-2 p-1 rounded-4 main-border'>
                    <p className='mb-0 sub-font-reg fs-3 me-1'>c</p>
                    <p className='mb-0 sub-font-reg fs-3 me-1'>(</p>
                    <Form.Select className='rounded-4' ref={sourceNodeSelect} disabled={problemSolvingStore.areCapacitiesUpdated}>
                        {sourceNodesList.map((node) =>
                            <option key={node} className='text-center' value={node}>{getNodeLabel(problemSolvingStore.networkConfig, node)}</option>
                        )}
                    </Form.Select>
                    <p className='mb-0 sub-font-reg fs-5 ms-1 fs-3 me-1'>;</p>
                    <Form.Select className='rounded-4' ref={targetNodeSelect} disabled={problemSolvingStore.areCapacitiesUpdated}>
                        {targetNodesList.map((node) =>
                            <option key={node} className='text-center' value={node}>{getNodeLabel(problemSolvingStore.networkConfig, node)}</option>
                        )}
                    </Form.Select>
                    <p className='mb-0 sub-font-reg ms-1 fs-3 me-1'>)</p>
                    <p className='mb-0 sub-font-reg fs-3 me-1'>=</p>
                    <Form.Control as="input" type="number" min={0} className='rounded-4 sub-font-reg text-center me-1'
                        autoComplete='off' ref={newCapacityInput} disabled={problemSolvingStore.areCapacitiesUpdated} />
                    <div>
                        <button className='problem-button main-border rounded-4 sub-font-reg bg-white ps-3 pe-3 w-100 mb-1'
                            onClick={updateCapacity} disabled={problemSolvingStore.areCapacitiesUpdated}><i className="bi bi-plus-lg"></i></button>
                        <button className='problem-button main-border rounded-4 sub-font-reg bg-white ps-3 pe-3 w-100'
                            onClick={switchNodes} disabled={problemSolvingStore.areCapacitiesUpdated}><i className="bi bi-arrow-left-right"></i></button>
                    </div>
                </div>
                <button className='problem-button main-border rounded-4 ps-5 pe-5 pt-3 pb-3 sub-font-reg bg-white ms-3'
                    onClick={checkCapacities} disabled={problemSolvingStore.areCapacitiesUpdated}>Проверить и обновить поток</button>
            </div>
        </div >
    );
};

export default observer(NewCapacitiesPanel);