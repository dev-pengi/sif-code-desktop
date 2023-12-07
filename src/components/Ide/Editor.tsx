import { useEffect, useState } from "react";
import MonacoEditor, { loader } from "@monaco-editor/react";

import * as Emmets from "emmet-monaco-es";
import FilesBar from "./FilesBar";
import { File } from "../../constants";
import { useFilesContext } from "../../contexts/FilesContext";
import { useCodeContext } from "../../contexts/CodeContext";

const { app } = window.require("@electron/remote");
const path = window.require("path");

interface EditorProps {
  width: number | string;
  height?: number | string;
}

const Editor: React.FC<EditorProps> = ({ width, height }) => {
  const { files, setFiles, activeFile, setActiveFile, setIsLoaded } =
    useFilesContext();
  const { theme, reversedView, smallScreen, fullScreenMode } = useCodeContext();
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    if (!smallScreen) return setShowEditor(true);
    setShowEditor(!reversedView);
  }, [reversedView, smallScreen]);

  useEffect(() => {
    if (activeFile) {
      const file: File = files.find(
        (file: File) => file.name === activeFile
      ) as File;
      if (file) {
        setCurrentFile(file);
      }
    }
  }, [activeFile, files]);

  const handleCodeChange = (value: string | undefined) => {
    if (currentFile) {
      const newFile: File = {
        ...currentFile,
        content: value as string,
      };
      const newFiles = files.map((file) => {
        if (file.name === currentFile.name) {
          return newFile;
        }
        return file;
      });
      setActiveFile(currentFile.name);
      setCurrentFile(newFile);
      setFiles(newFiles);
    }
  };

  const handleEditorDidMount = () => {
    Emmets.emmetHTML(window.monaco);
    Emmets.emmetCSS(window.monaco);
  };

  const fullEditorStyle = {
    width: "100vw",
    height: "100vh",
    position: "fixed",
    top: "0",
    left: 0,
    zIndex: 100,
  };
  const editorStyle = {
    width: smallScreen ? "100%" : width,
    height: smallScreen ? "100%" : height,
  };

  const currentPath = app.getAppPath();

  useEffect(() => {
    function ensureFirstBackSlash(str) {
      return str.length > 0 && str.charAt(0) !== "/" ? "/" + str : str;
    }

    function uriFromPath(_path) {
      const pathName = path.resolve(_path).replace(/\\/g, "/");
      return encodeURI("file://" + ensureFirstBackSlash(pathName));
    }
    const uri = uriFromPath(
      path.join(currentPath, "node_modules/monaco-editor/min/vs")
    );

    loader.config({
      paths: {
        vs: uri,
      },
    });
    loader.init().then(() => {
      setIsLoaded(true);
    });
  }, []);

  return (
    <>
      {showEditor && (
        <div style={fullScreenMode === "code" ? fullEditorStyle : editorStyle}>
          <FilesBar />
          <div
            className="h-[calc(100%-50px)] w-full mt-[50x]"
            style={{
              height: "calc(100% - 50px)",
            }}
          >
            <MonacoEditor
              className=""
              width={"100%"}
              height={"100%"}
              theme={`vs-${theme}`}
              path={`${currentFile?.name}-${currentFile?.id}`}
              language={
                currentFile?.type == "js" ? "javascript" : currentFile?.type
              }
              value={currentFile?.content}
              onMount={handleEditorDidMount}
              onChange={handleCodeChange}
              options={
                {
                  minimap: {
                    enabled: fullScreenMode === "code",
                  },
                  fontSize: 16,
                } as any
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Editor;
