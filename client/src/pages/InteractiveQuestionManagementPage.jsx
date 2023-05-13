import React, { useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import CustomNavbar from "../components/common/UI/Navbar/CustomNavbar";
import cl from '../styles/QuestionManagementPage.module.css';
import BeforeUnloadComponent from 'react-beforeunload-component';
import LeaveConfirmationModal from "../components/common/UI/LeaveConfirmationModal";
import NetworksShowPanel from "../components/question_management_page/NetworksShowPanel";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { useNavigate } from "react-router-dom";
import ProblemAndPointsConfigSubPanel from "../components/question_management_page/ProblemAndPointsConfigSubPanel";
import SubtypeAndStepConfigSubPanel from "../components/question_management_page/SubtypeAndStepConfigSubPanel";

const InteractiveQuestionManagementPage = () => {
    const { store, modalWinStore, questionManagementStore } = useContext(Context);
    const router = useNavigate();

    useEffect(() => {
        questionManagementStore.initStates();
    }, []);

    const createInteractiveQuestion = async () => {
        try {
            const response = await questionManagementStore.createInteractiveQuestion();
            modalWinStore.setIsSuccessType(true);
            modalWinStore.setTitle('Успешно');
            modalWinStore.setBody(response.data);
            router('/questions');
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
                <Row className='d-flex justify-content-center'>
                    <Col>
                        <Row className={`${cl.managementPanel} rounded-4 p-4 m-2`}>
                            <Col xl={12} className='mb-3 d-flex'>
                                <ProblemAndPointsConfigSubPanel />
                                <SubtypeAndStepConfigSubPanel />
                            </Col>
                            <NetworksShowPanel />
                            <div className='d-flex justify-content-end mt-1'>
                                <button className='problem-management-button main-border color-3 rounded-4 ps-5 pe-5 pt-2 pb-2 main-font-bold'
                                    disabled={!questionManagementStore.isQuestionCompleted}
                                    onClick={createInteractiveQuestion}>Cохранить</button>
                            </div>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default observer(InteractiveQuestionManagementPage);