import React, { useState, useEffect, useContext } from "react";
import { Col } from "react-bootstrap";
import cl from '../../styles/QuestionManagementPage.module.css';
import ConfirmationModal from "../common/UI/ConfirmationModal/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { getSubtypeLabel } from "../../lib/content";
import { observer } from "mobx-react-lite";
import { Context } from "../..";

const QuestionsListManagementItem = ({ question, remove }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({ title: '', body: '' });
    const [isConfirmed, setIsConfirmed] = useState(false);
    const { modalWinStore } = useContext(Context);
    const router = useNavigate();

    useEffect(() => {
        if (isConfirmed)
            remove(question.question_id);
    }, [isConfirmed]);

    const showNetwork = (network) => {
        modalWinStore.setGraphElements(network);
        modalWinStore.setIsGraphType(true);
    };

    const removeHandler = () => {
        setIsConfirmed(false);
        setModalInfo({ ...modalInfo, title: 'Вы точно хотите удалить данный вопрос?' });
        setShowModal(true);
    };

    return (
        <Col xl={12} className={`${cl.listItem} main-border rounded-4 p-3`}>
            <div className='d-flex flex-column me-2'>
                <p className='main-font-bold mb-0'>Вопрос:</p>
                <p className='text-black mb-0'>{question.question_text}</p>
            </div>
            <div className='d-flex flex-column justify-content-center'>
                <div className='d-flex justify-content-center align-items-center rounded-4 main-border sub-font-reg text-black ps-4 pe-4 pt-1 pb-1 mb-2'>
                    <p className='mb-0 sub-font-reg text-black'>{question.question_type}
                        {question.question_type === 'теоретический'
                            ? <i className="bi bi-journal-bookmark-fill fs-5 ms-1"></i>
                            : <i className="bi bi-joystick fs-5 ms-1"></i>
                        }
                    </p>
                </div>
                {question.question_subtype && <div className='rounded-4 main-border ps-4 pe-4 pt-1 pb-1 mb-2 text-center'>{getSubtypeLabel(question.question_subtype)}</div>}
                <div className='d-flex justify-content-center align-items-center rounded-4 main-border ps-4 pe-4 pt-1 pb-1'>Баллы: {question.question_points}</div>
            </div>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <p className={`${cl.deleteButton} fs-4 mb-0`}
                    onClick={() => removeHandler()}><i className="bi bi-trash"></i></p>
                {question.question_type === 'интерактивный' &&
                    <p className={`${cl.showButton} fs-4 mb-0`} onClick={() => showNetwork(question.question_content.viewGraph.nodes.concat(question.question_content.viewGraph.edges))}><i className="bi bi-eye-fill"></i></p>
                }
                {question.question_type === 'интерактивный' &&
                    <p className={`${cl.showButton} fs-4 mb-0`} onClick={() => showNetwork(question.question_content.interactionGraph.nodes.concat(question.question_content.interactionGraph.edges))}><i className="bi bi-hand-index"></i></p>
                }
                {question.question_type === 'теоретический' && 
                    <p className={`${cl.updateButton} fs-4 mb-0`} onClick={() => router(`/questions/theoretical/${question.question_id}`)}><i className="bi bi-pencil-fill"></i></p>
                }
            </div>
            <ConfirmationModal showModal={showModal} setShowModal={setShowModal} title={modalInfo.title} body={modalInfo.body} setIsConfirmed={setIsConfirmed}></ConfirmationModal>
        </Col>
    );
};

export default observer(QuestionsListManagementItem);