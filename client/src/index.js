import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import Store from './store/store';
import { BrowserRouter } from 'react-router-dom';
import ModalWinStore from './store/modalWinStore';

export const store = new Store();
export const modalWinStore = new ModalWinStore();

export const Context = createContext({
    store,
    modalWinStore
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{ store, modalWinStore }}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Context.Provider>
);
