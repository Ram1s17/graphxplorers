import AuthPage from "../pages/AuthPage";
import AdminPage from "../pages/AdminPage";
import MainUserPage from "../pages/MainUserPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import TheoryManagementPage from "../pages/TheoryManagementPage";
import TheoryPage from "../pages/TheoryPage";
import ProblemPage from "../pages/ProblemPage";
import ProblemsListPage from "../pages/ProblemsListPage";
import ProblemsListManagementPage from "../pages/ProblemsListManagementPage";

export const adminRoutes = [
    { path: '/main', element: AdminPage }
];

export const moderatorRoutes = [
    { path: '/theory', element: TheoryManagementPage },
    { path: '/practice', element: ProblemsListManagementPage },
];

export const userRoutes = [
    { path: '/main', element: MainUserPage },
    { path: '/theory', element: TheoryPage },
    { path: '/practice', element: ProblemsListPage },
    { path: '/practice/:id', element: ProblemPage }
];

export const publicRoutes = [
    { path: '/auth', element: AuthPage },
    { path: 'reset_password/:id/:token', element: ResetPasswordPage }
];