import React, { useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import cl from '../../styles/QuestionManagementPage.module.css';
import ConfirmationModal from "../common/UI/ConfirmationModal/ConfirmationModal";
import { useNavigate } from "react-router-dom";

const QuestionsListManagementItem = ({ question, remove }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({ title: '', body: '' });
    const [isConfirmed, setIsConfirmed] = useState(false);
    const router = useNavigate();

    useEffect(() => {
        if (isConfirmed)
            remove(question.question_id);
    }, [isConfirmed]);

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
                {question.question_subtype && <div className='d-flex justify-content-center align-items-center rounded-4 main-border ps-4 pe-4 pt-1 pb-1 mb-2'>{question.question_subtype}</div>}
                <div className='d-flex justify-content-center align-items-center rounded-4 main-border ps-4 pe-4 pt-1 pb-1'>Баллы: {question.question_points}</div>
            </div>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <p className={`${cl.deleteButton} fs-4 mb-0`}
                    onClick={() => removeHandler()}><i className="bi bi-trash"></i></p>
                <p className={`${cl.updateButton} fs-4 mb-0`}
                    onClick={() => question.question_type === 'теоретический' ? router(`/questions/theoretical/${question.question_id}`) : router(`/questions/interactive/${question.question_id}`)}><i className="bi bi-pencil-fill"></i></p>
            </div>
            <ConfirmationModal showModal={showModal} setShowModal={setShowModal} title={modalInfo.title} body={modalInfo.body} setIsConfirmed={setIsConfirmed}></ConfirmationModal>
        </Col>
    );
};

export default QuestionsListManagementItem;