import React, { useContext } from "react";
import { Col } from "react-bootstrap";
import cl from '../../styles/ProblemsListPage.module.css';
import { useNavigate } from "react-router-dom";
import { Context } from "../..";

const ProblemsListItem = ({ problem }) => {
    const router = useNavigate();
    const { modalWinStore } = useContext(Context);

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
                <p className={`${cl.showButton} fs-4 mb-0`} onClick={showNetwork}><i className="bi bi-eye-fill"></i></p>
                <p className={`${cl.startButton} fs-4 mb-0`} onClick={() => router(`/practice/${problem.problem_id}`)}><i className="bi bi-caret-right-fill"></i></p>
            </div>
        </Col>
    );
};

export default ProblemsListItem;