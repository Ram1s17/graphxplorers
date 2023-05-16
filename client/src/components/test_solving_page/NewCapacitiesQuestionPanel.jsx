import React, { useRef, useContext, useEffect } from "react";
import { Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import CytoscapeComponent from "react-cytoscapejs";
import { cytoscapeConfig } from "../../lib/content";
import cl from "../../styles/TestsPage.module.css";
import NewCapacitiesSubPanel from "./NewCapacitiesSubPanel";

const NewCapacitiesQuestionPanel = ({ question, setIsTestCompleted }) => {
    let cyRefView = useRef();
    let cyRefInteraction = useRef();
    const { store, testSolvingStore } = useContext(Context);

    useEffect(() => {
        cyRefView.current.center();
        cyRefView.current.elements().remove();
        cyRefView.current.add(question.question_content.viewGraph);
    }, [question.question_content.viewGraph, testSolvingStore.currentIndex]);

    useEffect(() => {
        cyRefInteraction.current.center();
        cyRefInteraction.current.elements().remove();
        cyRefInteraction.current.add(question.question_content.interactionGraph);
    }, [question.question_content.interactionGraph, testSolvingStore.currentIndex]);

    const renderTooltip = (props) => (
        <Tooltip {...props}>
            Обновите значения пропускных способностей дуг на выбранном пути
        </Tooltip>
    );

    const checkAnswerForCapacitiesQuestion = async () => {
        try {
            const response = await testSolvingStore.checkAnswerForCapacitiesQuestion(question.question_content.config, cyRefInteraction.current.json().elements, question.question_content.pathNodes, question.question_content.pathFlow);
            if (response.data.result) {
                testSolvingStore.setUserPoints(testSolvingStore.userPoints + question.question_points);
            }
            if (testSolvingStore.currentIndex < testSolvingStore.questions.length - 1) {
                testSolvingStore.setCurrentIndex(testSolvingStore.currentIndex + 1);
            }
            else {
                setIsTestCompleted(true);
            }
        }
        catch (e) {
            if (e?.status === 401) {
                await store.logout();
                store.setError({ bool: true, message: e?.message });
            }
            else if (e?.status === 500 || e?.status === 503) {
                store.setError({ bool: true, message: e?.message });
            }
        }
    };

    return (
        <Row className='p-3 d-flex justify-content-between'>
            <Col className='color-2 main-border d-flex flex-column align-items-center rounded-4 p-3 me-2'>
                <div className='w-100 d-flex justify-content-end align-items-center'>
                    <h5 className='main-font-bold me-5 mb-0'>Панель просмотра</h5>
                    <p className='sub-font-reg fs-5 text-black mb-0 ms-5'>Баллы за ответ: <b>{question.question_points}</b></p>
                </div>
                <div id={cl.viewNetworkPanel} className='w-100 d-flex justify-content-center align-items-center'
                    onMouseOver={() => cyRefView.current.center()}>
                    <CytoscapeComponent
                        elements={question.question_content.viewGraph}
                        zoom={cytoscapeConfig.zoom}
                        userPanningEnabled={cytoscapeConfig.userPanningEnabled}
                        userZoomingEnabled={cytoscapeConfig.userZoomingEnabled}
                        autolock={cytoscapeConfig.autolock}
                        autounselectify={cytoscapeConfig.autounselectify}
                        style={cytoscapeConfig.style}
                        stylesheet={cytoscapeConfig.stylesheet}
                        cy={(cy) => { cyRefView.current = cy }} />
                </div>
            </Col>
            <Col className='color-2 main-border d-flex flex-column align-items-center rounded-4 p-3 ms-2'>
                <div className='w-100 d-flex justify-content-end mb-1'>
                    <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                    >
                        <i className='bi bi-question-octagon me-2 fs-5'></i>
                    </OverlayTrigger>
                </div>
                <div className='w-100 main-border rounded-4 p-3 bg-white d-flex flex-column mb-1'>
                    <p className='sub-font-reg mb-0'>Вопрос:</p>
                    <h5 className='main-font-bold'>{question.question_text}</h5>
                </div>
                <div id={cl.interactionNetworkPanel} className='w-100 d-flex justify-content-center align-items-center'
                    onMouseOver={() => cyRefInteraction.current.center()}>
                    <CytoscapeComponent
                        elements={question.question_content.interactionGraph}
                        zoom={cytoscapeConfig.zoom}
                        userPanningEnabled={cytoscapeConfig.userPanningEnabled}
                        userZoomingEnabled={cytoscapeConfig.userZoomingEnabled}
                        autolock={cytoscapeConfig.autolock}
                        autounselectify={cytoscapeConfig.autounselectify}
                        style={cytoscapeConfig.style}
                        stylesheet={cytoscapeConfig.stylesheet}
                        cy={(cy) => { cyRefInteraction.current = cy }} />
                </div>
                <div className='w-100 d-flex justify-content-end align-items-center'>
                    <NewCapacitiesSubPanel question={question} cyRefInteraction={cyRefInteraction} />
                    <button id={cl.sendAnswerButton} className='main-border color-3 rounded-4 px-5 py-2 main-font-bold fs-5'
                        onClick={checkAnswerForCapacitiesQuestion} >Ответить</button>
                </div>

            </Col>
        </Row>
    );
};

export default observer(NewCapacitiesQuestionPanel);