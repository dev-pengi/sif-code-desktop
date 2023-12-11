import { useEffect, useState } from "react";
import { IDE, Nav, PreLoader } from "./components";
import { useFilesContext } from "./contexts/FilesContext";

const { ipcRenderer } = window.require("electron");

export default function App() {
  const [isMainLoaded, setIsMainLoaded] = useState(false);
  const { isLoaded, isImported } = useFilesContext();

  useEffect(() => {
    if (isLoaded && isImported) ipcRenderer.send("editor-loaded");
  }, [isLoaded, isImported]);
  ipcRenderer.on("editor-loaded-finished", () => {
    setIsMainLoaded(true);
  });
  return (
    <>
      {!isMainLoaded && <PreLoader />}
      <div
        className="bg-main"
        style={{ visibility: isMainLoaded ? "visible" : "hidden" }}
      >
        <Nav />
        <IDE />
      </div>
    </>
  );
}
