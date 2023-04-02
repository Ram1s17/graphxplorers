import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import AdminService from "../services/AdminService";

const AdminPage = () => {
    const { store } = useContext(Context);
    const handler = async () => {
        try {
            const response = await AdminService.getAllModerators();
            console.log(response.data);
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
        <div>
            <h1>АДМИНИСТРАТОРСКАЯ СТРАНИЦА</h1>
            <button onClick={handler}>ПОЛУЧИТЬ МОДЕРАТОРОВ</button>
        </div>
    );
};

export default observer(AdminPage);