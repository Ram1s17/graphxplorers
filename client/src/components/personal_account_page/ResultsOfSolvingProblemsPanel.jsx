import React from "react";
import { Col, OverlayTrigger, Popover } from "react-bootstrap";
import cl from "../../styles/PersonalAccoutPage.module.css";

const ResultsOfSolvingProblemsPanel = ({ problemResults }) => {
    const getDate = (dateAndTime) => {
        return dateAndTime.split('T')[0].split('-').reverse().join('.');
    };

    const getTime = (dateAndTime) => {
        return dateAndTime.split('T')[1].split('.')[0];
    };

    return (
        <Col xl={5} className='rounded-4 main-border p-3 d-flex flex-column align-items-center'>
            <h4 className='main-font-bold text-center'>Задачи</h4>
            {problemResults.length > 0 ?
                <div className={`${cl.resultsList} w-100 d-flex flex-column align-items-center`}>
                    {problemResults.map((result) =>
                        <div key={result.result_id} className={`${cl.problemListItem} w-100 p-3 main-border rounded-4 mb-3 align-items-center`}>
                            <div className='d-flex flex-column align-items-center'>
                                <p className='mb-0 sub-font-reg'>Задача</p>
                                <p className='mb-0 main-font-bold'>#{result.problem_id}</p>
                            </div>
                            <div className='d-flex flex-column align-items-center'>
                                <p className='mb-0 sub-font-reg'>Баллы</p>
                                <p className='mb-0 main-font-bold'>{result.result_points}/{result.total_points}</p>
                            </div>
                            <div className='d-flex flex-column align-items-center'>
                                <p className='mb-0 sub-font-reg'>Шаги</p>
                                <p className='mb-0 main-font-bold'>{result.count_of_steps}</p>
                            </div>
                            <div className='d-flex flex-column align-items-center'>
                                <p className='mb-0 sub-font-reg'>Ошибки</p>
                                <div className='d-flex'>
                                    <p className='mb-0 main-font-bold'>{result.count_of_mistakes}</p>
                                    {result.count_of_mistakes > 0 &&
                                        <OverlayTrigger
                                            trigger="click"
                                            key="right"
                                            placement="right"
                                            overlay={
                                                <Popover id={`popover-${result.result_id}`}>
                                                    <Popover.Header as="h3">{`Из них:`}</Popover.Header>
                                                    <Popover.Body>
                                                        <ul>
                                                            <li>Выбор пути: <strong>{result.stage_mistakes.path}</strong></li>
                                                            <li>Ввод новых пропускных способностей: <strong>{result.stage_mistakes.newCapacities}</strong></li>
                                                            <li>Обновление величины текущего потока: <strong>{result.stage_mistakes.currentFlow}</strong></li>
                                                            <li>Нахождение минимального разреза: <strong>{result.stage_mistakes.minCut}</strong></li>
                                                        </ul>
                                                    </Popover.Body>
                                                </Popover>
                                            }
                                        >
                                            <i className="bi bi-info-circle ms-3"></i>
                                        </OverlayTrigger>
                                    }
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-stopwatch fs-5 me-2"></i>
                                <p className='mb-0 sub-font-reg'>{result.spent_time}</p>

                            </div>
                            <div className="d-flex justify-content-center align-items-center">
                                <i className="bi bi-calendar3 fs-5 me-2"></i>
                                <div className='d-flex flex-column align-items-center'>
                                    <p className='mb-0 sub-font-reg'>{getTime(result.date_of_solving)}</p>
                                    <p className='mb-0 sub-font-reg'>{getDate(result.date_of_solving)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                :
                <div className={`${cl.resultsList} w-100 d-flex flex-column align-items-center justify-content-center`}>
                    <i className="bi bi bi-journal-x fs-2"></i>
                    <p className='sub-font-reg fs-6'>Решите свою первую задачу в разделе «Решение задач»</p>
                </div>
            }
        </Col>
    );
};

export default ResultsOfSolvingProblemsPanel;