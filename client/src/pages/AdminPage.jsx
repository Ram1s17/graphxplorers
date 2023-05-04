import React, { useEffect, useState, useContext, useMemo } from "react";
import { Row, Col, Form } from "react-bootstrap";
import cl from '../styles/AdminPage.module.css'
import ModeratorsList from "../components/admin_page/ModeratorsList";
import AdminService from "../services/AdminService";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import CreateModeratorPanel from "../components/admin_page/CreateModeratorPanel";
import UpdateModeratorPanel from "../components/admin_page/UpdateModeratorPanel";
import { useNavigate } from "react-router-dom";
import BeforeUnloadComponent from 'react-beforeunload-component';
import LeaveConfirmationModal from "../components/common/UI/LeaveConfirmationModal";

const AdminPage = () => {
    const [moderators, setModerators] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAdding, setIsAdding] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { store, modalWinStore } = useContext(Context);
    const router = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await AdminService.getAllModerators();
                setModerators(response.data);
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

    const searchedModeratorsList = useMemo(() => {
        if (searchQuery)
            return [...moderators].filter(moderator => moderator.user_name.toLowerCase().includes(searchQuery.toLowerCase()));
        return moderators;
    }, [searchQuery, moderators]);

    const createModerator = async (userName, userEmail, userPassword, resetInputs) => {
        try {
            const response = (await AdminService.createModerator(userName, userEmail, userPassword)).data;
            modalWinStore.setIsSuccessType(true);
            modalWinStore.setTitle('Успешно');
            modalWinStore.setBody(response.message);
            const newModerator = {
                user_id: response.user_id,
                user_name: response.user_name,
                user_email: response.user_email
            };
            setModerators([...moderators, newModerator]);
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
        finally {
            resetInputs();
        }
    };

    const updateModerator = async (userId, userName, userEmail, userPassword, resetInput) => {
        try {
            const response = (await AdminService.updateModerator(userId, userName, userEmail, userPassword)).data;
            modalWinStore.setIsSuccessType(true);
            modalWinStore.setTitle('Успешно');
            modalWinStore.setBody(response.message);
            const currentModerIndex = moderators.findIndex(moderator => moderator.user_id === response.user_id);
            const updatedModerator = { ...moderators[currentModerIndex], user_name: response.user_name, user_email: response.user_email };
            const newModerators = [
                ...moderators.slice(0, currentModerIndex),
                updatedModerator,
                ...moderators.slice(currentModerIndex + 1)
            ];
            setModerators(newModerators);
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
        finally {
            resetInput();
        }
    };

    const removeModerator = async (userId) => {
        try {
            const response = (await AdminService.deleteModerator(userId)).data;
            modalWinStore.setIsSuccessType(true);
            modalWinStore.setTitle('Успешно');
            modalWinStore.setBody(response.message);
            setModerators(moderators.filter(moder => moder.user_id !== response.user_id));
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
        <Row className={`${cl.mainFrame} d-flex justify-content-center`}>
            <Col lg={10} className='d-flex flex-column justify-content-center'>
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
                <h1 className={`text-center main-font-bold ${cl.banner}`}>GraphXplorers</h1>
                <p className='sub-font-reg text-center reg-font-color fs-5 mb-4'>Администраторская панель</p>
                <Row className='d-flex justify-content-evenly'>
                    <Col lg={4} className='d-flex flex-column align-items-center mb-3'>
                        <h5 className='main-font-bold'><i className="bi bi-list-task"></i> Список модераторов</h5>
                        <ModeratorsList moderators={searchedModeratorsList} query={searchQuery} setQuery={setSearchQuery} remove={removeModerator} />
                    </Col>
                    <Col lg={5} className='d-flex flex-column align-items-center mb-3'>
                        <div className='w-100 d-flex justify-content-end pb-4'>
                            <button id={cl.logoutButton} onClick={() => setShowModal(true)} className='bg-transparent rounded-4 ps-4 pe-4 pt-2 pb-2 main-border'>Выйти <i className="bi bi-box-arrow-right"></i></button>
                        </div>
                        <div className='w-100 d-flex justify-content-evenly align-items-center'>
                            <Form.Label className='main-font-bold fs-5'><i className="bi bi-person-add"></i> Добавление</Form.Label>
                            <Form.Check
                                type="switch"
                                id="add-change-switch"
                                onChange={() => setIsAdding(!isAdding)}
                            />
                            <Form.Label className='main-font-bold fs-5'><i className="bi bi-person-gear"></i> Редактирование </Form.Label>
                        </div>
                        {isAdding ? <CreateModeratorPanel createModer={createModerator} /> : <UpdateModeratorPanel moderators={moderators} updateModer={updateModerator} />}
                    </Col>
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

export default observer(AdminPage);