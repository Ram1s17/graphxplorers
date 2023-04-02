import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./UI/LoadingSpinner";
import { adminRoutes, publicRoutes, userRoutes, moderatorRoutes } from "../../http/routes";
import { observer } from "mobx-react-lite";
import { Context } from "../..";

const AppRouter = () => {
    const { store } = useContext(Context);

    if (store.isLoading) {
        return (<Routes><Route path="/*" element={<LoadingSpinner />} /></Routes>);
    }

    return (
        (store.isAuth && (store.userRole === 'USER'))
            ?
            <Routes>
                {userRoutes.map(route =>
                    <Route
                        element={<route.element />}
                        path={route.path}
                        key={route.path}
                    />
                )}
                <Route path="*" element={<Navigate to='/main' replace />} />
            </Routes>
            : (store.isAuth && (store.userRole === 'ADMIN'))
                ?
                <Routes>
                    {adminRoutes.map(route =>
                        <Route
                            element={<route.element />}
                            path={route.path}
                            key={route.path}
                        />
                    )}
                    <Route path="*" element={<Navigate to='/main' replace />} />
                </Routes>
                : (store.isAuth && (store.userRole === 'MODERATOR'))
                    ?
                    <Routes>
                        {moderatorRoutes.map(route =>
                            <Route
                                element={<route.element />}
                                path={route.path}
                                key={route.path}
                            />
                        )}
                        <Route path="*" element={<Navigate to='/main' replace />} />
                    </Routes>
                    :
                    <Routes>
                        {publicRoutes.map(route =>
                            <Route
                                element={<route.element />}
                                path={route.path}
                                key={route.path}
                            />
                        )}
                        <Route path="*" element={<Navigate to="/auth" replace />} />
                    </Routes>
    );
};

export default observer(AppRouter);