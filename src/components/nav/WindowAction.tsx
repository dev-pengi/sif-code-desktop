import { FC } from "react";
import NavButton from "./NavButton";
import { CloseIcon, MaximizeIcon, MinimizeIcon } from "../../assets";
const { ipcRenderer } = window.require("electron");

const WindowAction: FC = () => {
  const handleWinClose = () => {
    ipcRenderer.send("close");
  };
  const handleWinMaximize = () => {
    ipcRenderer.send("maximize");
  };
  const handleWinMinimize = () => {
    ipcRenderer.send("minimize");
  };
  return (
    <div className="flex-1 flex gap-2 flex-row items-center justify-end h-full">
      <NavButton
        Icon={MinimizeIcon}
        onClick={handleWinMinimize}
        useTooltip={false}
        iconSize={15}
        tooltip="minimize"
        id="minimize"
      />
      <NavButton
        Icon={MaximizeIcon}
        onClick={handleWinMaximize}
        useTooltip={false}
        tooltip="maximize"
        iconSize={15}
        id="maximize"
      />
      <NavButton
        Icon={CloseIcon}
        isDanger
        onClick={handleWinClose}
        useTooltip={false}
        iconSize={18}
        tooltip="close"
        id="close"
      />
    </div>
  );
};

export default WindowAction;
