import AuthPage from "../pages/AuthPage";
import AdminPage from "../pages/AdminPage";
import MainUserPage from "../pages/MainUserPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

export const adminRoutes = [
    { path: '/main', element: AdminPage }
];

export const moderatorRoutes = [

];

export const userRoutes = [
    { path: '/main', element: MainUserPage }
];

export const publicRoutes = [
    { path: '/auth', element: AuthPage },
    { path: 'reset_password/:id/:token', element: ResetPasswordPage }
];