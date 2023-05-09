import React, { useContext, useRef, useEffect } from "react";
import { Col, Table } from "react-bootstrap";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { checkNumberValue } from "../../lib/validationUtil";
import { useNavigate, useParams } from "react-router-dom";

const TaskConfigPanel = () => {
    const pointsInput = useRef();
    const pathInput = useRef();
    const newCapacitiesInput = useRef();
    const currentFlowInput = useRef();
    const minCutInput = useRef();
    const router = useNavigate();
    const { id } = useParams();
    const { store, modalWinStore, problemManagementStore } = useContext(Context);

    const createOrUpdateProblem = async () => {
        try {
            if (id !== 'new') {
                const response = await problemManagementStore.updateProblem(id);
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
    };

    useEffect(() => {
        if (problemManagementStore.points > 5) {
            problemManagementStore.setComplexity("сложно");
        }
        else {
            problemManagementStore.setComplexity("легко");
        }
    }, [problemManagementStore.points]);

    const updateComplexity = (complexity) => {
        if (complexity === "легко" && problemManagementStore.points > 5 || complexity === "сложно" && problemManagementStore.points < 6) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('Указанная сложность не соответствует текущему количеству баллов!');
        }
        else {
            problemManagementStore.setComplexity(complexity);
        }
    };

    const addOrUpdateCriteria = () => {
        const pointsInputValue = pointsInput.current.value;
        const pathInputValue = pathInput.current.value;
        const newCapacitiesInputValue = newCapacitiesInput.current.value;
        const currentFlowInputValue = currentFlowInput.current.value;
        const minCutInputValue = minCutInput.current.value;
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
        else {
            const evaluationCriteria = new Map(Object.entries(problemManagementStore.evaluationCriteria));
            if (Object.keys(problemManagementStore.evaluationCriteria).includes(pointsInputValue)) {
                evaluationCriteria.set(pointsInputValue, {
                    path: +pathInputValue,
                    newCapacities: +newCapacitiesInputValue,
                    currentFlow: +currentFlowInputValue,
                    minCut: +minCutInputValue
                });
                problemManagementStore.setEvaluationCriteria({ ...Object.fromEntries(evaluationCriteria) });
            }
            else {
                if (pointsInputValue != problemManagementStore.points + 1) {
                    modalWinStore.setIsErrorType(true);
                    modalWinStore.setTitle('Ошибка');
                    modalWinStore.setBody(`Доступное на данный момент количество баллов для добавления критерия - ${problemManagementStore.points + 1}!`);
                }
                else {
                    evaluationCriteria.set(pointsInputValue, {
                        path: +pathInputValue,
                        newCapacities: +newCapacitiesInputValue,
                        currentFlow: +currentFlowInputValue,
                        minCut: +minCutInputValue
                    });
                    problemManagementStore.setEvaluationCriteria({ ...Object.fromEntries(evaluationCriteria) });
                    problemManagementStore.setPoints(problemManagementStore.points + 1);
                }
            }
        }
        pointsInput.current.value = '';
        pathInput.current.value = 0;
        newCapacitiesInput.current.value = 0;
        currentFlowInput.current.value = 0;
        minCutInput.current.value = 0;
    };

    const deleteCriteria = () => {
        const pointsInputValue = pointsInput.current.value;
        if (!checkNumberValue(pointsInputValue) || +pointsInputValue < 1 || +pointsInputValue > 10) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('Введено некорректное значение баллов!');
        }
        else if (+pointsInputValue !== problemManagementStore.points) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody(`Доступно удаление критерия для следующего количества баллов: ${problemManagementStore.points}!`);
        }
        else if (+pointsInputValue === 1) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('Должен остаться хотя бы один критерий!');
        }
        else {
            const evaluationCriteria = new Map(Object.entries(problemManagementStore.evaluationCriteria));
            evaluationCriteria.delete(pointsInputValue);
            problemManagementStore.setEvaluationCriteria({ ...Object.fromEntries(evaluationCriteria) });
            problemManagementStore.setPoints(problemManagementStore.points - 1);
        }
        pointsInput.current.value = '';
        pathInput.current.value = 0;
        newCapacitiesInput.current.value = 0;
        currentFlowInput.current.value = 0;
        minCutInput.current.value = 0;
    };

    return (
        <Col className='d-flex align-items-center p-4'>
            <div className='d-flex flex-column rounded-4 main-border p-4 me-3'>
                <div className='d-flex justify-content-between mb-2'>
                    <div className='d-flex flex-column'>
                        <p className='main-font-bold fs-5 mb-0 me-3'>Количество баллов: {problemManagementStore.points}</p>
                        <p className='sub-font-reg reg-font-color mb-0 fs-6'>*Легкие задачи: 1-5 баллов</p>
                        <p className='sub-font-reg reg-font-color mb-2 fs-6'>*Сложные задачи: 6-10 баллов</p>
                    </div>
                    <div className='d-flex flex-column'>
                        <div className='d-flex'>
                            <p className='main-font-bold fs-5 mb-0 me-3'>Сложность:</p>
                            <select className='rounded-4 main-border ps-4 pe-4 pt-1 pb-1'
                                value={problemManagementStore.complexity}
                                onChange={(e) => updateComplexity(e.target.value)}
                            >
                                <option key="1" className='text-center' value="легко">легко</option>
                                <option key="2" className='text-center' value="сложно">сложно</option>
                            </select>
                        </div>
                    </div>
                </div>
                <p className='main-font-bold mb-0 fs-5'>Панель управления критериями</p>
                <p className='sub-font-reg reg-font-color mb-2 fs-6'>*Для добавления и редактирования укажите баллы и максимальное количество ошибок (0-15) на каждом этапе, а для удаления просто укажите баллы</p>
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
                    <i className="problem-button bi bi-plus-lg me-2 main-border rounded-4 p-2" onClick={addOrUpdateCriteria}></i>
                    <i className="problem-button bi bi-trash me-2 main-border rounded-4 p-2" onClick={deleteCriteria}></i>
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
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(problemManagementStore.evaluationCriteria).reverse().map((criteria) =>
                            <tr key={criteria[0]}>
                                <td>{criteria[0]}</td>
                                <td>{criteria[1].path}</td>
                                <td>{criteria[1].newCapacities}</td>
                                <td>{criteria[1].currentFlow}</td>
                                <td>{criteria[1].minCut}</td>
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