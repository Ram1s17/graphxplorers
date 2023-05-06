import React, { useState, useEffect, useRef, useContext } from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import CytoscapeComponent from 'react-cytoscapejs';
import { Context } from "../..";
import { observer } from "mobx-react-lite";

const PathChoice = () => {
    let cyRef = useRef();
    let [isTherePath, setIsTherePath] = useState(true);
    const { store, modalWinStore, problemSolvingStore } = useContext(Context);

    useEffect(() => {
        cyRef.center();
    }, [problemSolvingStore.residualNetwork]);

    const renderTooltip = (props) => (
        <Tooltip {...props}>
            Зажмите Ctrl, чтобы выбрать несколько вершин и дуг или снять выделение c них
        </Tooltip>
    );

    const checkPath = async () => {
        try {
            let message = '';
            if (isTherePath) {
                await problemSolvingStore.checkPath(cyRef.json().elements);
                message = 'Путь выбран правильно. Продолжайте в том же духе!';
            }
            else {
                await problemSolvingStore.checkIsTherePath(cyRef.json().elements);
                message = `Величина максимального потока равна ${problemSolvingStore.currentFlow}. Переходите к поиску минимального разреза!`;
            }
            modalWinStore.setIsSuccessType(true);
            modalWinStore.setTitle('Правильно');
            modalWinStore.setBody(message);
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
                let pathMistakes = problemSolvingStore.mistakes["path"];
                problemSolvingStore.setMistakes({...problemSolvingStore.mistakes, path: pathMistakes + 1});
                modalWinStore.setIsErrorType(true);
                modalWinStore.setTitle('Ошибка');
                modalWinStore.setBody(e?.message);
            }
        }
    };

    return (
        <div className='d-flex flex-column justify-content-center mb-4'>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <p className='main-font-bold fs-5 mb-0'>Выберите путь:</p>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                >
                    <i className='bi bi-question-octagon me-2 fs-5'></i>
                </OverlayTrigger>
            </div>
            <div id='path-choice-panel' className='color-2 rounded-4 main-border mb-2'
                onMouseOver={() => cyRef.center()}>
                <CytoscapeComponent
                    elements={problemSolvingStore.residualNetwork}
                    zoom={1}
                    userPanningEnabled={false}
                    userZoomingEnabled={false}
                    autolock={true}
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
                        },
                        {
                            selector: ':selected',
                            style: {
                                'line-color': '#FF7878',
                                'target-arrow-color': '#FF7878',
                            }
                        }
                    ]}
                    cy={(cy) => { cyRef = cy }} />
            </div>
            <div className='d-flex justify-content-end align-items-center'>
                <Form.Check
                    type='checkbox'
                    id='no-path-check'
                    className='me-4'
                    label='Пути не существует'
                    onChange={() => setIsTherePath(!isTherePath)}
                />
                <button className='problem-button main-border rounded-4 ps-5 pe-5 pt-3 pb-3 sub-font-reg bg-white'
                    onClick={checkPath}>Проверить</button>
            </div>
        </div >
    );
};

export default observer(PathChoice);