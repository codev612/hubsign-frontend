import React, { useEffect, useState } from 'react';
import { CgFormatText } from 'react-icons/cg';
import { TbBookDownload } from 'react-icons/tb';
import { BiHide, BiImageAdd, BiShow } from 'react-icons/bi';
import { BsBorderWidth, BsCircle, BsSquare } from 'react-icons/bs';
import { AiOutlineClear, AiOutlineDelete, AiOutlineHighlight } from 'react-icons/ai';
import { HiPencil } from 'react-icons/hi';
import { TfiNotepad } from 'react-icons/tfi';
import { FiSave } from 'react-icons/fi';
import { useCanvas } from '@/context/canvas';
import { Popover, Slider } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { SketchPicker, ColorResult } from 'react-color';
import ExportPopup from './ExportPopup';
import { Button, Select, SelectItem } from '@heroui/react';
import { DocData } from '@/interface/interface';
// import { DocData } from '@/interface/interface';
import Dot from '@/components/ui/dot';
import { generateColorForRecipient, hexToRgba } from '@/utils/canvas/utils';
import { TextBoxIcon } from '../sidebaricons/textbox';
import { CheckBoxIcon } from '../sidebaricons/checkbox';
import { RadioBoxIcon } from '../sidebaricons/radiobox';
import { DropdownIcon } from '../sidebaricons/dropdownbox';
import { DateBoxIcon } from '../sidebaricons/datebox';
import { InitialsBoxIcon } from '../sidebaricons/initialsbox';

type AnchorElement = HTMLElement | null;

type SideBarProps = {
    docData: DocData;
};

const SideBar: React.FC<SideBarProps> = ({docData}) => {
    const contextValues = useCanvas();
    const [openColor, setOpenColor] = useState<AnchorElement>(null);
    const [openBorderColor, setOpenBorderColor] = useState<AnchorElement>(null);
    const [openStroke, setOpenStroke] = useState<AnchorElement>(null);
    const [openExporter, setOpenExporter] = useState<boolean>(false);

    const activeRecipient = contextValues.activeRecipient;

    useEffect(()=>{
        if(docData.recipients.length) contextValues.setActiveRecipient(docData.recipients[0].email)
    }, [docData])

    return (
        <div className="fixed z-50 top-20 md:top-20 left-0 md:h-[100vh] md:w-max h-[15vh] w-full flex md:flex-col flex-row items-center pl-6">
            <div className={` border max-h-[68vh] w-[246] flex md:flex-col flex-wrap flex-row items-start justify-center shadow-lg rounded-lg md:py-8 py-2 px-4 min-w-[8vw] gap-2 ${contextValues.theme ? "border-[rgba(36,36,36,0.5)] bg-[rgb(25,25,25)] text-white shadow-[0px_0px_8px_rgb(0,0,0)]" : "bg-white text-black"}`}>

                <ExportPopup className="text-[1.5rem] cursor-pointer" open={openExporter} setOpen={setOpenExporter} />

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
                <div className='flex flex-col w-full'>
                    {/* <select className='border-1 rounded-lg p-2'>
                        <option>Myself</option>
                        <option>Myself</option>
                    </select> */}
                    {docData.recipients.length ? <Select 
                    aria-label="recipients" 
                    items={docData.recipients} 
                    defaultSelectedKeys={[docData.recipients[0].email]} 
                    onChange={(e)=>contextValues.setActiveRecipient(e.target.value)}
                    renderValue={(items)=>{
                        return items.map((item)=><Dot key={item.data?.email} text={item.data!.name!} color={generateColorForRecipient(item.data!.email!)} textColor='text-text' />)
                    }}
                    >
                        {(item) =>
                            <SelectItem key={item.email} value={item.email}>
                                {/* {item.name} */}
                                <Dot text={item.name} color={generateColorForRecipient(item.email)} textColor='text-text' />
                            </SelectItem>
                        }
                    </Select> : ""}
                </div>
                <h1>Fields</h1>
                <Tooltip title="TextBox">
                    <div className='flex flex-row items-center justify-center gap-1'>
                        {/* <CgFormatText className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.addText(contextValues.canvas!)} /> */}
                        {/* <img src='/assets/img/controls/textbox.svg' className='cursor-pointer' onClick={() => contextValues.addText(contextValues.canvas!,100, 100, 4)}/>
                        <p className='text-text text-sm'>Textbox</p> */}
                        <Button 
                        isIconOnly 
                        size='sm'
                        className='p-0 bg-white'
                        onPress={() => contextValues.addText(contextValues.canvas!, 100, 100, 4)}
                        >
                            <TextBoxIcon stroke={generateColorForRecipient(activeRecipient)} fill={hexToRgba(generateColorForRecipient(activeRecipient), 0.1)} />
                        </Button>
                        <p className='text-text text-sm'>Textbox</p>
                    </div>
                </Tooltip>
                <Tooltip title="Checkbox">
                    <div className='flex flex-row items-center justify-center gap-1'>
                        {/* <CgFormatText className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.addText(contextValues.canvas!)} /> */}
                        {/* <img src='/assets/img/controls/checkbox.svg' className='cursor-pointer' onClick={() => contextValues.addCheckbox(contextValues.canvas!, 100, 100, 4)}/> */}
                        <Button 
                        isIconOnly 
                        className='p-0 bg-white'
                        size='sm'
                        onPress={() => contextValues.addCheckbox(contextValues.canvas!, 100, 100, 4)}
                        >
                            <CheckBoxIcon stroke={generateColorForRecipient(activeRecipient)} fill={hexToRgba(generateColorForRecipient(activeRecipient), 0.1)} />
                        </Button>
                        <p className='text-text text-sm'>Checkbox</p>
                    </div>
                </Tooltip> 
                <Tooltip title="Radiobox">
                    <div className='flex flex-row items-center justify-center gap-1'>
                        {/* <CgFormatText className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.addText(contextValues.canvas!)} /> */}
                        {/* <img src='/assets/img/controls/radiobox.svg' className='cursor-pointer' onClick={() => contextValues.addRadiobox(contextValues.canvas!, 100, 100, 4)}/> */}
                        <Button 
                        isIconOnly 
                        className='p-0 bg-white'
                        size='sm'
                        onPress={() => contextValues.addRadiobox(contextValues.canvas!, 100, 100, 4)}
                        >
                            <RadioBoxIcon stroke={generateColorForRecipient(activeRecipient)} fill={hexToRgba(generateColorForRecipient(activeRecipient), 0.1)} />
                        </Button>
                        <p className='text-text text-sm'>Radiobox</p>
                    </div>
                </Tooltip> 
                <Tooltip title="Dropdown">
                    <div className='flex flex-row items-center justify-center gap-1'>
                        {/* <CgFormatText className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.addText(contextValues.canvas!)} /> */}
                        {/* <img src='/assets/img/controls/dropdown.svg' className='cursor-pointer' onClick={() => contextValues.addRadiobox(contextValues.canvas!, 100, 100, 4)}/> */}
                        <Button 
                        isIconOnly 
                        className='p-0 bg-white'
                        size='sm'
                        onPress={() => contextValues.addDropdownbox(contextValues.canvas!, 100, 100, 4)}
                        >
                        <DropdownIcon stroke={generateColorForRecipient(activeRecipient)} fill={hexToRgba(generateColorForRecipient(activeRecipient), 0.1)} />
                        </Button>
                        <p className='text-text text-sm'>Dropdown</p>
                    </div>
                </Tooltip>
                <Tooltip title="Date">
                    <div className='flex flex-row items-center justify-center gap-1'>
                        {/* <CgFormatText className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.addText(contextValues.canvas!)} /> */}
                        {/* <img src='/assets/img/controls/dropdown.svg' className='cursor-pointer' onClick={() => contextValues.addRadiobox(contextValues.canvas!, 100, 100, 4)}/> */}
                        <Button 
                        isIconOnly 
                        className='p-0 bg-white'
                        size='sm'
                        onPress={() => contextValues.addDatebox(contextValues.canvas!,100, 100, 4)}
                        >
                        <DateBoxIcon stroke={generateColorForRecipient(activeRecipient)} fill={hexToRgba(generateColorForRecipient(activeRecipient), 0.1)} />
                        </Button>
                        <p className='text-text text-sm'>Date</p>
                    </div>
                </Tooltip>
                <Tooltip title="Initials">
                    <div className='flex flex-row items-center justify-center gap-1'>
                        {/* <CgFormatText className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.addText(contextValues.canvas!)} /> */}
                        {/* <img src='/assets/img/controls/dropdown.svg' className='cursor-pointer' onClick={() => contextValues.addRadiobox(contextValues.canvas!, 100, 100, 4)}/> */}
                        <Button 
                        isIconOnly 
                        className='p-0 bg-white'
                        size='sm'
                        onPress={() => contextValues.addInitialsbox(contextValues.canvas!,100, 100, 4)}
                        >
                        <InitialsBoxIcon stroke={generateColorForRecipient(activeRecipient)} fill={hexToRgba(generateColorForRecipient(activeRecipient), 0.1)} />
                        </Button>
                        <p className='text-text text-sm'>Initials</p>
                    </div>
                </Tooltip>  

                {/* <Tooltip title="Add Image">
                    <div>
                        <label htmlFor="img-input">
                            <BiImageAdd className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' />
                        </label>
                        <input type="file" id="img-input" accept='image/*' style={{ display: "none" }} onChange={(e) => contextValues.addImage(e, contextValues.canvas!)} />
                    </div>
                </Tooltip> */}

                {/* <Tooltip title="Draw">
                    <div>
                        <HiPencil className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.toggleDraw(contextValues.canvas!)} />
                    </div>
                </Tooltip> */}

                {/* <Tooltip title="Highlight">
                    <div>
                        <AiOutlineHighlight className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.addHighlight(contextValues.canvas!)} />
                    </div>
                </Tooltip>

                <Tooltip title="Delete Selected">
                    <div>
                        <AiOutlineDelete className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.deleteBtn()} />
                    </div>
                </Tooltip>

                <Tooltip title="Reset Page">
                    <div>
                        <AiOutlineClear className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => contextValues.canvas!.clear()} />
                    </div>
                </Tooltip>

                <Tooltip title="Download Current Page">
                    <div>
                        <TbBookDownload className="md:text-[1.8rem] text-[1.5rem] cursor-pointer" onClick={() => contextValues.downloadPage()} />
                    </div>
                </Tooltip>

                <Tooltip title="Download Whole PDF">
                    <div>
                        <FiSave className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' onClick={() => {
                            contextValues.edits[contextValues.currPage] = contextValues.canvas!.toObject();
                            setOpenExporter(true);
                        }} />
                    </div>
                </Tooltip>

                <Tooltip title="Border Color">
                    <div className="md:w-[1.6rem] md:h-[1.6rem] w-[1.3rem] h-[1.3rem] rounded cursor-pointer" style={{ border: `4px dotted ${contextValues.borderColor}` }} onClick={(e) => setOpenBorderColor(e.currentTarget)}></div>
                </Tooltip> */}
                {/* <Popover
                    id="simple-popover"
                    open={Boolean(openBorderColor)}
                    anchorEl={openBorderColor}
                    onClose={() => setOpenBorderColor(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <SketchPicker
                        color={contextValues.borderColor}
                        onChangeComplete={(col: ColorResult) => contextValues.setBorderColor(col.hex)}
                    />
                </Popover>

                <Tooltip title="Fill Color Picker">
                    <div className="md:w-[1.6rem] md:h-[1.6rem] w-[1.3rem] h-[1.3rem] rounded-[50%] cursor-pointer" style={{ background: contextValues.color }} onClick={(e) => setOpenColor(e.currentTarget)}></div>
                </Tooltip>
                <Popover
                    id="simple-popover"
                    open={Boolean(openColor)}
                    anchorEl={openColor}
                    onClose={() => setOpenColor(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <SketchPicker
                        color={contextValues.color}
                        onChangeComplete={(col: ColorResult) => contextValues.setColor(col.hex)}
                    />
                </Popover> */}

                {/* <Tooltip title="Stroke Width">
                    <div className='cursor-pointer'>
                        <BsBorderWidth 
                            onClick={(e) => {
                                const target = e.currentTarget;
                                if (target instanceof HTMLElement) {
                                    setOpenStroke(target);
                                }
                            }} 
                        />
                    </div>
                </Tooltip> */}
                {/* <Popover
                    id="simple-popover"
                    open={Boolean(openStroke)}
                    anchorEl={openStroke}
                    onClose={() => setOpenStroke(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <div className={`min-w-[20vw] min-h-[8vh] flex flex-col items-start justify-center p-8 gap-2 ${contextValues.theme && "bg-[rgba(26,26,26)] text-white"}`}>
                        <div>Stroke Width</div>
                        <Slider
                            aria-label="Small steps"
                            value={contextValues.strokeWidth}
                            step={1}
                            min={0}
                            max={10}
                            onChange={(e, value) => contextValues.setStrokeWidth(value as number)}
                            valueLabelDisplay="auto"
                        />
                    </div>
                </Popover> */}

                {/* <Tooltip title="Hide/unHide Canvas">
                    <div className='cursor-pointer' onClick={() => contextValues.setHiddenCanvas(old => !old)}>
                        {contextValues.hideCanvas ? <BiHide className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' /> :
                            <BiShow className='md:text-[1.8rem] text-[1.5rem] cursor-pointer' />}
                    </div>
                </Tooltip> */}

            </div>
        </div >
    );
};

export default SideBar;
