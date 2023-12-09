import { FC, useState } from "react";
import * as assets from "../../assets";

import {
  Menu,
  Item,
  Separator,
  useContextMenu,
  Submenu,
} from "react-contexify";
import ShortcutGuid from "./ShortcutsGuide";
import { initialFiles } from "../../constants";
import { useCodeContext } from "../../contexts/CodeContext";
import { useFilesContext } from "../../contexts/FilesContext";
const MENU_ID = "info-menu";

interface NavMenuProps {
  showOnclick?: boolean;
  showOnDoubleClick?: boolean;
  showOnContextMenu?: boolean;
  children: React.ReactNode;
}

const NavMenu: FC<NavMenuProps> = ({
  showOnclick = true,
  showOnDoubleClick,
  showOnContextMenu,
  children,
}) => {
  const { smallScreen, setTheme, setPreviewKey, theme } = useCodeContext();
  const { setProjectName, setFiles } = useFilesContext();
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const openShortcuts = (): void => {
    setShortcutsOpen(true);
  };

  function closeShortcuts() {
    setShortcutsOpen(false);
  }

  const { show } = useContextMenu({
    id: MENU_ID,
  });
  function displayMenu(e: any): any {
    show({
      event: e,
    });
  }
  const handleDarkTheme = () => {
    setTheme("dark");
  };
  const handleLightTheme = () => {
    setTheme("light");
  };

  const handleReset = () => {
    setFiles(initialFiles);
    setProjectName("My New Project");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/");
    }
  };

  const handleRecompile = () => {
    setPreviewKey((prev) => prev + 1);
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
        <Item onClick={handleRecompile}>
          <div className="w-[22px]">
            <assets.PlayIcon />
          </div>
          <span className="ml-[10px]">Recompile Project</span>
        </Item>
        <Separator />
        {smallScreen ? (
          <>
            <Item onClick={handleDarkTheme}>
              <div className="w-[22px]">
                {theme === "dark" && <assets.CheckIcon />}
              </div>
              <span className="ml-[10px]">Dark Theme</span>
            </Item>
            <Item onClick={handleLightTheme}>
              <div className="w-[22px]">
                {theme === "light" && <assets.CheckIcon />}
              </div>
              <span className="ml-[10px]">Light Theme</span>
            </Item>
          </>
        ) : (
          <Submenu
            label={
              <>
                <div className="w-[22px]">
                  <assets.ThemeIcon />
                </div>
                <span className="ml-[10px]">Theme</span>
              </>
            }
          >
            <Item onClick={handleDarkTheme} closeOnClick={false}>
              <div className="w-[22px]">
                {theme === "dark" && <assets.CheckIcon />}
              </div>
              <span className="ml-[10px]">Dark Theme</span>
            </Item>
            <Item onClick={handleLightTheme} closeOnClick={false}>
              <div className="w-[22px]">
                {theme === "light" && <assets.CheckIcon />}
              </div>
              <span className="ml-[10px]">Light Theme</span>
            </Item>
          </Submenu>
        )}
        {/* <Separator /> */}
        <Item onClick={openShortcuts}>
          <div className="w-[25px]">
            <assets.ShortcutIcon />
          </div>
          <span className="ml-[10px]">keyboard shortcuts</span>
        </Item>

        <Separator />

        <Item onClick={handleReset} className="danger">
          <div className="w-[25px]">
            <assets.DeleteIcon />
          </div>
          <span className="ml-[10px]">Reset Project</span>
        </Item>
      </Menu>
      <ShortcutGuid
        closeModal={closeShortcuts}
        openModal={openShortcuts}
        modalIsOpen={shortcutsOpen}
      />
    </>
  );
};

export default NavMenu;
