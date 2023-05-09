import React, { useContext, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { checkNodes } from "../../lib/validationUtil";
import { getNodeLabel } from "../../lib/content";
import { when } from "mobx";

const EdgesChoicePanel = ({ setIsProblemSolved }) => {
    const { store, modalWinStore, problemSolvingStore } = useContext(Context);
    const sourceNodeInput = useRef();
    const targetNodeInput = useRef();
    const [edgesList, setEdgesList] = useState([]);

    const renderTooltip = (props) => (
        <Tooltip {...props}>
            Введите дуги, у которых начало помечено, а конец – нет, то есть те, которые образуют минимальный разрез
        </Tooltip>
    );

    const addEdge = () => {
        const validResult = checkNodes(problemSolvingStore.networkConfig, edgesList, sourceNodeInput.current.value, targetNodeInput.current.value);
        if (validResult.res) {
            setEdgesList([...edgesList, { source: Number(sourceNodeInput.current.value), target: Number(targetNodeInput.current.value) }]);
        }
        else {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody(validResult.message);
        }
        sourceNodeInput.current.value = '';
        targetNodeInput.current.value = '';
    };

    const removeEdge = (selectedEdge) => {
        setEdgesList(edgesList.filter(edge => edge.source !== selectedEdge.source || edge.target !== selectedEdge.target));
    };

    const checkEdgesOfMinCut = async () => {
        try {
            await problemSolvingStore.checkEdgesOfMinCut(edgesList);
            setIsProblemSolved(true);
            when(() => problemSolvingStore.time && problemSolvingStore.resultPoints,
                () => {
                    let resultArray = [
                        { parametr: "Количество заработанных баллов", value: problemSolvingStore.resultPoints },
                        { parametr: "Время, затраченное на решение", value: problemSolvingStore.time },
                        { parametr: "Количество допущенных ошибок", value: problemSolvingStore.countOfMistakes }
                    ];
                    if (problemSolvingStore.countOfMistakes) {
                        resultArray.push(
                            { parametr: "- при выборе пути", value: problemSolvingStore.mistakes["path"] },
                            { parametr: "- при вводе новых пропускных способностей", value: problemSolvingStore.mistakes["newCapacities"] },
                            { parametr: "- при вводе величины текущего потока", value: problemSolvingStore.mistakes["currentFlow"] },
                            { parametr: "- при нахождении минимального разреза", value: problemSolvingStore.mistakes["minCut"] });
                    }
                    modalWinStore.setIsResultType(true);
                    modalWinStore.setTitle('Поздравляем с решением задачи!');
                    modalWinStore.setResultArray(resultArray);
                });
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
                let minCutMistakes = problemSolvingStore.mistakes["minCut"];
                problemSolvingStore.setMistakes({ ...problemSolvingStore.mistakes, minCut: minCutMistakes + 1 });
                modalWinStore.setIsErrorType(true);
                modalWinStore.setTitle('Ошибка');
                modalWinStore.setBody(e?.message);
            }
        }
    };

    return (
        <div className='d-flex flex-column justify-content-center'>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <p className='main-font-bold fs-5 mb-0'>Введите дуги минимального разреза:</p>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                >
                    <i className='bi bi-question-octagon me-2 fs-5'></i>
                </OverlayTrigger>
            </div>
            <div id='edges-choice-panel' className='d-flex justify-content-start align-items-center color-1 rounded-4 main-border mb-2 p-3'>
                <div className='d-flex justify-content-center align-items-center w-50 '>
                    <p className='mb-0 sub-font-reg fs-2 me-1'>(</p>
                    <input disabled={!problemSolvingStore.areNodesChosen} type='number' className='edge-input main-border rounded-4 sub-font-reg text-center fs-5'
                        min={problemSolvingStore.networkConfig.startsFromZero ? 0 : 1} ref={sourceNodeInput}></input>
                    <p className='mb-0 sub-font-reg fs-2 ms-1 fs-3 me-1'>;</p>
                    <input disabled={!problemSolvingStore.areNodesChosen} type='number' className='edge-input main-border rounded-4 sub-font-reg text-center fs-5'
                        min={problemSolvingStore.networkConfig.startsFromZero ? 0 : 1} ref={targetNodeInput}></input>
                    <p className='mb-0 sub-font-reg ms-1 fs-2 me-1'>)</p>
                    <button className='problem-button main-border rounded-4 sub-font-reg bg-white ps-4 pe-4'
                        onClick={addEdge} disabled={!problemSolvingStore.areNodesChosen}><i className="bi bi-plus-lg"></i></button>
                </div>
                <div className='d-flex justify-content-start flex-wrap p-1 w-50 mh-100 overflow-auto'>
                    {edgesList.map((edge, index) =>
                        <div key={index} className='main-border sub-font-reg fs-5 rounded-4 me-2 mb-2 ps-3 pe-3 pt-1 pb-1'>
                            ({getNodeLabel(problemSolvingStore.networkConfig, edge.source)};{getNodeLabel(problemSolvingStore.networkConfig, edge.target)})
                            <i className='bi bi-trash' onClick={() => removeEdge(edge)}></i>
                        </div>
                    )}
                </div>
            </div>
            <div className='d-flex justify-content-end align-items-center'>
                <button disabled={!problemSolvingStore.areNodesChosen} className='problem-button main-border rounded-4 ps-5 pe-5 pt-3 pb-3 sub-font-reg bg-white'
                    onClick={checkEdgesOfMinCut}>Проверить и завершить</button>
            </div>
        </div>
    );
};

export default observer(EdgesChoicePanel);