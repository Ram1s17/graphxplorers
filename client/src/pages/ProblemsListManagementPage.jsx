import React, { useState, useEffect, useContext } from "react";
import { Row, Col } from "react-bootstrap"
import ProblemManagementService from "../services/ProblemManagementService";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import CustomNavbar from "../components/common/UI/Navbar/CustomNavbar";
import FilterBar from "../components/common/UI/FilterBar";
import SearchBar from "../components/common/UI/SearchBar";
import SortBar from "../components/common/UI/SortBar";
import { useProblems } from "../hooks/useProblems";
import ProblemsListManagementItem from "../components/problems_list_management_page/ProblemsListManagementItem";
import cl from '../styles/ProblemsListManagementPage.module.css';
import BeforeUnloadComponent from 'react-beforeunload-component';
import LeaveConfirmationModal from "../components/common/UI/LeaveConfirmationModal";

const ProblemsListManagementPage = () => {
    const [problems, setProblems] = useState([]);
    const [parametrs, setParametrs] = useState({ filterEasy: false, filterHard: false, sort: '', query: '' });
    const problemsList = useProblems(problems, parametrs.filterEasy, parametrs.filterHard, parametrs.sort, parametrs.query);
    const { store, modalWinStore } = useContext(Context);

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

    const removeProblem = async (problemId) => {
        try {
            const response = (await ProblemManagementService.deleteProblem(problemId)).data;
            modalWinStore.setIsSuccessType(true);
            modalWinStore.setTitle('Успешно');
            modalWinStore.setBody(response.message);
            setProblems(problems.filter(problem => problem.problem_id !== problemId));
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
    };

    return (
        <Row >
            <Col>
                <BeforeUnloadComponent
                    blockRoute={true}
                    modalComponentHandler={({ handleModalLeave, handleModalCancel }) => {
                        return (
                            <LeaveConfirmationModal
                                title="Вы действительно хотите покинуть страницу?"
                                body="Несохраненные данные будут утеряны"
                                onClose={handleModalCancel}
                                onConfirm={handleModalLeave} />
                        );
                    }}
                />
                <Row className='mb-3'>
                    <Col className='p-0'>
                        <CustomNavbar />
                    </Col>
                </Row>
                <Row className='d-flex justify-content-center mb-4'>
                    <Col xl={10}>
                        <h1 className='main-font-bold text-center'>Панель управления задачами</h1>
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
                            <Col xl={5} className={`${cl.listItem} ${cl.addButton} main-border rounded-4 p-5 d-flex justify-content-center align-items-center`}>
                                <i className="bi bi-plus-square fs-3"></i>
                            </Col>
                            {problemsList.map(problem =>
                                <ProblemsListManagementItem key={problem.problem_id} problem={problem} remove={removeProblem} />
                            )}
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default observer(ProblemsListManagementPage);