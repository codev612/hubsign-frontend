"use client";

import { Button } from "@heroui/button";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import RedoOutlinedIcon from "@mui/icons-material/RedoOutlined";
import ZoomInOutlinedIcon from "@mui/icons-material/ZoomInOutlined";
import ZoomOutOutlinedIcon from "@mui/icons-material/ZoomOutOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";

import { DocData } from "@/interface/interface";

const handleSaveDraft = () => {
  console.log("savedraft");
};

type ControlBarProps = {
  docData: DocData;
  exportPDF: () => Promise<void>;
};

const ControlBar: React.FC<ControlBarProps> = ({ docData, exportPDF }) => {
  const buttonConfig = [
    {
      icons: [
        <UndoOutlinedIcon key="undo" fontSize="small" />,
        <RedoOutlinedIcon key="redo" fontSize="small" />,
      ],
    },
    {
      icons: [
        <ZoomOutOutlinedIcon key="zoom-out" fontSize="small" />,
        <ZoomInOutlinedIcon key="zoom-in" fontSize="small" />,
      ],
    },
    {
      icons: [<FileDownloadOutlinedIcon key="download" fontSize="small" />],
      action: [exportPDF],
    },
    {
      icons: [<PostAddOutlinedIcon key="post-add" fontSize="small" />],
    },
    {
      icons: [<DraftsOutlinedIcon key="draft" fontSize="small" />],
      action: [handleSaveDraft],
    },
  ];

  return (
    <section className="flex items-center w-full justify-between gap-4 bg-white border-b-1 rounded-tr-lg rounded-tl-lg pt-2 pb-2">
      <ul className="flex flex-row items-center">
        {buttonConfig.map((config, index) => (
          <li
            key={`button-group-${index}`} // ✅ Unique key for <li>
            className={`h-[24] pr-[20] pl-[20] ${
              index === buttonConfig.length - 1 ? "" : "border-r-1"
            }`}
          >
            {config.icons.map((icon, idx) => {
              const action = config.action?.[idx] || (() => {});

              return (
                <Button
                  key={`button-${index}-${idx}`} // ✅ Unique key for each button
                  isIconOnly
                  className="bg-white rounded-md h-[24] w-[24] text-text"
                  size="sm"
                  startContent={icon}
                  onPress={action}
                />
              );
            })}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ControlBar;
