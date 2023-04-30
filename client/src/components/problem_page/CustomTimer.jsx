import React, { useEffect, useContext } from "react";
import { useStopwatch } from 'react-timer-hook';
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const CustomTimer = ({ problemId }) => {
    const { seconds, minutes, hours } = useStopwatch({ autoStart: true });
    const { store, problemSolvingStore } = useContext(Context);
    const router = useNavigate();

    const formatTime = (time) => {
        return String(time).padStart(2, '0');
    };

    useEffect(() => {
        async function postData() {
            if (problemSolvingStore.isProblemSolved) {
                problemSolvingStore.setTime(`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`);
                try {
                    await problemSolvingStore.saveResult(problemId, store.userId);
                    router('/practice');
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
    }, [problemSolvingStore.isProblemSolved]);

    return (
        <div className='main-border color-4 rounded-4 ps-5 pe-5 pt-1 pb-1 main-font-bold fs-3'>{formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}</div>
    );
};

export default observer(CustomTimer);