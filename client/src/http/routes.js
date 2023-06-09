import AuthPage from "../pages/AuthPage";
import AdminPage from "../pages/AdminPage";
import MainUserPage from "../pages/MainUserPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import TheoryManagementPage from "../pages/TheoryManagementPage";
import TheoryPage from "../pages/TheoryPage";
import ProblemPage from "../pages/ProblemPage";
import ProblemsListPage from "../pages/ProblemsListPage";
import ProblemsListManagementPage from "../pages/ProblemsListManagementPage";
import ProblemManagementPage from "../pages/ProblemManagemtentPage";
import QuestionsListManagementPage from "../pages/QuestionsListManagementPage";
import TheoryQuestionManagementPage from "../pages/TheoryQuestionManagementPage";
import InteractiveQuestionManagementPage from "../pages/InteractiveQuestionManagementPage";
import TestSelectionPage from "../pages/TestSelectionPage";
import TestSolvingPage from "../pages/TestSolvingPage";
import PersonalAccountPage from "../pages/PersonalAccountPage";

export const adminRoutes = [
    { path: '/main', element: AdminPage }
];

export const moderatorRoutes = [
    { path: '/theory', element: TheoryManagementPage },
    { path: '/questions', element: QuestionsListManagementPage },
    { path: '/questions/theoretical/:id', element: TheoryQuestionManagementPage },
    { path: '/questions/interactive/new', element: InteractiveQuestionManagementPage },
    { path: '/practice', element: ProblemsListManagementPage },
    { path: '/practice/:id', element: ProblemManagementPage }
];

export const userRoutes = [
    { path: '/main', element: MainUserPage },
    { path: '/theory', element: TheoryPage },
    { path: '/tests', element: TestSelectionPage },
    { path: '/tests/testing', element: TestSolvingPage },
    { path: '/practice', element: ProblemsListPage },
    { path: '/practice/:id', element: ProblemPage },
    { path: '/me', element: PersonalAccountPage }
];

export const publicRoutes = [
    { path: '/auth', element: AuthPage },
    { path: 'reset_password/:id/:token', element: ResetPasswordPage }
];