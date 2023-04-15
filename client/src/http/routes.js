import AuthPage from "../pages/AuthPage";
import AdminPage from "../pages/AdminPage";
import MainUserPage from "../pages/MainUserPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import TheoryManagementPage from "../pages/TheoryManagementPage";
import TheoryPage from "../pages/TheoryPage";

export const adminRoutes = [
    { path: '/main', element: AdminPage }
];

export const moderatorRoutes = [
    { path: '/theory', element: TheoryManagementPage }
];

export const userRoutes = [
    { path: '/main', element: MainUserPage },
    { path: '/theory', element: TheoryPage }
];

export const publicRoutes = [
    { path: '/auth', element: AuthPage },
    { path: 'reset_password/:id/:token', element: ResetPasswordPage }
];