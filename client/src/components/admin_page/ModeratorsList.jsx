import React, { useEffect, useState } from "react";
import cl from '../../styles/AdminPage.module.css'
import ConfirmationModal from "../common/UI/ConfirmationModal/ConfirmationModal";

const ModeratorsList = ({ moderators, query, setQuery, remove }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({ title: '', body: ''});
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [deletedModerId, setDeletedModerId] = useState(0);

    useEffect(() => {
        if (isConfirmed) 
            remove(deletedModerId);
    }, [isConfirmed]);

    const removeHandler = (moderator) => {
        setIsConfirmed(false);
        setModalInfo({...modalInfo, title: `Вы точно хотите удалить модератора ${moderator.user_name}?`});
        setDeletedModerId(moderator.user_id);
        setShowModal(true);  
    };

    return (
        <div className={`${cl.moderatorsList} d-flex flex-column align-items-center rounded-4 main-border w-100`}>
            <input type='search' placeholder='Поиск...' className='mb-3 w-100 rounded-4 p-2 sub-font-reg reg-font-color'
                value={query} onChange={(e) => setQuery(e.target.value)}/>
            <div className='w-100 d-flex flex-column align-items-center'>
                {moderators.length !== 0 ? moderators.map((moderator) => 
                    <div key={moderator.user_id} className={`${cl.listItem} w-100 pt-2 pb-2`}>
                        <div className='ps-3 d-flex flex-column justify-content-center main-font-bold'>
                            <i className="bi bi-person-vcard"></i>
                            {moderator.user_id}
                        </div>
                        <div className='d-flex flex-column justify-content-center'>
                            <p className='sub-font-reg'>{moderator.user_name}</p>
                            <p className='sub-font-reg'>{moderator.user_email}</p>
                        </div>
                        <div onClick={() => removeHandler(moderator)} className='d-flex flex-column justify-content-center'>
                            <i className={`${cl.removeButton} bi bi-trash`}></i>
                        </div>
                    </div>
                )
                : 
                    <div className='h-100 d-flex flex-column align-items-center justify-content-center'>
                        <i className="bi bi-person-lines-fill fs-2"></i>
                        <p className='sub-font-reg fs-6'>Модераторов не найдено</p>
                    </div>
                }
            </div>
            <ConfirmationModal showModal={showModal} setShowModal={setShowModal} title={modalInfo.title} body={modalInfo.body} setIsConfirmed={setIsConfirmed}></ConfirmationModal>
        </div>
    );
};

export default ModeratorsList;