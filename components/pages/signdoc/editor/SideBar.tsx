import React, { useEffect, useState } from "react";
import { TbBookDownload } from "react-icons/tb";
import { FiSave } from "react-icons/fi";
import Tooltip from "@mui/material/Tooltip";
import { Button, Select, SelectItem } from "@heroui/react";

// import { DocData } from '@/interface/interface';
import { TextBoxIcon } from "../sidebaricons/textbox";
import { CheckBoxIcon } from "../sidebaricons/checkbox";
import { RadioBoxIcon } from "../sidebaricons/radiobox";
import { DropdownIcon } from "../sidebaricons/dropdownbox";
import { DateBoxIcon } from "../sidebaricons/datebox";
import { InitialsBoxIcon } from "../sidebaricons/initialsbox";

import ExportPopup from "./ExportPopup";

import { generateColorForRecipient, hexToRgba } from "@/utils/canvas/utils";
import Dot from "@/components/ui/dot";
import { DocData } from "@/interface/interface";
import { useCanvas } from "@/context/canvas";
import { pageHeight } from "@/constants/canvas";

type AnchorElement = HTMLElement | null;

type SideBarProps = {
  docData: DocData;
};

const SideBar: React.FC<SideBarProps> = ({ docData }) => {
  const contextValues = useCanvas();
  const [openColor, setOpenColor] = useState<AnchorElement>(null);
  const [openBorderColor, setOpenBorderColor] = useState<AnchorElement>(null);
  const [openStroke, setOpenStroke] = useState<AnchorElement>(null);
  const [openExporter, setOpenExporter] = useState<boolean>(false);

  const activeRecipient = contextValues.activeRecipient;

  useEffect(() => {
    if (docData.recipients.length)
      contextValues.setActiveRecipient(docData.recipients[0].email);
  }, [docData]);

  return (
    <div className="fixed z-50 top-20 md:top-20 left-0 md:h-[100vh] md:w-max h-[15vh] w-full flex md:flex-col flex-row items-center pl-6">
      <div
        className={` border max-h-[68vh] w-[246] flex md:flex-col flex-wrap flex-row items-start justify-center shadow-lg rounded-lg md:py-8 py-2 px-4 min-w-[8vw] gap-2 ${contextValues.theme ? "border-[rgba(36,36,36,0.5)] bg-[rgb(25,25,25)] text-white shadow-[0px_0px_8px_rgb(0,0,0)]" : "bg-white text-black"}`}
      >
        <ExportPopup
          className="text-[1.5rem] cursor-pointer"
          open={openExporter}
          setOpen={setOpenExporter}
        />

        {/* <Tooltip title="Sticky Notes">
                    <div>
                        <TfiNotepad className={`cursor-pointer text-[1.6rem]`} onClick={() => contextValues.addNote(contextValues.canvas!)} />
                    </div>
                </Tooltip>

                <Tooltip title="Square">
                    <div>
                        <BsSquare className='cursor-pointer text-[1.3rem]' onClick={() => contextValues.addRect(contextValues.canvas!)} />
                    </div>
                </Tooltip>*/}

        <h1>Adding fields for</h1>
        <div className="flex flex-col w-full">
          {/* <select className='border-1 rounded-lg p-2'>
                        <option>Myself</option>
                        <option>Myself</option>
                    </select> */}
          {docData.recipients.length ? (
            <Select
              aria-label="recipients"
              defaultSelectedKeys={[docData.recipients[0].email]}
              items={docData.recipients}
              renderValue={(items) => {
                return items.map((item) => (
                  <Dot
                    key={item.data?.email}
                    color={generateColorForRecipient(item.data!.email!)}
                    text={item.data!.name!}
                    textColor="text-text"
                  />
                ));
              }}
              onChange={(e) => contextValues.setActiveRecipient(e.target.value)}
            >
              {(item) => (
                <SelectItem key={item.email} textValue={item.email}>
                  {/* {item.name} */}
                  <Dot
                    color={generateColorForRecipient(item.email)}
                    text={item.name}
                    textColor="text-text"
                  />
                </SelectItem>
              )}
            </Select>
          ) : (
            ""
          )}
        </div>
        <h1>Fields</h1>
          <div className="flex flex-row items-center justify-center gap-1">
            {/* <CgFormatText className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.addText(contextValues.canvas!)} /> */}
            {/* <img src='/assets/img/controls/textbox.svg' className='cursor-pointer' onClick={() => contextValues.addText(contextValues.canvas!,100, 100, 4)}/>
                        <p className='text-text text-sm'>Textbox</p> */}
            <Button
              isIconOnly
              className="p-0 bg-white"
              size="sm"
              onPress={() =>
                contextValues.addText(
                  contextValues.canvas!,
                  300,
                  (contextValues.currPage - 1) * pageHeight + 100,
                )
              }
            >
              <TextBoxIcon
                fill={hexToRgba(
                  generateColorForRecipient(activeRecipient),
                  0.1,
                )}
                stroke={generateColorForRecipient(activeRecipient)}
              />
            </Button>
            <p className="text-text text-sm">Textbox</p>
          </div>
          <div className="flex flex-row items-center justify-center gap-1">
            {/* <CgFormatText className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.addText(contextValues.canvas!)} /> */}
            {/* <img src='/assets/img/controls/checkbox.svg' className='cursor-pointer' onClick={() => contextValues.addCheckbox(contextValues.canvas!, 100, 100, 4)}/> */}
            <Button
              isIconOnly
              className="p-0 bg-white"
              size="sm"
              onPress={() =>
                contextValues.addCheckbox(
                  contextValues.canvas!,
                  300,
                  (contextValues.currPage - 1) * pageHeight + 100,
                )
              }
            >
              <CheckBoxIcon
                fill={hexToRgba(
                  generateColorForRecipient(activeRecipient),
                  0.1,
                )}
                stroke={generateColorForRecipient(activeRecipient)}
              />
            </Button>
            <p className="text-text text-sm">Checkbox</p>
          </div>
          <div className="flex flex-row items-center justify-center gap-1">
            {/* <CgFormatText className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.addText(contextValues.canvas!)} /> */}
            {/* <img src='/assets/img/controls/radiobox.svg' className='cursor-pointer' onClick={() => contextValues.addRadiobox(contextValues.canvas!, 100, 100, 4)}/> */}
            <Button
              isIconOnly
              className="p-0 bg-white"
              size="sm"
              onPress={() =>
                contextValues.addRadiobox(
                  contextValues.canvas!,
                  300,
                  (contextValues.currPage - 1) * pageHeight + 100,
                )
              }
            >
              <RadioBoxIcon
                fill={hexToRgba(
                  generateColorForRecipient(activeRecipient),
                  0.1,
                )}
                stroke={generateColorForRecipient(activeRecipient)}
              />
            </Button>
            <p className="text-text text-sm">Radiobox</p>
          </div>
          <div className="flex flex-row items-center justify-center gap-1">
            {/* <CgFormatText className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.addText(contextValues.canvas!)} /> */}
            {/* <img src='/assets/img/controls/dropdown.svg' className='cursor-pointer' onClick={() => contextValues.addRadiobox(contextValues.canvas!, 100, 100, 4)}/> */}
            <Button
              isIconOnly
              className="p-0 bg-white"
              size="sm"
              onPress={() =>
                contextValues.addDropdownbox(
                  contextValues.canvas!,
                  300,
                  (contextValues.currPage - 1) * pageHeight + 100,
                )
              }
            >
              <DropdownIcon
                fill={hexToRgba(
                  generateColorForRecipient(activeRecipient),
                  0.1,
                )}
                stroke={generateColorForRecipient(activeRecipient)}
              />
            </Button>
            <p className="text-text text-sm">Dropdown</p>
          </div>
          <div className="flex flex-row items-center justify-center gap-1">
            {/* <CgFormatText className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.addText(contextValues.canvas!)} /> */}
            {/* <img src='/assets/img/controls/dropdown.svg' className='cursor-pointer' onClick={() => contextValues.addRadiobox(contextValues.canvas!, 100, 100, 4)}/> */}
            <Button
              isIconOnly
              className="p-0 bg-white"
              size="sm"
              onPress={() =>
                contextValues.addDatebox(
                  contextValues.canvas!,
                  300,
                  (contextValues.currPage - 1) * pageHeight + 100,
                )
              }
            >
              <DateBoxIcon
                fill={hexToRgba(
                  generateColorForRecipient(activeRecipient),
                  0.1,
                )}
                stroke={generateColorForRecipient(activeRecipient)}
              />
            </Button>
            <p className="text-text text-sm">Date</p>
          </div>
          <div className="flex flex-row items-center justify-center gap-1">
            {/* <CgFormatText className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.addText(contextValues.canvas!)} /> */}
            {/* <img src='/assets/img/controls/dropdown.svg' className='cursor-pointer' onClick={() => contextValues.addRadiobox(contextValues.canvas!, 100, 100, 4)}/> */}
            <Button
              isIconOnly
              className="p-0 bg-white"
              size="sm"
              onPress={() =>
                contextValues.addInitialsbox(
                  contextValues.canvas!,
                  300,
                  (contextValues.currPage - 1) * pageHeight + 100,
                )
              }
            >
              <InitialsBoxIcon
                fill={hexToRgba(
                  generateColorForRecipient(activeRecipient),
                  0.1,
                )}
                stroke={generateColorForRecipient(activeRecipient)}
              />
            </Button>
            <p className="text-text text-sm">Initials</p>
          </div>
      </div>
    </div>
  );
};

export default SideBar;
