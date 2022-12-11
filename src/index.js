import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import store from "./app/store";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";

import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import "./styles/reset.css";
import "./styles/main.css";
import "./styles/utils.scss";
import "./components/Header/header.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

const persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
