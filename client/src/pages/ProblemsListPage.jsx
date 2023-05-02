import React, { useState, useEffect, useContext } from "react";
import { Row, Col } from "react-bootstrap"
import ProblemSolvingService from "../services/ProblemSolvingService";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import CustomNavbar from "../components/common/UI/Navbar/CustomNavbar";
import FilterBar from "../components/common/UI/FilterBar";
import SearchBar from "../components/common/UI/SearchBar";
import SortBar from "../components/common/UI/SortBar";
import ProblemsListItem from "../components/problems_list_page/ProblemsListItem";
import { useProblems } from "../hooks/useProblems";

const ProblemsListPage = () => {
    const [problems, setProblems] = useState([]);
    const [parametrs, setParametrs] = useState({ filterEasy: false, filterHard: false, sort: '', query: '' });
    const problemsList = useProblems(problems, parametrs.filterEasy, parametrs.filterHard, parametrs.sort, parametrs.query);
    const { store } = useContext(Context);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await ProblemSolvingService.getAllProblems();
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

    return (
        <Row >
            <Col>
                <Row className='mb-3'>
                    <Col className='p-0'>
                        <CustomNavbar />
                    </Col>
                </Row>
                <Row className='d-flex justify-content-center mb-4'>
                    <Col xl={10}>
                        <h1 className='main-font-bold text-center'>Выберите задачу и приступайте к решению!</h1>
                        <p className='sub-font-reg text-black fs-5 text-center'>Результаты сохранятся в личном кабинете, где вы сможете отследить прогресс</p>
                    </Col>
                </Row>
                <Row className='d-flex justify-content-center mb-4'>
                    <Col xl={10} className="d-flex justify-content-between align-items-center align-content-center">
                        <FilterBar parametrs={parametrs} setParametrs={setParametrs} />
                        <SearchBar parametrs={parametrs} setParametrs={setParametrs} />
                        <SortBar parametrs={parametrs} setParametrs={setParametrs} />
                    </Col>
                </Row>
                <Row className='d-flex justify-content-center'>
                    <Col xl={9}>
                        <Row className='d-flex justify-content-between gap-3'>
                            {problemsList.length > 0
                                ? problemsList.map(problem =>
                                    <ProblemsListItem key={problem.problem_id} problem={problem} />
                                )
                                : <div className='d-flex align-items-center justify-content-center'>
                                    <i className="bi bi-clipboard-x fs-1"></i>
                                    <p className='sub-font-reg fs-4 mb-0 ms-2'>По вашему запросу задач не найдено</p>
                                </div>
                            }
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default observer(ProblemsListPage);