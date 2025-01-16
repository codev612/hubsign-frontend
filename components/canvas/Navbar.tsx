"use client";

import { memo } from "react";
import Image from "next/image";

// import { NewThread } from "./comments/NewThread";
// import ActiveUsers from "./users/ActiveUsers";
import { Button as UIBtn} from "./ui/button";
import { Button } from "@nextui-org/button";
import ShapesMenu from "./ShapesMenu";
// import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

import { navElements } from "@/constants/canvas";
import { ActiveElement, NavbarProps } from "@/types/canvas";
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import RedoOutlinedIcon from '@mui/icons-material/RedoOutlined';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import ZoomOutOutlinedIcon from '@mui/icons-material/ZoomOutOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';

const buttonConfig = [
  {
    icons: [<UndoOutlinedIcon fontSize="small" />, <RedoOutlinedIcon fontSize="small" />],
  },
  {
    icons: [<ZoomOutOutlinedIcon fontSize="small" />, <ZoomInOutlinedIcon fontSize="small" />],
  },
  {
    icons: [<FileDownloadOutlinedIcon fontSize="small" />],
  },
  {
    icons: [<PostAddOutlinedIcon fontSize="small" />],
  },
];

const Navbar = ({
  activeElement,
  imageInputRef,
  // handleImageUpload,
  handleActiveElement,
}: NavbarProps) => {
  const isActive = (value: string | Array<ActiveElement>) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) &&
      value.some((val) => val?.value === activeElement?.value));

  return (
    <nav className="flex items-center sticky w-full justify-between gap-4 bg-white border-b-1 rounded-tr-lg rounded-tl-lg">
      <ul className="flex flex-row items-center">
        {buttonConfig.map((config, index) => (
          <li key={index} className={`border-r-1 h-[24] pr-[20] pl-[20] ${index === buttonConfig.length - 1 ? '' : 'border-r-1'}`}>
            {config.icons.map((icon, idx) => (
              <Button
                key={idx}
                isIconOnly
                className="bg-white rounded-md h-[24] w-[24] text-text"
                size="sm"
                startContent={icon}
              />
            ))}
          </li>
        ))}
      </ul>
      <ul className="flex flex-row">
        {navElements.map((item: ActiveElement | any) => (
          <div key={item.name}>
            {Array.isArray(item.value) ? (
              <ShapesMenu
                activeElement={activeElement}
                handleActiveElement={handleActiveElement}
                // handleImageUpload={handleImageUpload}
                imageInputRef={imageInputRef}
                item={item}
              />
            ) : ""}
          </div>
        ))}
      </ul>
    </nav>
  );
};

export default memo(
  Navbar,
  (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement,
);
