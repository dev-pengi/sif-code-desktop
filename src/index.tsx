import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "react-contexify/dist/ReactContexify.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import FilesProvider from "./contexts/FilesContext";
import CodeProvider from "./contexts/CodeContext";
import {Toaster} from 'react-hot-toast';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <>
    <Toaster />
    <FilesProvider>
      <CodeProvider>
        <HashRouter>
          <Routes>
            <Route Component={App} path="*" />
          </Routes>
        </HashRouter>
      </CodeProvider>
    </FilesProvider>
  </>
);
