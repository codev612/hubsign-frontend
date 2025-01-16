"use client";

import { Button } from "@nextui-org/button";
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

const ControlBar = () => {

  return (
    <section className="flex items-center w-full justify-between gap-4 bg-white border-b-1 rounded-tr-lg rounded-tl-lg pt-2 pb-2">
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
    </section>
  );
};

export default ControlBar;
