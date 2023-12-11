import { useCodeContext } from "../../contexts/CodeContext";
import { FC } from "react";

const SizeIndicator: FC = () => {
  const { previewWidth, previewHeight } = useCodeContext();
  return (
    <p className="flex-1 flex justify-end text-end text-white min-w-max">
      <span className="w-max no-drag">
        {previewWidth} x {previewHeight}
      </span>
    </p>
  );
};

export default SizeIndicator;
