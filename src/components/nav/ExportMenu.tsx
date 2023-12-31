

import { FilesIcon, HtmlIcon, ShareIcon, SifFileIcon, ZipIcon } from "../../assets";
import {
  downloadFilesAsZip,
  linkFiles,
  exportAsSif,
  ExportAsHtml,
  convertToBinary,
  copyText,
  parseBinarySif,
} from "../../utils";
import axios from "axios";
import { FC, useEffect, useRef, useState } from "react";
import { Item, Menu, Separator, useContextMenu } from "react-contexify";
import toast from "react-hot-toast";
import { useFilesContext } from "../../contexts/FilesContext";
const MENU_ID = "download_menu";

interface DownloadMenuProps {
  showOnclick?: boolean;
  showOnDoubleClick?: boolean;
  showOnContextMenu?: boolean;
  children: React.ReactNode;
}

const DownloadMenu: FC<DownloadMenuProps> = ({
  showOnclick = true,
  showOnDoubleClick,
  showOnContextMenu,
  children,
}) => {
  const { files, setFiles, projectName, setProjectName } = useFilesContext();
  const fileRef = useRef(null);

  const { show } = useContextMenu({
    id: MENU_ID,
  });
  function displayMenu(e: any): any {
    show({
      event: e,
    });
  }
  const handleZipExport = async () => {
    const linkedFiles = await linkFiles(files, projectName);
    downloadFilesAsZip(linkedFiles, projectName);
    toast.success("Project downloaded successfully");
  };

  const handleSifExport = () => {
    exportAsSif(files, projectName);
    toast.success("Project exported successfully");
  };

  const handleHtmlExport = () => {
    ExportAsHtml(files, projectName);
    toast.success("Project exported successfully");
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "z") {
        handleZipExport();
      } else if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "s") {
        handleSifExport();
      } else if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "h") {
        handleHtmlExport();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const receiveShortcutMessage = (event: MessageEvent) => {
    const action = event.data;

    if (action === "exportZip") {
      handleZipExport();
    }
  };

  useEffect(() => {
    window.addEventListener("message", receiveShortcutMessage);
    return () => {
      window.removeEventListener("message", receiveShortcutMessage);
    };
  }, []);

  const handleFileBrowsing = () => {
    if (!fileRef.current) return;
    const fileInput = fileRef.current as HTMLInputElement;
    fileInput.value = "";
    fileInput.click();
  };

  const handleFileChange = async () => {
    if (!fileRef.current) return toast.error("error");
    const fileInput = fileRef.current as HTMLInputElement;
    if (!fileInput || !fileInput.files) {
      toast.error("No file selected");
      return;
    }

    const selectedFile = fileInput.files[0];
    const fileName = selectedFile.name;

    if (!fileName.endsWith(".sif")) {
      toast.error("Invalid file format. Please select a .sif file.");
      return;
    }

    const handleImport = async () => {
      const fileData = await readFileData(selectedFile);
      const jsonData = parseBinarySif(fileData);
      setFiles(jsonData.files);
      setProjectName(jsonData.projectName);
    };

    toast.promise(handleImport(), {
      loading: "Decoding the file...",
      success: <>Project has been imported!</>,
      error: <>Error decoding imported file!.</>,
    });
  };
  const readFileData = (file: any) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result as string;
        resolve(result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsText(file);
    });
  };

  return (
    <>
      <div
        onClick={showOnclick ? displayMenu : () => {}}
        onDoubleClick={showOnDoubleClick ? displayMenu : () => {}}
        onContextMenu={showOnContextMenu ? displayMenu : () => {}}
        className="h-full flex items-center justify-center"
      >
        {children}
      </div>
      <Menu id={MENU_ID} theme="dark" animation={false}>
        <Item onClick={handleFileBrowsing}>
          <div className="w-[25px]">
            <FilesIcon />
          </div>
          <span className="ml-[10px]">Import Project</span>
        </Item>
        <Separator />
        <Item onClick={handleZipExport}>
          <div className="w-[25px]">
            <ZipIcon />
          </div>
          <span className="ml-[10px]">
            <span>Export as</span> <span className="font-bold ml-1">ZIP</span>
          </span>
        </Item>
        <Item onClick={handleHtmlExport}>
          <div className="w-[25px]">
            <HtmlIcon />
          </div>
          <span className="ml-[10px]">
            <span>Export as</span> <span className="font-bold ml-1">HTML</span>
          </span>
        </Item>
        <Separator />
        <Item onClick={handleSifExport}>
          <div className="w-[25px]">
            <SifFileIcon />
          </div>
          <span className="ml-[10px]">
            <span>Export as</span> <span className="font-bold ml-1"> .sif</span>
          </span>
        </Item>
      </Menu>
      <input
        type="file"
        ref={fileRef}
        accept=".sif"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default DownloadMenu;
