import React, { useState, useEffect, useContext } from "react";
import { Row, Col } from 'react-bootstrap'
import CustomNavbar from "../components/common/UI/Navbar/CustomNavbar";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import TheoryManagementService from "../services/TheoryManagementService";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import cl from '../styles/TheoryManagementPage.module.css'
import BeforeUnloadComponent from 'react-beforeunload-component';
import LeaveConfirmationModal from "../components/common/UI/LeaveConfirmationModal";

const TheoryManagementPage = () => {
    const [content, setContent] = useState('');
    const { store, modalWinStore } = useContext(Context);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await TheoryManagementService.getTheory();
                setContent(response.data);
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

    const saveContent = async () => {
        try {
            const response = (await TheoryManagementService.saveTheory(content)).data;
            modalWinStore.setIsSuccessType(true);
            modalWinStore.setTitle('Успешно');
            modalWinStore.setBody(response);
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
            <Col>
                <Row className='mb-5'>
                    <Col className='p-0'>
                        <CustomNavbar />
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col xl={10} className='ms-auto me-auto'>
                        <CKEditor
                            editor={Editor}
                            data={content}
                            onInit={
                                (editor) => {
                                    setContent(editor.getData());
                                }
                            }
                            onChange={(event, editor) => {
                                setContent(editor.getData());
                            }}
                        />
                        <div className='d-flex justify-content-center mt-2'>
                            <button id={cl.saveButton} className='w-25 main-border ps-4 pe-4 pt-2 pb-2 rounded-4 color-2 main-font-bold fs-5'
                                onClick={saveContent}>Сохранить</button>
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default observer(TheoryManagementPage);