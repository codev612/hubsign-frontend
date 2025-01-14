"use client";

import { memo } from "react";
import Image from "next/image";

// import { NewThread } from "./comments/NewThread";
// import ActiveUsers from "./users/ActiveUsers";
import { Button as UIBtn} from "./ui/button";
import { Button } from "@nextui-org/button";
import ShapesMenu from "./ShapesMenu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
          <Tooltip key={item.name}>
            <TooltipTrigger>
              <li
                className={`group px-2.5 py-5 flex justify-center items-center
            ${isActive(item.value) ? "bg-primary-green" : "hover:bg-primary-grey-200"}
            `}
                // onClick={() => {
                //   if (Array.isArray(item.value)) return;
                //   handleActiveElement(item);
                // }}
              >
                {/* If value is an array means it's a nav element with sub options i.e., dropdown */}
                {Array.isArray(item.value) ? (
                  <ShapesMenu
                    activeElement={activeElement}
                    handleActiveElement={handleActiveElement}
                    // handleImageUpload={handleImageUpload}
                    imageInputRef={imageInputRef}
                    item={item}
                  />
                ) : item?.value === "comments" ? (
                  // If value is comments, trigger the NewThread component
                  // <NewThread>
                    <Button 
                    className="relative w-5 h-5 object-contain" 
                    >
                      <Image
                        fill
                        alt={item.name}
                        className={isActive(item.value) ? "invert" : ""}
                        src={item.icon}
                      />
                    </Button>
                  // </NewThread>
                ) : (
                  <Button className="relative w-5 h-5 object-contain">
                    <Image
                      fill
                      alt={item.name}
                      className={isActive(item.value) ? "invert" : ""}
                      src={item.icon}
                    />
                  </Button>
                )}
              </li>
            </TooltipTrigger>
            <TooltipContent
            //  className="border-none bg-primary-grey-200 px-4 py-2 text-xs"
             >
              {item.name}
            </TooltipContent>
          </Tooltip>
        ))}
      </ul>

      {/* <ActiveUsers /> */}
    </nav>
  );
};

export default memo(
  Navbar,
  (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement,
);
