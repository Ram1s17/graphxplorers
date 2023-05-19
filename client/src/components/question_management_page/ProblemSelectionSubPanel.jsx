import React, { useEffect, useState, useContext, useMemo, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import ProblemManagementService from "../../services/ProblemManagementService";
import { OverlayTrigger, Popover } from "react-bootstrap";

const ProblemSelectionSubPanel = () => {
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
        if (searchedIdList.length > 0) {
            setIsProblemsListEmpty(false);
            getProblem();
        }
        else {
            setIsProblemsListEmpty(true);
            questionManagementStore.setViewNetwork([]);
        }
    }, [searchedIdList, questionManagementStore.isProblemSelected]);

    const getProblem = async () => {
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
    };

    return (
        <div className='w-25'>
            <div className='d-flex flex-column align-items-center mb-3'>
                <p className='main-font-bold fs-4 mb-2'>Выберите задачу:
                    <OverlayTrigger
                        trigger="click"
                        key="right"
                        placement="right"
                        overlay={
                            <Popover>
                                <Popover.Body>
                                    Наведите на панель просмотра после смены задачи, чтобы переместить транспортную сеть в центр
                                </Popover.Body>
                            </Popover>
                        }
                    >
                        <i className="bi bi-info-circle ms-3"></i>
                    </OverlayTrigger>
                </p>
                <input type="number" min={1} max={10} className='rounded-4 sub-font-reg text-center bg-white mb-2 w-50' autoComplete='off'
                    disabled={questionManagementStore.isProblemSelected} placeholder="Поиск по номеру"
                    value={searchIDquery} onChange={(e) => setSearchIDquery(e.target.value)}
                />
                <select className='rounded-4 main-border px-4 py-1 w-50' ref={problemIDselect} onChange={getProblem}
                    disabled={questionManagementStore.isProblemSelected}>
                    {searchedIdList.map(problem =>
                        <option key={problem.problem_id} className='text-center' value={problem.problem_id}>Задача #{problem.problem_id}</option>
                    )}
                </select>
            </div>
            <div className='d-flex justify-content-center'>
                <button className='problem-management-button main-border color-3 rounded-4 px-5 py-2 main-font-bold'
                    disabled={questionManagementStore.isProblemSelected || isProblemsListEmpty}
                    onClick={() => questionManagementStore.setIsProblemSelected(true)}>Далее</button>
            </div>
        </div>
    );
};

export default observer(ProblemSelectionSubPanel);