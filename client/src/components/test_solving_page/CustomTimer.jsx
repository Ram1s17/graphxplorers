import React, { useEffect, useContext } from "react";
import { useStopwatch } from 'react-timer-hook';
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const CustomTimer = ({ isTestCompleted }) => {
    const { seconds, minutes, hours } = useStopwatch({ autoStart: true });
    const { store, modalWinStore, testSolvingStore } = useContext(Context);
    const router = useNavigate();

    const formatTime = (time) => {
        return String(time).padStart(2, '0');
    };

    useEffect(() => {
        async function postData() {
            if (isTestCompleted) {
                testSolvingStore.setTime(`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`);
                try {
                    await testSolvingStore.saveResult(store.userId);
                    let resultArray = [
                        { parametr: "Количество заработанных баллов", value: testSolvingStore.userPoints + '/' + testSolvingStore.totalPoints},
                        { parametr: "Время, затраченное на решение", value: testSolvingStore.time },
                        { parametr: "Общее количество вопросов", value: testSolvingStore.countOfQuestions }
                    ];
                    modalWinStore.setIsResultType(true);
                    modalWinStore.setTitle('Поздравляем с прохождением теста!');
                    modalWinStore.setResultArray(resultArray);
                    router('/tests');
                    testSolvingStore.setCountOfQuestions(0);
                    testSolvingStore.setTypeOfTest('');
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
        }
        postData();
    }, [isTestCompleted]);

    return (
        <div className='d-flex justify-content-center align-items-center main-border color-4 rounded-4 ps-5 pe-5 pt-1 pb-1 main-font-bold fs-3'>
            {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
        </div>
    );
};

export default observer(CustomTimer);