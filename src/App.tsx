import React, { useState, useEffect } from "react";
import loadable from "@loadable/component";
import SessionRouter from "./Router/SessionRouter";
import AppRouter from "./Router/AppRouter";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./Redux/actions";
import { useAbortableEffect, statusType } from "./Common/utils";
import axios from "axios";

const Loading = loadable(() => import("./Components/Common/Loading"));

const App: React.FC = () => {
  const dispatch: any = useDispatch();
  const state: any = useSelector((state) => state);
  const { currentUser } = state;
  const [user, setUser] = useState(null);

  const updateRefreshToken = () => {
    const refresh = localStorage.getItem("care_refresh_token");
    const access = localStorage.getItem("care_access_token");
    if (!access && refresh) {
      localStorage.removeItem("care_refresh_token");
      document.location.reload();
      return;
    }
    if (!refresh) {
      return;
    }
    axios
      .post("/api/v1/auth/token/refresh/", {
        refresh,
      })
      .then((resp: any) => {
        localStorage.setItem("care_access_token", resp.data.access);
        localStorage.setItem("care_refresh_token", resp.data.refresh);
      })
      .catch((ex: any) => {
        // console.error('Error while refreshing',ex);
      });
  };
  useEffect(() => {
    updateRefreshToken();
    setInterval(updateRefreshToken, 5 * 60 * 1000);
  }, [user]);

  useAbortableEffect(
    async (status: statusType) => {
      const res = await dispatch(getCurrentUser());
      if (!status.aborted && res && res.statusCode === 200) {
        setUser(res.data);
      }
    },
    [dispatch]
  );

  if (!currentUser || currentUser.isFetching) {
    return <Loading />;
  }
  if (currentUser && currentUser.data) {
    return <AppRouter />;
  } else {
    return <SessionRouter />;
  }
};

export default App;
