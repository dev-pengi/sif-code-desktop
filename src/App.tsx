import { IDE, Nav, PreLoader } from "./components";
import { useFilesContext } from "./contexts/FilesContext";

export default function App() {
  const { isLoaded, isImported } = useFilesContext();
  return (
    <>
      {!isLoaded || !isImported && <PreLoader />}
      <div
        className="bg-main"
        style={{ visibility: isLoaded && isImported ? "visible" : "hidden" }}
      >
        <Nav />
        <IDE />
      </div>
    </>
  );
}
