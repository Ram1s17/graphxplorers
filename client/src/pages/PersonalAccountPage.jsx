import React, { useContext, useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import CustomNavbar from "../components/common/UI/Navbar/CustomNavbar";
import { observer } from "mobx-react-lite";
import ResultsOfSolvingTestsPanel from "../components/personal_account_page/ResultsOfSolvingTestsPanel";
import { Context } from "..";
import UserService from "../services/UserService";
import ResultsOfSolvingProblemsPanel from "../components/personal_account_page/ResultsOfSolvingProblemsPanel";
import ResultsManagementPanel from "../components/personal_account_page/ResultsManagementPanel";
import { useTestResults } from "../hooks/useTestResults";
import { useProblemResults } from "../hooks/useProblemResults";
import { useNavigate } from "react-router-dom";
import cl from "../styles/PersonalAccoutPage.module.css"
import LeaveConfirmationModal from "../components/common/UI/LeaveConfirmationModal";
import PersonalInfoPanel from "../components/personal_account_page/PersonalInfoPanel";

const PersonalAccountPage = () => {
    const [personalInfo, setPersonalInfo] = useState({ user_name: '', user_email: '' });
    const [testResults, setTestResults] = useState([]);
    const [testListParametrs, setTestListParametrs] = useState({ dateQuery: '', filter: '', sort: '' });
    const testResultsList = useTestResults(testResults, testListParametrs.dateQuery, testListParametrs.filter, testListParametrs.sort);
    const [problemResults, setProblemResults] = useState([]);
    const [problemListParametrs, setProblemListParametrs] = useState({ dateQuery: '', query: '', sort: '' });
    const problemResultsList = useProblemResults(problemResults, problemListParametrs.dateQuery, problemListParametrs.query, problemListParametrs.sort);
    const [showModal, setShowModal] = useState(false);
    const [totalPoints, setTotalPoints] = useState({ totalPointsForSolvingTests: 0, totalPointsForSolvingProblems: 0 });
    const router = useNavigate();
    const { store } = useContext(Context);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await UserService.getUserInfo(store.userId);
                setPersonalInfo(response.data.personalInfo);
                setTestResults(response.data.testResults);
                setProblemResults(response.data.problemResults);
                setTotalPoints(response.data.totalPoints);
                store.setIsEmailConfirmed(response.data.personalInfo.is_confirmed);
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


    const logout = async () => {
        try {
            await store.logout();
            router('/auth');
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
                <Row className='mb-4'>
                    <Col className='p-0'>
                        <CustomNavbar />
                    </Col>
                </Row>
                <Row className="d-flex justify-content-evenly align-items-start mb-3">
                    <Col xl={5} className='d-flex flex-column align-items-center'>
                        <h3 className='main-font-bold text-center w-100 mb-4'>Данные учетной записи</h3>
                        {personalInfo && <PersonalInfoPanel personalInfo={personalInfo} setPersonalInfo={setPersonalInfo} />}
                    </Col>
                    <Col xl={5} className='d-flex flex-column align-items-center'>
                        <div className='w-100 d-flex justify-content-end mb-3'>
                            <button id={cl.logoutButton} onClick={() => setShowModal(true)} className='color-3 rounded-4 px-4 py-2 main-border fs-5'>Выйти <i className="bi bi-box-arrow-right"></i></button>
                        </div>
                        {store.isEmailConfirmed
                            ?
                            <div className='w-100 text-center sub-font-reg main-border rounded-4 color-3 p-3 mb-5'>
                                Почта <strong>{personalInfo.user_email}</strong> подтверждена
                            </div>
                            :
                            <div className='w-100 text-center sub-font-reg main-border rounded-4 color-4 p-3 mb-5'>
                                На Вашу почту <strong>{personalInfo.user_email}</strong> была выслана ссылка. Пожалуйста, перейдите по ней, иначе будет невозможным восстановление доступа к учетной записи
                            </div>
                        }

                        <div className='w-100 d-flex justify-content-center align-items-center'>
                            <i className="bi bi-trophy fs-1 me-4"></i>
                            <div className="d-flex flex-column align-items-center me-4">
                                <p className="fs-5 w-100 mb-0">Баллы за решение тестов: <strong>{totalPoints.totalPointsForSolvingTests}</strong></p>
                                <p className="fs-5 w-100 mb-0">Баллы за решение задач: <strong>{totalPoints.totalPointsForSolvingProblems}</strong></p>
                            </div>
                            <i className="bi bi-trophy fs-1"></i>
                        </div>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <h2 className='main-font-bold text-center'>История решений</h2>
                </Row>
                <ResultsManagementPanel
                    testListParametrs={testListParametrs} setTestListParametrs={setTestListParametrs}
                    problemListParametrs={problemListParametrs} setProblemListParametrs={setProblemListParametrs}
                />
                <Row className="d-flex justify-content-evenly align-items-center mb-3">
                    <ResultsOfSolvingTestsPanel testResults={testResultsList} />
                    <ResultsOfSolvingProblemsPanel problemResults={problemResultsList} />
                </Row>
            </Col>
            {showModal && <LeaveConfirmationModal
                title="Вы действительно хотите покинуть страницу?"
                body="Несохраненные данные будут утеряны"
                onClose={() => setShowModal(false)}
                onConfirm={() => logout()} />}
        </Row>
    );
};

export default observer(PersonalAccountPage);