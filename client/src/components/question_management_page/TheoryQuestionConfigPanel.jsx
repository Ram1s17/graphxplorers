import React from "react";
import { Col } from "react-bootstrap";
import cl from '../../styles/QuestionManagementPage.module.css';

const TheoryQuestionConfigPanel = ({ setIsViewMod, points, setPoints, question, setQuestion }) => {
    return (
        <Col xl={12} className='mb-3'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <div className='d-flex align-items-center'>
                    <h3 className='main-font-bold mb-0 me-3'>Управление теоретическим вопросом</h3>
                    <i className={`${cl.nextButton} bi bi-arrow-right-circle fs-3`} onClick={() => setIsViewMod(true)}></i>
                </div>
                <div className='d-flex flex-column'>
                    <div className='d-flex justify-content-between'>
                        <p className='main-font-bold fs-4 mb-0 me-3'>Количество баллов:</p>
                        <input type="number" min={1} max={10} className='rounded-4 sub-font-reg text-center' autoComplete='off'
                            value={points} onChange={(e) => setPoints(e.target.value)} />
                    </div>
                    <p className='sub-font-reg reg-font-color mb-0 fs-6 text-center'>*Введите величину в диапaзоне 1-10 баллов</p>
                </div>
            </div>
            <h5 className='ms-2'>Вопрос:</h5>
            <textarea className={`${cl.questionTextarea} w-100 rounded-4 sub-font-reg p-4 fs-5`} rows={2}
                value={question} onChange={(e) => setQuestion(e.target.value)} />
        </Col>
    );
};

export default TheoryQuestionConfigPanel;