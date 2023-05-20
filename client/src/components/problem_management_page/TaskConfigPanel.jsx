import React, { useContext, useRef, useEffect, useMemo, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { checkNumberValue } from "../../lib/validationUtil";
import { useNavigate, useParams } from "react-router-dom";

const TaskConfigPanel = () => {
    const [addedCriteriaID, setAddedCriteriaID] = useState(0);
    const [deletedCriteriaArray, setDeletedCriteriaArray] = useState([]);
    const pointsInput = useRef();
    const pathInput = useRef();
    const newCapacitiesInput = useRef();
    const currentFlowInput = useRef();
    const minCutInput = useRef();
    const router = useNavigate();
    const { id } = useParams();
    const { store, modalWinStore, problemManagementStore } = useContext(Context);

    const evaluationCriteria = useMemo(() => {
        return [...problemManagementStore.evaluationCriteria].sort((a, b) => a.points < b.points ? 1 : -1);
    }, [problemManagementStore.evaluationCriteria]);

    const points = useMemo(() => {
        const maxValue = Math.max(...evaluationCriteria.map(criteria => criteria.points));
        if (maxValue === -Infinity) {
            return 0;
        }
        return maxValue;
    }, [evaluationCriteria]);

    const createOrUpdateProblem = async () => {
        if (problemManagementStore.evaluationCriteria.length === 0) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('Должен быть задан хотя бы один критерий!');
        }
        else {
            try {
                problemManagementStore.setPoints(points);
                if (id !== 'new') {
                    const response = await problemManagementStore.updateProblem(id, deletedCriteriaArray);
                    modalWinStore.setIsSuccessType(true);
                    modalWinStore.setTitle('Успешно');
                    modalWinStore.setBody(response.data);
                }
                else {
                    const response = await problemManagementStore.createProblem();
                    modalWinStore.setIsSuccessType(true);
                    modalWinStore.setTitle('Успешно');
                    modalWinStore.setBody(response.data);
                }
                router('/practice');
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
                    modalWinStore.setIsErrorType(true);
                    modalWinStore.setTitle('Ошибка');
                    modalWinStore.setBody(e?.message);
                }
            }
        }
    };

    useEffect(() => {
        if (points > 5) {
            problemManagementStore.setComplexity("сложно");
        }
        else {
            problemManagementStore.setComplexity("легко");
        }
    }, [points]);

    const addCriteria = () => {
        const pointsInputValue = pointsInput.current.value;
        const pathInputValue = pathInput.current.value;
        const newCapacitiesInputValue = newCapacitiesInput.current.value;
        const currentFlowInputValue = currentFlowInput.current.value;
        const minCutInputValue = minCutInput.current.value;
        const searchedCriteriaIndex = problemManagementStore.evaluationCriteria.findIndex(criteria =>
            criteria.points === +pointsInputValue &&
            criteria.max_count_of_path_mistakes === +pathInputValue &&
            criteria.max_count_of_new_capacities_mistakes === +newCapacitiesInputValue &&
            criteria.max_count_of_current_flow_mistakes === +currentFlowInputValue &&
            criteria.max_count_of_min_cut_mistakes === +minCutInputValue);
        if (!checkNumberValue(pointsInputValue) || +pointsInputValue < 1 || +pointsInputValue > 10) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('Введено некорректное значение баллов!');
        }
        else if (!checkNumberValue(pathInputValue) || !checkNumberValue(newCapacitiesInputValue) ||
            !checkNumberValue(currentFlowInputValue) || !checkNumberValue(minCutInputValue)) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('Введено некорректное значение количества ошибок!');
        }
        else if (searchedCriteriaIndex !== -1) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('Такой критерий уже существует в таблице!');
        }
        else {
            problemManagementStore.setEvaluationCriteria([...problemManagementStore.evaluationCriteria, {
                criteria_id: addedCriteriaID,
                points: +pointsInputValue,
                max_count_of_path_mistakes: +pathInputValue,
                max_count_of_new_capacities_mistakes: +newCapacitiesInputValue,
                max_count_of_current_flow_mistakes: +currentFlowInputValue,
                max_count_of_min_cut_mistakes: +minCutInputValue
            }]);
            setAddedCriteriaID(addedCriteriaID - 1);
        }
        pointsInput.current.value = '';
        pathInput.current.value = '';
        newCapacitiesInput.current.value = '';
        currentFlowInput.current.value = '';
        minCutInput.current.value = '';
    };

    const deleteCriteria = (criteriaID) => {
        if (problemManagementStore.evaluationCriteria.length <= 1) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('Должен остаться хотя бы один критерий!');
        }
        else {
            problemManagementStore.setEvaluationCriteria([...problemManagementStore.evaluationCriteria.filter(criteria => criteria.criteria_id !== criteriaID)]);
            if (criteriaID > 0) {
                setDeletedCriteriaArray([...deletedCriteriaArray, criteriaID]);
            }
        }
    };

    return (
        <Col className='d-flex align-items-center p-4'>
            <div className='d-flex flex-column rounded-4 main-border p-4 me-3'>
                <div className='d-flex justify-content-between mb-2'>
                    <div className='d-flex flex-column'>
                        <p className='main-font-bold fs-5 mb-0 me-3'>Количество баллов: {points}</p>
                        <p className='sub-font-reg reg-font-color mb-0 fs-6'>*Легкие задачи: 1-5 баллов</p>
                        <p className='sub-font-reg reg-font-color mb-2 fs-6'>*Сложные задачи: 6-10 баллов</p>
                    </div>
                    <div className='d-flex flex-column'>
                        <div className='d-flex'>
                            <p className='main-font-bold fs-5 mb-0 me-3'>Сложность: {problemManagementStore.complexity}</p>
                        </div>
                    </div>
                </div>
                <p className='main-font-bold mb-0 fs-5'>Панель управления критериями</p>
                <p className='sub-font-reg reg-font-color mb-2 fs-6'>*Для добавления укажите количество баллов и максимальное количество ошибок (0-15) на каждом этапе</p>
                <div className='d-flex justify-content-start align-items-center ps-2 pe-2 pt-1 pb-1 rounded-4 main-border mb-3'>
                    <input type="number" min={0} className='rounded-4 sub-font-reg text-center w-25 me-1'
                        autoComplete='off' placeholder="Баллы" ref={pointsInput} />
                    <input type="number" min={0} className='rounded-4 sub-font-reg text-center w-25 me-1'
                        autoComplete='off' ref={pathInput} />
                    <input type="number" min={0} className='rounded-4 sub-font-reg text-center w-25 me-1'
                        autoComplete='off' ref={newCapacitiesInput} />
                    <input type="number" min={0} className='rounded-4 sub-font-reg text-center w-25 me-1'
                        autoComplete='off' ref={currentFlowInput} />
                    <input type="number" min={0} className='rounded-4 sub-font-reg text-center w-25 me-1'
                        autoComplete='off' ref={minCutInput} />
                    <i className="problem-button bi bi-plus-lg me-2 main-border rounded-4 p-2" onClick={addCriteria}></i>
                </div>
            </div>
            <div className='d-flex flex-column'>
                <p className='main-font-bold fs-5 mb-2 me-3 text-center'>Критерии оценивания</p>
                <Table striped bordered variant="light" className='text-center mb-4'>
                    <thead>
                        <tr>
                            <th>Количество баллов</th>
                            <th>Выбор пути</th>
                            <th>Ввод новых пропускных способностей</th>
                            <th>Обновление величины текущего потока</th>
                            <th>Нахождение минимального разреза</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {evaluationCriteria.map((criteria, index) =>
                            <tr key={index}>
                                <td>{criteria.points}</td>
                                <td>{criteria.max_count_of_path_mistakes}</td>
                                <td>{criteria.max_count_of_new_capacities_mistakes}</td>
                                <td>{criteria.max_count_of_current_flow_mistakes}</td>
                                <td>{criteria.max_count_of_min_cut_mistakes}</td>
                                <td><i className="problem-button bi bi-trash rounded-4 p-2" onClick={() => deleteCriteria(criteria.criteria_id)}></i></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <div className='d-flex justify-content-end'>
                    <button className='problem-management-button main-border color-2 rounded-4 ps-5 pe-5 pt-2 pb-2 main-font-bold me-4'
                        onClick={() => problemManagementStore.setIsNetConfigChosen(false)}>Назад</button>
                    <button className='problem-management-button main-border color-2 rounded-4 ps-5 pe-5 pt-2 pb-2 main-font-bold'
                        onClick={createOrUpdateProblem}>Сохранить</button>
                </div>
            </div>
        </Col >
    );
};

export default observer(TaskConfigPanel);