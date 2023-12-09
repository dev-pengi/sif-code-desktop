import { FC } from "react";
import CreateFileMenu from "./CreateFileMenu";
import { useCodeContext } from "../../contexts/CodeContext";
import { PlusIcon } from "../../assets";

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
          <div
            className="w-[18px]"
            style={{
              color: theme === "dark" ? "#ffffff" : "#383838",
            }}
          >
            <PlusIcon />
          </div>
        </button>
        {/* <div className="w-[50px] h-full bg-transparent"></div> */}
      </CreateFileMenu>
    </>
  );
};

export default CreateFile;
