"use client"

import React, { useRef, useEffect, useState, createContext, useContext } from 'react';
import { fabric } from 'fabric';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { v4 as uuidv4 } from 'uuid';
import CheckboxManager from '@/utils/canvas/classes/checkboxmanager';
import TextboxManager from '@/utils/canvas/classes/textboxmanager';
import RadioboxManager from '@/utils/canvas/classes/radioboxmanager';
import DropdownboxManager from '@/utils/canvas/classes/dropdownmanager';
import DateboxManager from '@/utils/canvas/classes/dateboxmanager';
import InitialsboxManager from '@/utils/canvas/classes/initialsboxmanager';
import { 
  CheckboxSettingFormState,
  TextboxSettingFormState,

  RadioboxSettingFormState,
  DropdownboxSettingFormState,
  DateboxSettingFormState,
  InitialsboxSettingFormState,
  ControlSVGFile,
  Recipient,
} from '@/interface/interface';
import { useUser } from './user';

type CanvasContextProps = {
  canvas: fabric.Canvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>;
  //sidebar control functions
  addRect: (canvi: fabric.Canvas) => void;
  addCircle: (canvi: fabric.Canvas) => void;
  addText: (canvi: fabric.Canvas,startLeft: number, startTop: number, numCheckboxes: number) => void;
  addCheckbox: (canvi: fabric.Canvas, left: number, top: number, numCheckboxes: number) => void;
  addRadiobox: (canvi: fabric.Canvas, left: number, top: number, numCheckboxes: number) => void;
  addDropdownbox: (canvi: fabric.Canvas,startLeft: number, startTop: number, numCheckboxes: number) => void;
  addDatebox: (canvi: fabric.Canvas,startLeft: number, startTop: number, numCheckboxes: number) => void;
  addInitialsbox: (canvi: fabric.Canvas,startLeft: number, startTop: number, numCheckboxes: number) => void;

  addImage: (e: React.ChangeEvent<HTMLInputElement>, canvi: fabric.Canvas) => void;
  addHighlight: (canvi: fabric.Canvas) => void;


  toggleDraw: (canvi: fabric.Canvas) => void;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  borderColor: string;
  setBorderColor: React.Dispatch<React.SetStateAction<string>>;
  strokeWidth: number;
  setStrokeWidth: React.Dispatch<React.SetStateAction<number>>;
  deleteBtn: () => void;
  numPages: number | null;
  setNumPages: React.Dispatch<React.SetStateAction<number | null>>;
  currPage: number;
  setCurrPage: React.Dispatch<React.SetStateAction<number>>;
  selectedFile: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  addNote: (canvi: fabric.Canvas) => void;
  exportPage: React.MutableRefObject<HTMLDivElement | null>;
  exportPdf: () => void;
  downloadPage: () => void;
  isExporting: boolean;
  theme: boolean;
  setTheme: React.Dispatch<React.SetStateAction<boolean>>;
  hideCanvas: boolean;
  setHiddenCanvas: React.Dispatch<React.SetStateAction<boolean>>;
  // canvas edits
  edits: Record<number, any>;
  setEdits: (edits: Record<number, any>) => void;
  //setting form controls
  showCheckboxSettingForm: any,
  setShowCheckboxSettingForm: React.Dispatch<React.SetStateAction<any>>;
  showTextboxSettingForm: any,
  setShowTextboxSettingForm:React.Dispatch<React.SetStateAction<any>>;
  showRadioboxSettingForm: any,
  setShowRadioboxSettingForm:React.Dispatch<React.SetStateAction<any>>;
  showDropdownboxSettingForm: any,
  setShowDropdownboxSettingForm:React.Dispatch<React.SetStateAction<any>>;
  showDateboxSettingForm: any,
  setShowDateboxSettingForm:React.Dispatch<React.SetStateAction<any>>;
  showInitialsboxSettingForm: any,
  setShowInitialsboxSettingForm:React.Dispatch<React.SetStateAction<any>>;

  activeRecipient:string;
  setActiveRecipient: React.Dispatch<React.SetStateAction<string>>;
  setRecipients: React.Dispatch<React.SetStateAction<Recipient[]>>;
  handleCanvasObjectSetValue: (payload:any) => void;

  signMode: boolean;
};

const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};

type CanvasProviderProps = {
  children: React.ReactNode;
};

export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currPage, setCurrPage] = useState<number>(1);
  const [selectedFile, setFile] = useState<File | null>(null);
  const [color, setColor] = useState<string>("#000");
  const [borderColor, setBorderColor] = useState<string>("#f4a261");
  const [strokeWidth, setStrokeWidth] = useState<number>(1);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isExporting, setExporting] = useState(false);
  const [hideCanvas, setHiddenCanvas] = useState(false);
  const exportPage = useRef<HTMLDivElement | null>(null);
  const [exportPages, setExportPages] = useState<HTMLDivElement[]>([]);

  const [signMode, setSignMode] = useState<boolean>(false);
  const [onlyMyself, setOnlyMyself] = useState<boolean>(false);

  // current selected recipient
  const [activeRecipient, setActiveRecipient] = useState<string>("");
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  const userContextValues = useUser();

  useEffect(() => {
    if(recipients.length === 1 && recipients[0].email === userContextValues.userData.email) {
      setOnlyMyself(true);
    } else {
      setOnlyMyself(false);
    }
  }, [recipients]);

  const [controlSVGFile, setControlSVGFile] = useState<ControlSVGFile>({
    textbox: "",
    textbox_edit: "",
    radiobox_empty: "",
    radiobox_filled: "",
    radiobox_edit: "",
    dropdownbox: "",
    radio_add_button: "",
    arrow_bottom: "",
    datebox: "",
    calendar: "",
    initialsbox: "",
    gear: "",
    date: "",
  })
  // canvas edit object
  const [edits, setEdits] = React.useState({});

  const [checkboxItems, setCheckboxItems] = useState(1);
  const [radioboxItems, setRadioboxItems] = useState(1);

  //setting form controls
  const [showCheckboxSettingForm, setShowCheckboxSettingForm] = useState<CheckboxSettingFormState>({
    uid: "",
    show: false,
    position: { left: 0, top: 0 },
    value: {
      recipient: "",
      defaultTick: true,
      checkedBydefault: true,
      required: true,
    },
  });

  const [showTextboxSettingForm, setShowTextboxSettingForm] = useState<TextboxSettingFormState>({
    uid: "",
    show: false,
    position: { left: 0, top: 0 },
    value: {
      recipient: "",
      customPlaceholder: false,
      placeholder: "Enter value",
      required: true,
    },
  });

  const [showRadioboxSettingForm, setShowRadioboxSettingForm] = useState<RadioboxSettingFormState>({
    uid: "",
    show: false,
    position: { left: 0, top: 0 },
    value: {
      recipient: "",
      required: true,
    },
  });

  const [showDropdownboxSettingForm, setShowDropdownboxSettingForm] = useState<DropdownboxSettingFormState>({
    uid: "",
    show: false,
    position: { left: 0, top: 0 },
    width: 200,
    value: {
      recipient: "",
      items: [],
      selectedItem: "",
      required: true,
    },
  });

  const [showDateboxSettingForm, setShowDateboxSettingForm] = useState<DateboxSettingFormState>({
    uid: "",
    show: false,
    position: { left: 0, top: 0 },
    width: 200,
    value: {
      recipient: "",
      format: "mm/dd/yyyy",
      required: true,
      lockedToday: false,
      selectedDate: null,
    },
  });

  const [showInitialsboxSettingForm, setShowInitialsboxSettingForm] = useState<InitialsboxSettingFormState>({
    uid: "",
    show: false,
    position: { left: 0, top: 0 },
    width: 200,
    value: {
      recipient: "",
      required: true,
      initialImage: "",
    },
  });

  //stroe canvas objects
  type CanvasObjects = {
    uid:string;
    object: any
  };
  const [canvasObjects, setCanvasObjects] = useState<CanvasObjects[]>([])

  //transfer setting values from setting form to canvas object
  const handleCanvasObjectSetValue = (payload:any) => {
    if(canvas) {
      canvasObjects.filter(item=>item.uid===payload.uid)[0].object.setValue(payload.value)
    }
  };

  const svgFiles = [
    "textbox",
    "dropdownbox",
    "arrow_bottom",
    "date",
    "calendar",
    "initialsbox",
    "gear",
  ]

  //fetching svg files for canvas object
  useEffect(() => {
    const fetchFileContent = async () => {
      for (const item of svgFiles) {
        try {
          const response = await fetch(`/api/readfile/controls?filename=${encodeURIComponent(item)}`);
          if (!response.ok) {
            console.error("Error fetching:", item);
            continue;
          }
          const data = await response.json();
  
          setControlSVGFile(prev => ({
            ...prev,
            [item]: data.content
          }));
        } catch (err) {
          console.error(`Failed to fetch ${item}:`, err);
        }
      }
    };
  
    fetchFileContent();
  }, []);

  // useEffect(() => {
  //   const wrapper = document.getElementById("canvasWrapper");
  //   if (wrapper) {
  //     wrapper.style.visibility = hideCanvas ? "hidden" : "visible";
  //   }
  // }, [hideCanvas]);

  // useEffect(() => {
  //   if (canvas) {
  //     const activeObject = canvas.getActiveObject();
  //     if (activeObject) {
  //       activeObject.set("fill", color);
  //       canvas.renderAll();
  //     }
  //   }
  // }, [color, canvas]);

  // useEffect(() => {
  //   if (canvas) {
  //     if (canvas.isDrawingMode) {
  //       canvas.freeDrawingBrush.color = borderColor;
  //     }
  //     const activeObject = canvas.getActiveObject();
  //     if (activeObject) {
  //       activeObject.set("stroke", borderColor);
  //       canvas.renderAll();
  //     }
  //   }
  // }, [borderColor, canvas]);

  // useEffect(() => {
  //   if (canvas) {
  //     if (canvas.isDrawingMode) {
  //       canvas.freeDrawingBrush.width = strokeWidth;
  //     }
  //     const activeObject = canvas.getActiveObject();
  //     if (activeObject) {
  //       activeObject.set("strokeWidth", strokeWidth);
  //       canvas.renderAll();
  //     }
  //   }
  // }, [strokeWidth, canvas]);

  const downloadPage = () => {
    setExporting(true);
    const doc = document.querySelector<HTMLDivElement>('#singlePageExport');
    if (doc) {
      html2canvas(doc).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0, 200, 200);
        pdf.save("edge_lamp_edited.pdf");
        setExporting(false);
      });
    }
  };

  const addImage = (e: React.ChangeEvent<HTMLInputElement>, canvi: fabric.Canvas) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (f) {
        const data = f.target?.result as string;
        fabric.Image.fromURL(data, (img) => {
          img.scaleToWidth(300);
          canvi.add(img).renderAll();
        });
      };
      reader.readAsDataURL(file);
      canvi.isDrawingMode = false;
    }
  };

  const addNote = (canvi: fabric.Canvas) => {
    fabric.Image.fromURL(`./note/note${(Math.floor(Math.random() * 10) % 4) + 1}.png`, (img) => {
      img.scaleToWidth(100);
      canvi.add(img).renderAll();
    });
    canvi.isDrawingMode = false;
  };

  const deleteBtn = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
      }
    }
  };

  const addRect = (canvi: fabric.Canvas) => {
    const rect = new fabric.Rect({
      height: 180,
      width: 200,
      fill: color,
      stroke: borderColor,
      strokeWidth: strokeWidth,
      cornerStyle: 'circle',
    });
    canvi.add(rect);
    canvi.renderAll();
    canvi.isDrawingMode = false;
  };

  const addCircle = (canvi: fabric.Canvas) => {
    const circle = new fabric.Circle({
      radius: 100,
      fill: color,
      cornerStyle: 'circle',
      stroke: borderColor,
      strokeWidth: 2,
    });
    canvi.add(circle);
    canvi.renderAll();
    canvi.isDrawingMode = false;
  };

  const addHighlight = (canvi: fabric.Canvas) => {
    const highlight = new fabric.Rect({
      height: 20,
      width: 400,
      fill: color + '33',
      cornerStyle: 'circle',
    });
    canvi.add(highlight);
    canvi.renderAll();
    canvi.isDrawingMode = false;
  };

  //textbox
  const addText = (canvi: fabric.Canvas, startLeft: number, startTop: number) => {
    const uid = uuidv4();
    const textboxGroup = new TextboxManager(
      uid,
      canvi, 
      startLeft, 
      startTop, 
      activeRecipient,
      signMode,
      onlyMyself,
      setShowTextboxSettingForm,
      controlSVGFile,
    ); // Initialize with 1 checkboxes
    setCanvasObjects([...canvasObjects, {uid, object:textboxGroup}]);
    
    textboxGroup.addToCanvas();
  };

  //checkbox
  const addCheckbox = (canvi: fabric.Canvas, startLeft: number, startTop: number, numCheckboxes: number) => {
    const uid = uuidv4();
    const checkboxGroup = new CheckboxManager(
      uid,
      canvi, 
      startLeft, 
      startTop, 
      1, 
      activeRecipient,
      signMode,
      setCheckboxItems, 
      setShowCheckboxSettingForm
    ); // Initialize with 1 checkboxes
    setCanvasObjects([...canvasObjects, {uid, object:checkboxGroup}]);
    
    checkboxGroup.addToCanvas(); // Add the group to the canvas
  };

  //radiobox
  const addRadiobox = (canvi: fabric.Canvas, startLeft: number, startTop: number, numCheckboxes: number) => {
    const uid = uuidv4();
    const radioboxGroup = new RadioboxManager(
      uid,
      canvi, 
      startLeft, 
      startTop, 
      1, 
      activeRecipient,
      signMode,
      setRadioboxItems, 
      setShowRadioboxSettingForm,
      controlSVGFile,
    ); // Initialize with 1 checkboxes
    setCanvasObjects([...canvasObjects, {uid, object: radioboxGroup}]);
    
    radioboxGroup.addToCanvas(); // Add the group to the canvas
  };
  
  //dropdownbox
  const addDropdownbox = (canvi: fabric.Canvas, startLeft: number, startTop: number, numCheckboxes: number) => {
    const uid = uuidv4();
    const radioboxGroup = new DropdownboxManager(
      uid,
      canvi, 
      startLeft, 
      startTop, 
      activeRecipient,
      signMode,
      setShowDropdownboxSettingForm,
      controlSVGFile,
    ); // Initialize with 1 checkboxes
    setCanvasObjects([...canvasObjects, {uid, object: radioboxGroup}]);
    
    radioboxGroup.addToCanvas(); // Add the group to the canvas
  };

  //datebox
  const addDatebox = (canvi: fabric.Canvas, startLeft: number, startTop: number, numCheckboxes: number) => {
    const uid = uuidv4();
    const radioboxGroup = new DateboxManager(
      uid,
      canvi, 
      startLeft, 
      startTop, 
      activeRecipient,
      signMode,
      onlyMyself,
      setShowDateboxSettingForm,
      controlSVGFile,
    ); // Initialize with 1 checkboxes
    setCanvasObjects([...canvasObjects, {uid, object: radioboxGroup}]);
    
    radioboxGroup.addToCanvas(); // Add the group to the canvas
  };

  //initialsbox
  const addInitialsbox = (canvi: fabric.Canvas, startLeft: number, startTop: number, numCheckboxes: number) => {
    const uid = uuidv4();
    const radioboxGroup = new InitialsboxManager(
      uid,
      canvi, 
      startLeft, 
      startTop, 
      activeRecipient,
      signMode,
      setShowInitialsboxSettingForm,
      controlSVGFile,
    ); // Initialize with 1 checkboxes
    setCanvasObjects([...canvasObjects, {uid, object: radioboxGroup}]);
    
    radioboxGroup.addToCanvas(); // Add the group to the canvas
  };

  const toggleDraw = (canvi: fabric.Canvas) => {
    canvi.isDrawingMode = !canvi.isDrawingMode;
    if (canvas) {
      const brush = canvas.freeDrawingBrush;
      brush.color = borderColor;
      brush.width = strokeWidth;
    }
  };

  const exportPdf = () => {
    setExportPages((prev) => [...prev, exportPage.current!]);
  };

  return (
    <CanvasContext.Provider
      value={{
        canvas,
        setCanvas,
        //sidebar controls
        addRect,
        addCircle,
        addText,
        addCheckbox,
        addRadiobox,
        addDropdownbox,
        addDatebox,
        addInitialsbox,

        addImage,
        numPages,
        setNumPages,
        currPage,
        setCurrPage,

        selectedFile,
        setFile,
        addHighlight,
        toggleDraw,
        color,
        setColor,
        addNote,
        deleteBtn,
        exportPage,
        exportPdf,
        downloadPage,
        isExporting,
        theme,
        setTheme,
        borderColor,
        setBorderColor,
        strokeWidth,
        setStrokeWidth,
        hideCanvas,
        setHiddenCanvas,

        edits,
        setEdits,
        //state variables for setting form controls
        showCheckboxSettingForm,
        setShowCheckboxSettingForm,
        showTextboxSettingForm,
        setShowTextboxSettingForm,
        showRadioboxSettingForm,
        setShowRadioboxSettingForm,
        showDropdownboxSettingForm,
        setShowDropdownboxSettingForm,
        showDateboxSettingForm,
        setShowDateboxSettingForm,
        showInitialsboxSettingForm,
        setShowInitialsboxSettingForm,

        activeRecipient,
        setActiveRecipient,
        setRecipients,
        handleCanvasObjectSetValue,
        signMode,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};