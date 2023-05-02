import React, { useState, useEffect, useContext } from "react";
import { Col } from "react-bootstrap";
import cl from '../../styles/ProblemsListManagementPage.module.css';
import { Context } from "../..";
import ConfirmationModal from "../common/UI/ConfirmationModal/ConfirmationModal";

const ProblemsListManagementItem = ({ problem, remove }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({ title: '', body: '' });
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [deletedProblemId, setDeletedProblemId] = useState(0);
    const { modalWinStore } = useContext(Context);

    useEffect(() => {
        if (isConfirmed)
            remove(deletedProblemId);
    }, [isConfirmed]);

    const removeHandler = () => {
        setIsConfirmed(false);
        setModalInfo({ ...modalInfo, title: `Вы точно хотите удалить задачу #${problem.problem_id}?` });
        setDeletedProblemId(problem.problem_id);
        setShowModal(true);
    };

    const showNetwork = () => {
        modalWinStore.setGraphElements(problem.graph);
        modalWinStore.setIsGraphType(true);
    };

    return (
        <Col xl={5} className={`${cl.listItem} main-border rounded-4 p-3`}>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <h2 className='main-font-bold mb-0'>#{problem.problem_id}</h2>
            </div>
            <div className='d-flex flex-column justify-content-center'>
                <div className='d-flex justify-content-center align-items-center rounded-4 main-border sub-font-reg text-black ps-4 pe-4 pt-1 pb-1 mb-2'>{problem.complexity}
                    {problem.complexity === 'легко'
                        ? <div className={`${cl.circle} rounded-circle color-3 main-border ms-1`} />
                        : <div className={`${cl.circle} rounded-circle color-4 main-border ms-1`} />}
                </div>
                <div className='d-flex justify-content-center align-items-center rounded-4 main-border ps-4 pe-4 pt-1 pb-1'>Баллы: {problem.points}</div>
            </div>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <p className={`${cl.deleteButton} fs-4 mb-0`} onClick={removeHandler}><i className="bi bi-trash"></i></p>
                <p className={`${cl.showButton} fs-4 mb-0`} onClick={showNetwork}><i className="bi bi-eye-fill"></i></p>
                <p className={`${cl.updateButton} fs-4 mb-0`}><i className="bi bi-pencil-fill"></i></p>
            </div>
            <ConfirmationModal showModal={showModal} setShowModal={setShowModal} title={modalInfo.title} body={modalInfo.body} setIsConfirmed={setIsConfirmed}></ConfirmationModal>
        </Col>
    );
};

export default ProblemsListManagementItem;