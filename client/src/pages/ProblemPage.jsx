import React, { useState, useEffect, useContext } from "react";
import { Row, Col } from "react-bootstrap";
import CustomNavbar from "../components/common/UI/Navbar/CustomNavbar";
import ResidualNetworkPanel from "../components/problem_page/ResidualNetworkPanel";
import CurrentFlowInNetworkPanel from "../components/problem_page/CurrentFlowInNetworkPanel";
import CustomTimer from "../components/problem_page/CustomTimer";
import PathChoicePanel from "../components/problem_page/PathChoicePanel";
import StepFlowPanel from "../components/problem_page/StepFlowPanel";
import NewCapacitiesPanel from "../components/problem_page/NewCapacitiesPanel";
import NodesChoicePanel from "../components/problem_page/NodesChoicePanel";
import EdgesChoicePanel from "../components/problem_page/EdgesChoicePanel";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import CustomTabs from "../components/common/UI/CustomTab/CustomTabs";
import BeforeUnloadComponent from 'react-beforeunload-component';
import LeaveConfirmationModal from "../components/common/UI/LeaveConfirmationModal";

const ProblemPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [stageName, setStageName] = useState('Поиск максимального потока');
    const [isProblemSolved, setIsProblemSolved] = useState(false);
    const { id } = useParams();
    const router = useNavigate();
    const { store, problemSolvingStore } = useContext(Context);

    useEffect(() => {
        async function fetchData() {
            try {
                if (!(+id))
                    router('/practice');
                else
                    await problemSolvingStore.getProblem(id);
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
                    router('/practice');
                }
            }
        }
        problemSolvingStore.initStates();
        fetchData();
    }, []);

    useEffect(() => {
        if (problemSolvingStore.isChoosingMinCut) {
            setStageName('Поиск минимального разреза')
        }
    }, [problemSolvingStore.isChoosingMinCut]);

    return (
        <Row >
            <BeforeUnloadComponent
                blockRoute={true}
                modalComponentHandler={({ handleModalLeave, handleModalCancel }) => {
                    return (
                        <LeaveConfirmationModal
                            title="Вы действительно хотите завершить решение задачи?"
                            body="Ваш прогресс будет утерян"
                            onClose={handleModalCancel}
                            onConfirm={handleModalLeave} />
                    );
                }}
            />
            <Col>
                <Row className='mb-3'>
                    <Col className='p-0'>
                        <CustomNavbar />
                    </Col>
                </Row>
                <Row>
                    <Col className='d-flex justify-content-between'>
                        <CustomTimer problemId={id} isProblemSolved={isProblemSolved} />
                        <div>
                            <h2 className='main-font-bold text-center mb-0'>Шаг {problemSolvingStore.step}</h2>
                            <p className='mb-0 sub-font-reg'>{stageName}</p>
                        </div>
                        <button id='close-problem-button' className='main-border color-4 rounded-4 ps-5 pe-5 main-font-bold'
                            onClick={() => setShowModal(true)}>Завершить <i className="bi bi-x-circle"></i></button>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6} className='p-3'>
                        <CustomTabs>
                            <div label="Остаточная сеть" content={<ResidualNetworkPanel key='1' />} />
                            <div label="Текущий поток в транспортной сети" content={<CurrentFlowInNetworkPanel key='2' />} />
                        </CustomTabs>

                    </Col>
                    <Col xl={6} className='p-3'>
                        {problemSolvingStore.isChoosingMinCut ? <NodesChoicePanel /> : problemSolvingStore.isChoosingNewCapacities ? <NewCapacitiesPanel /> : <PathChoicePanel />}
                        {!problemSolvingStore.isChoosingMinCut ? <StepFlowPanel /> : <EdgesChoicePanel setIsProblemSolved={setIsProblemSolved} />}
                    </Col>
                </Row>
            </Col>
            {showModal && <LeaveConfirmationModal
                title="Вы действительно хотите завершить решение задачи?"
                body="Ваш текущий прогресс будет утерян"
                onClose={() => setShowModal(false)}
                onConfirm={() => router('/practice')} />}
        </Row>
    );
};

export default observer(ProblemPage);