import React, { useContext, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Context } from "../..";
import { observer } from "mobx-react-lite";

const NodesNamingSubpanel = () => {
    const { modalWinStore, problemManagementStore } = useContext(Context);

    useEffect(() => {
        if (problemManagementStore.networkConfig.isDigitLabelsOnly) {
            problemManagementStore.setNetworkConfig({ ...problemManagementStore.networkConfig, letter: '' });
        }
    }, [problemManagementStore.networkConfig.isDigitLabelsOnly]);

    const changeLetter = (letter) => {
        if (!letter || (letter.charCodeAt(0) >= 65 && letter.charCodeAt(0) <= 90 || letter.charCodeAt(0) >= 97 && letter.charCodeAt(0) <= 122)) {
            problemManagementStore.setNetworkConfig({ ...problemManagementStore.networkConfig, letter });
        }
        else {
            modalWinStore.setIsErrorType(true);
            modalWinStore.setTitle('Ошибка');
            modalWinStore.setBody('Допустимы только буквы латинского алфавита в верхнем/нижнем регистре!');
            problemManagementStore.setNetworkConfig({ ...problemManagementStore.networkConfig, letter: 'A' });
        }
    };

    return (
        <div className='d-flex flex-column'>
            <p className='main-font-bold fs-5 mb-0'>Наименование вершин:</p>
            <p className='sub-font-reg reg-font-color mb-2 fs-6'>*Введите латинскую букву</p>
            <input type="text" minLength={1} maxLength={1} className='main-border rounded-4 text-center w-25 mb-1 ms-auto me-auto'
                disabled={problemManagementStore.networkConfig.isDigitLabelsOnly}
                autoComplete="false"
                value={problemManagementStore.networkConfig.letter}
                onChange={(e) => changeLetter(e.target.value)} />
            <Form.Check
                type='checkbox'
                className='me-4'
                label='Только числовое обозначение'
                checked={problemManagementStore.networkConfig.isDigitLabelsOnly}
                value={problemManagementStore.networkConfig.isDigitLabelsOnly}
                onChange={(e) => problemManagementStore.setNetworkConfig({ ...problemManagementStore.networkConfig, isDigitLabelsOnly: e.target.checked })}
            />
            <Form.Check
                type='checkbox'
                className='me-4'
                label='Нумерация вершин с 0'
                checked={problemManagementStore.networkConfig.startsFromZero}
                value={problemManagementStore.networkConfig.startsFromZero}
                onChange={(e) => problemManagementStore.setNetworkConfig({ ...problemManagementStore.networkConfig, startsFromZero: e.target.checked })}
            />
        </div>
    );
};

export default observer(NodesNamingSubpanel);