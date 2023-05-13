import React, { useEffect, useState, useContext, useMemo, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import ProblemManagementService from "../../services/ProblemManagementService";
import { checkNumberValue } from "../../lib/validationUtil";

const ProblemAndPointsConfigSubPanel = () => {
    const [problems, setProblems] = useState([]);
    const [searchIDquery, setSearchIDquery] = useState('');
    const [isProblemsListEmpty, setIsProblemsListEmpty] = useState();
    const problemIDselect = useRef();
    const { store, modalWinStore, questionManagementStore } = useContext(Context);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await ProblemManagementService.getAllProblems();
                setProblems(response.data);
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
        }
        fetchData();
    }, []);

    const searchedIdList = useMemo(() => {
        if (searchIDquery) {
            return [...problems].filter(problem => String(problem.problem_id).includes(searchIDquery));
        }
        return problems;
    }, [searchIDquery, problems]);

    useEffect(() => {
        if (searchedIdList.length > 0)
            setIsProblemsListEmpty(false);
        else
            setIsProblemsListEmpty(true);
    }, [searchedIdList]);

    const checkPointsAndProblem = async () => {
        if (!checkNumberValue(questionManagementStore.points) || Number(questionManagementStore.points) > 10 || Number(questionManagementStore.points) === 0) {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('Некорректное количество баллов!');
        }
        else {
            try {
                await questionManagementStore.getProblem(problemIDselect.current.value);
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

    return (
        <div className='w-50'>
            <div className='d-flex justify-content-between align-items-center mb-3'>
                <div className='d-flex flex-column'>
                    <p className='main-font-bold fs-4 mb-2'>Выберите задачу:</p>
                    <input type="number" min={1} max={10} className='rounded-4 sub-font-reg text-center bg-white mb-2' autoComplete='off'
                        disabled={questionManagementStore.isProblemSelected} placeholder="Поиск по номеру"
                        value={searchIDquery} onChange={(e) => setSearchIDquery(e.target.value)}
                    />
                    <select className='rounded-4 main-border ps-4 pe-4 pt-1 pb-1' ref={problemIDselect}
                        disabled={questionManagementStore.isProblemSelected}>
                        {searchedIdList.map(problem =>
                            <option key={problem.problem_id} className='text-center' value={problem.problem_id}>Задача #{problem.problem_id}</option>
                        )}
                    </select>
                </div>
                <div className='d-flex flex-column me-4'>
                    <div className='d-flex justify-content-between'>
                        <p className='main-font-bold fs-4 mb-0 me-3'>Количество баллов:</p>
                        <input type="number" min={1} max={10} className='rounded-4 sub-font-reg text-center bg-white' autoComplete='off' disabled={questionManagementStore.isProblemSelected}
                            value={questionManagementStore.points} onChange={(e) => questionManagementStore.setPoints(e.target.value)} />
                    </div>
                    <p className='sub-font-reg reg-font-color mb-0 fs-6 text-center'>*Введите величину в диапaзоне 1-10 баллов</p>
                </div>
            </div>
            <div className='d-flex justify-content-end'>
                <button className='problem-management-button main-border color-3 rounded-4 ps-5 pe-5 pt-2 pb-2 main-font-bold'
                    disabled={questionManagementStore.isProblemSelected || isProblemsListEmpty}
                    onClick={checkPointsAndProblem}>Далее</button>
            </div>
        </div>
    );
};

export default observer(ProblemAndPointsConfigSubPanel);