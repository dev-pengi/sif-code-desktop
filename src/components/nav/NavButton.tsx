import { ReactNode } from "react";
import { FC } from "react";
import { Tooltip } from "react-tooltip";

interface NavButtonProps {
  Icon: FC;
  tooltip: string;
  id: string;
  iconSize?: number;
  link?: string;
  isDanger?: boolean;
  useTooltip?: boolean;
  onClick?: () => void;
}

const NavButton: FC<NavButtonProps> = ({
  Icon,
  tooltip,
  iconSize = 22,
  id,
  isDanger,
  useTooltip = true,
  onClick,
}) => {
  return (
    <>
      <button
        className={`no-drag-nav bg-transparent text-white ${
          isDanger ? "hover:bg-main-danger" : "hover:bg-main-lighter"
        } duration-75 rounded-md h-[70%] px-3 w-max flex justify-center items-center`}
        onClick={onClick}
        data-tooltip-id={id}
        data-tooltip-content={tooltip}
      >
        <div
          style={{
            width: `${iconSize}px`,
          }}
          className="flex justify-center items-center"
        >
          <Icon />
        </div>
      </button>
      {useTooltip && (
        <Tooltip
          place={"bottom"}
          offset={18}
          style={{ background: "#3498db" }}
          border={"#111111"}
          noArrow
          id={id}
        />
      )}
    </>
  );
};

export default NavButton;
