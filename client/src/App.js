import React, { useContext, useEffect } from "react";
import './styles/app.css'
import './styles/authPage.css'
import AppRouter from "./components/common/AppRouter";
import { observer } from "mobx-react-lite";
import { Context } from ".";
import ApiErrorsToast from "./components/common/UI/ApiErrorsToast";
import SuccessResponseModal from "./components/common/UI/SuccessResponseModal";
import ErrorResponseModal from "./components/common/UI/ErrorResponseModal";

const App = observer(() => {
  const { store } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, [store]);

  return (
    <>
      <AppRouter />
      <ApiErrorsToast />
      <SuccessResponseModal/>
      <ErrorResponseModal/>
    </>
  );
});

export default App;
