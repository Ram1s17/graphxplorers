import React, { useEffect, useContext, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../..";

const SubtypeAndStepConfigSubPanel = () => {
    const { store, modalWinStore, questionManagementStore } = useContext(Context);

    useEffect(() => {
        questionManagementStore.setSelectedStep(1);
        questionManagementStore.setViewNetwork([]);
        questionManagementStore.setInteractionNetwork([]);
    }, [questionManagementStore.subtype]);

    useEffect(() => {
        questionManagementStore.setIsQuestionCompleted(false);
    }, [questionManagementStore.subtype, questionManagementStore.selectedStep]);

    const stepsList = useMemo(() => {
        if (questionManagementStore.subtype === 'path')
            return Array.from({ length: questionManagementStore.countOfSteps }, (_, i) => i + 1);
        else if (questionManagementStore.subtype === 'capacities')
            return Array.from({ length: questionManagementStore.countOfSteps - 1 }, (_, i) => i + 1);
        else
            return [];
    }, [questionManagementStore.countOfSteps, questionManagementStore.subtype]);

    const goBack = () => {
        questionManagementStore.setIsProblemSelected(false);
        questionManagementStore.setIsQuestionCompleted(false);
        questionManagementStore.setViewNetwork([]);
        questionManagementStore.setInteractionNetwork([]);
        questionManagementStore.setSelectedStep(1);
        questionManagementStore.setSubtype("path");
    };

    const getViewAndInteractionNetworks = async () => {
        try {
            await questionManagementStore.getViewAndInteractionNetworks();
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
        <div className='w-50'>
            <div className='d-flex justify-content-between align-items-center mb-5'>
                <div className='d-flex flex-column ms-4'>
                    <p className='main-font-bold fs-4 mb-2'>Выберите подтип вопроса:</p>
                    <select className='rounded-4 main-border ps-4 pe-4 pt-1 pb-1'
                        disabled={!questionManagementStore.isProblemSelected}
                        value={questionManagementStore.subtype}
                        onChange={(e) => questionManagementStore.setSubtype(e.target.value)}>
                        <option key={1} className='text-center' value="path">Выбор пути</option>
                        <option key={2} className='text-center' value="capacities">Ввод новых пропускных способностей</option>
                        <option key={3} className='text-center' value="mincut">Нахождение минимального разреза</option>
                    </select>
                </div>
                <div className='d-flex flex-column'>
                    <p className='main-font-bold fs-4 mb-2'>Выберите шаг:</p>
                    <select className='rounded-4 main-border ps-4 pe-4 pt-1 pb-1'
                        disabled={!questionManagementStore.isProblemSelected}
                        value={questionManagementStore.selectedStep}
                        onChange={(e) => questionManagementStore.setSelectedStep(Number(e.target.value))}>
                        {stepsList.map(stepNum =>
                            <option key={stepNum} className='text-center' value={stepNum}>Шаг #{stepNum}</option>
                        )}
                    </select>
                </div>
            </div>
            <div className='d-flex justify-content-end mt-1'>
                <button className='problem-management-button main-border color-3 rounded-4 ps-5 pe-5 pt-2 pb-2 main-font-bold me-2'
                    disabled={!questionManagementStore.isProblemSelected}
                    onClick={goBack}>Назад</button>
                <button className='problem-management-button main-border color-3 rounded-4 ps-5 pe-5 pt-2 pb-2 main-font-bold'
                    disabled={!questionManagementStore.isProblemSelected}
                    onClick={getViewAndInteractionNetworks}>Получить</button>
            </div>
        </div>
    );
};

export default observer(SubtypeAndStepConfigSubPanel);