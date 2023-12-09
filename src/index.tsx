import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "react-contexify/dist/ReactContexify.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import FilesProvider from "./contexts/FilesContext";
import CodeProvider from "./contexts/CodeContext";
import { Toaster } from "react-hot-toast";
import { Theme } from "@radix-ui/themes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <>
    <Toaster position="bottom-left" reverseOrder={true} />
    <FilesProvider>
      <CodeProvider>
        <HashRouter>
          <Theme>
            <Routes>
              <Route Component={App} path="*" />
            </Routes>
          </Theme>
        </HashRouter>
      </CodeProvider>
    </FilesProvider>
  </>
);
