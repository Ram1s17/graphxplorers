import React from "react";
import { Col } from "react-bootstrap";
import cl from "../../styles/PersonalAccoutPage.module.css";

const ResultsOfSolvingTestsPanel = ({ testResults }) => {
    const getDate = (dateAndTime) => {
        return dateAndTime.split(' ')[0].split('-').reverse().join('.');
    };

    const getTime = (dateAndTime) => {
        return dateAndTime.split(' ')[1];
    };

    return (
        <Col xl={5} className='rounded-4 main-border p-3 d-flex flex-column align-items-center'>
            <h4 className='main-font-bold text-center'>Тесты</h4>
            {testResults.length > 0 ?
                <div className={`${cl.resultsList} w-100 d-flex flex-column align-items-center`}>
                    {testResults.map((result) =>
                        <div key={result.result_id} className={`${cl.testListItem} w-100 p-3 main-border rounded-4 mb-3 align-items-center`}>
                            <div className='d-flex flex-column align-items-center'>
                                <p className='mb-0 sub-font-reg'>Вид</p>
                                <p className='mb-0 main-font-bold'>{result.type_of_test}</p>
                            </div>
                            <div className='d-flex flex-column align-items-center'>
                                <p className='mb-0 sub-font-reg'>Вопросы</p>
                                <p className='mb-0 main-font-bold'>{result.count_of_questions}</p>
                            </div>
                            <div className='d-flex flex-column align-items-center'>
                                <p className='mb-0 sub-font-reg'>Баллы</p>
                                <p className='mb-0 main-font-bold'>{result.result_points}/{result.total_points}</p>
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-stopwatch fs-5 me-2"></i>
                                <p className='mb-0 sub-font-reg'>{result.spent_time}</p>

                            </div>
                            <div className="d-flex align-items-center">
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
                    <p className='sub-font-reg fs-6'>Решите свой первый тест в разделе «Тесты»</p>
                </div>
            }
        </Col>
    );
};

export default ResultsOfSolvingTestsPanel;