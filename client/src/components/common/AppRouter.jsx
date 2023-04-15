import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { adminRoutes, publicRoutes, userRoutes, moderatorRoutes } from "../../http/routes";
import { observer } from "mobx-react-lite";
import { Context } from "../..";

const AppRouter = () => {
    const { store } = useContext(Context);

    if (!store.isAuth) {
        return (
            <Routes>
                {publicRoutes.map(route =>
                    <Route
                        element={<route.element />}
                        path={route.path}
                        key={route.path}
                    />
                )}
                <Route path="*" element={<Navigate to="/auth" />} />
            </Routes>
        );
    }

    return (
        (store.userRole === 'USER')
            ?
            <Routes>
                {userRoutes.map(route =>
                    <Route
                        element={<route.element />}
                        path={route.path}
                        key={route.path}
                    />
                )}
                <Route path="*" element={<Navigate to='/main' />} />
            </Routes>
            : (store.userRole === 'ADMIN')
                ?
                <Routes>
                    {adminRoutes.map(route =>
                        <Route
                            element={<route.element />}
                            path={route.path}
                            key={route.path}
                        />
                    )}
                    <Route path="*" element={<Navigate to='/main' />} />
                </Routes>
                :
                <Routes>
                    {moderatorRoutes.map(route =>
                        <Route
                            element={<route.element />}
                            path={route.path}
                            key={route.path}
                        />
                    )}
                    <Route path="*" element={<Navigate to='/theory' />} />
                </Routes>
    );
};

export default observer(AppRouter);