import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import Store from './store/store';
import { BrowserRouter } from 'react-router-dom';
import ModalWinStore from './store/modalWinStore';
import ProblemSolvingStore from './store/problemSolvingStore';
import ProblemManagementStore from './store/problemManagementStore';
import QuestionManagementStore from './store/questionManagementStore';
import TestSolvingStore from './store/testSolvingStore';

export const store = new Store();
export const modalWinStore = new ModalWinStore();
export const testSolvingStore = new TestSolvingStore();
export const questionManagementStore = new QuestionManagementStore();
export const problemSolvingStore = new ProblemSolvingStore();
export const problemManagementStore = new ProblemManagementStore();

export const Context = createContext({
    store,
    modalWinStore,
    testSolvingStore,
    questionManagementStore,
    problemSolvingStore,
    problemManagementStore
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{ store, modalWinStore, testSolvingStore, questionManagementStore, problemSolvingStore, problemManagementStore }}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Context.Provider>
);
