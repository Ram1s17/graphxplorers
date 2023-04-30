import React, { useContext, useEffect } from "react";
import './styles/app.css'
import './styles/content-styles.css'
import './styles/authPage.css'
import './styles/problemPage.css'
import AppRouter from "./components/common/AppRouter";
import { observer } from "mobx-react-lite";
import { Context } from ".";
import ApiErrorsToast from "./components/common/UI/ApiErrorsToast";
import SuccessResponseModal from "./components/common/UI/SuccessResponseModal";
import ErrorResponseModal from "./components/common/UI/ErrorResponseModal";
import LoadingSpinner from "./components/common/UI/LoadingSpinner";
import ResultModal from "./components/common/UI/ResultModal";

const App = observer(() => {
  const { store } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
    else {
      store.setIsLoading(false);
    }
  }, [store]);

  if (store.isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <>
      <AppRouter />
      <ApiErrorsToast />
      <SuccessResponseModal />
      <ErrorResponseModal />
      <ResultModal />
    </>
  );
});

export default App;
