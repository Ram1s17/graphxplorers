import React, { useContext, useRef } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { checkCapacityAndFlow } from "../../lib/validationUtil";

const StepFlowPanel = () => {
    const { store, modalWinStore, problemSolvingStore } = useContext(Context);
    const currentFlowInput = useRef();
    
    const renderTooltip = (props) => (
        <Tooltip {...props}>
            Обновите величину текущего потока в транспортной сети, которая получается путём суммирования прежней величины с максимально возможной на выбранном пути 
        </Tooltip>
    );

    const checkCurrentFlow = async () => {
        if (!checkCapacityAndFlow(currentFlowInput.current.value)) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('Введена некорректная величина!');
        }
        else {
            try {
                await problemSolvingStore.checkCurrentFlow(Number(currentFlowInput.current.value));
                modalWinStore.setIsSuccessType(true);
                modalWinStore.setTitle('Правильно');
                modalWinStore.setBody('Величина текущего потока введена верно. Переходите к следующему шагу!');
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
                    let currentFlowMistakes = problemSolvingStore.mistakes["currentFlow"];
                    problemSolvingStore.setMistakes({...problemSolvingStore.mistakes, currentFlow: currentFlowMistakes + 1});
                    modalWinStore.setIsErrorType(true);
                    modalWinStore.setTitle('Ошибка');
                    modalWinStore.setBody(e?.message);
                }
            }
        }
        currentFlowInput.current.value = '';
    };

    return (
        <div className='d-flex flex-column justify-content-center'>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <p className='main-font-bold fs-5 mb-0'>Введите величину:</p>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                >
                    <i className='bi bi-question-octagon me-2 fs-5'></i>
                </OverlayTrigger>
            </div>
            <div id='step-flow-panel' className='d-flex justify-content-start align-items-center color-1 rounded-4 main-border mb-2 p-5'>
                <p className='sub-font-reg m-0 fs-5'>Величина текущего потока равна: </p>
                <input disabled={!problemSolvingStore.areCapacitiesUpdated} id='current-flow-input' type='number' className='ms-3 main-border rounded-4 sub-font-reg text-center fs-5'
                    placeholder={problemSolvingStore.currentFlow} min='0' ref={currentFlowInput}></input>
            </div>
            <div className='d-flex justify-content-end align-items-center'>
                <button disabled={!problemSolvingStore.areCapacitiesUpdated} className='problem-button main-border rounded-4 ps-5 pe-5 pt-3 pb-3 sub-font-reg bg-white'
                    onClick={checkCurrentFlow}>Далее <i className="bi bi-arrow-right-short"></i></button>
            </div>
        </div>
    );
};

export default observer(StepFlowPanel);