import React, { useEffect, useContext } from "react";
import { Row, Col } from "react-bootstrap";
import CustomNavbar from "../components/common/UI/Navbar/CustomNavbar";
import { useNavigate, useParams } from "react-router-dom";
import cl from '../styles/ProblemsListManagementPage.module.css';
import { Context } from "..";
import { observer } from "mobx-react-lite";
import NetworkViewPanel from "../components/problem_management_page/NetworkViewPanel";
import NetworkConfigPanel from "../components/problem_management_page/NetworkConfigPanel";
import TaskConfigPanel from "../components/problem_management_page/TaskConfigPanel";
import BeforeUnloadComponent from 'react-beforeunload-component';
import LeaveConfirmationModal from "../components/common/UI/LeaveConfirmationModal";

const ProblemManagementPage = () => {
    const router = useNavigate();
    const { id } = useParams();
    const { store, problemManagementStore } = useContext(Context);

    useEffect(() => {
        async function fetchData() {
            try {
                if (id !== 'new') {
                    if (!(+id))
                        router('/practice');
                    else
                        await problemManagementStore.getProblem(id);
                }
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
        problemManagementStore.initStates();
        fetchData();
    }, []);

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
                <Row className='d-flex justify-content-center'>
                    <Col>
                        <Row className={`${cl.managementPanel} rounded-4 p-4 m-2`}>
                            {problemManagementStore.isNetConfigChosen ? <TaskConfigPanel /> : <NetworkConfigPanel />}
                            {!problemManagementStore.isNetConfigChosen && <NetworkViewPanel />}
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default observer(ProblemManagementPage);