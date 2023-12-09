

import * as assets from "../../assets";
import { toast } from "react-hot-toast";
import { FC } from "react";
import CreateFileMenu from "./CreateFileMenu";
import { useCodeContext } from "../../contexts/CodeContext";

const CreateFile: FC = () => {
  const { theme } = useCodeContext();
  return (
    <>
      <CreateFileMenu showOnContextMenu showOnclick>
        <button
          className={`ml-[10px] h-max p-1 rounded-sm`}
          style={{
            background: theme === "dark" ? "#1f1f1f" : "#ffffff",
          }}
        >
          <img
            src={assets.plusIcon}
            alt="plus icon"
            width={18}
            className="min-w-[18px]"
          />
        </button>
        {/* <div className="w-[50px] h-full bg-transparent"></div> */}
      </CreateFileMenu>
    </>
  );
};

export default CreateFile;
