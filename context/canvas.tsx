"use client";

import React, {
  useRef,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { fabric } from "fabric";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import { useUser } from "./user";

import CheckboxManager from "@/utils/canvas/classes/checkboxmanager";
import TextboxManager from "@/utils/canvas/classes/textboxmanager";
import RadioboxManager from "@/utils/canvas/classes/radioboxmanager";
import DropdownboxManager from "@/utils/canvas/classes/dropdownmanager";
import DateboxManager from "@/utils/canvas/classes/dateboxmanager";
import InitialsboxManager from "@/utils/canvas/classes/initialsboxmanager";
import {
  CheckboxSettingFormState,
  TextboxSettingFormState,
  RadioboxSettingFormState,
  DropdownboxSettingFormState,
  DateboxSettingFormState,
  InitialsboxSettingFormState,
  ControlSVGFile,
  Recipient,
  DocData,
  AdvancedData,
  TextboxObject,
  CheckboxObject,
  DropDownBoxObject,
  DateboxObject,
} from "@/interface/interface";
import { pageWidth, pageHeight, canvasObject } from "@/constants/canvas";
import { DOC_STATUS, INPROGRESS } from "@/constants/document";
import { DocSavedState } from "@/interface/interface";
import { SVGFILE } from "@/constants/svgFiles"

type CanvasContextProps = {
  canvas: fabric.Canvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>;
  showReviewModal: boolean | false;
  setShowReviewModal: React.Dispatch<React.SetStateAction<boolean | false>>;
  //sidebar control functions
  addText: (canvi: fabric.Canvas, startLeft: number, startTop: number) => void;
  addCheckbox: (canvi: fabric.Canvas, left: number, top: number) => void;
  addRadiobox: (canvi: fabric.Canvas, left: number, top: number) => void;
  addDropdownbox: (
    canvi: fabric.Canvas,
    startLeft: number,
    startTop: number,
  ) => void;
  addDatebox: (
    canvi: fabric.Canvas,
    startLeft: number,
    startTop: number,
  ) => void;
  addInitialsbox: (
    canvi: fabric.Canvas,
    startLeft: number,
    startTop: number,
  ) => void;

  toggleDraw: (canvi: fabric.Canvas) => void;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  borderColor: string;
  setBorderColor: React.Dispatch<React.SetStateAction<string>>;
  strokeWidth: number;
  setStrokeWidth: React.Dispatch<React.SetStateAction<number>>;
  numPages: number | null;
  setNumPages: React.Dispatch<React.SetStateAction<number | null>>;
  currPage: number;
  setCurrPage: React.Dispatch<React.SetStateAction<number>>;
  selectedFile: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  exportPDF: () => Promise<void>;
  isExporting: boolean;
  theme: boolean;
  setTheme: React.Dispatch<React.SetStateAction<boolean>>;
  hideCanvas: boolean;
  setHiddenCanvas: React.Dispatch<React.SetStateAction<boolean>>;
  // canvas edits
  edits: Record<number, any>;
  setEdits: (edits: Record<number, any>) => void;
  //setting form controls
  showCheckboxSettingForm: any;
  setShowCheckboxSettingForm: React.Dispatch<React.SetStateAction<any>>;
  showTextboxSettingForm: any;
  setShowTextboxSettingForm: React.Dispatch<React.SetStateAction<any>>;
  showRadioboxSettingForm: any;
  setShowRadioboxSettingForm: React.Dispatch<React.SetStateAction<any>>;
  showDropdownboxSettingForm: any;
  setShowDropdownboxSettingForm: React.Dispatch<React.SetStateAction<any>>;
  showDropdownboxListForm: any;
  setShowDropdownboxListForm: React.Dispatch<React.SetStateAction<any>>;
  showDateboxSettingForm: any;
  setShowDateboxSettingForm: React.Dispatch<React.SetStateAction<any>>;
  showDateboxCalendarForm: any;
  setShowDateboxCalendarForm: React.Dispatch<React.SetStateAction<any>>;
  showInitialsboxSettingForm: any;
  setShowInitialsboxSettingForm: React.Dispatch<React.SetStateAction<any>>;

  activeRecipient: string;
  setActiveRecipient: React.Dispatch<React.SetStateAction<string>>;
  setRecipients: React.Dispatch<React.SetStateAction<Recipient[]>>;
  handleCanvasObjectSetValue: (payload: any) => void;

  docData: DocData;
  setDocData: React.Dispatch<React.SetStateAction<DocData>>;
  docSaving: boolean;
  setDocSaving: React.Dispatch<React.SetStateAction<boolean>>;
  docSaved: DocSavedState;
  setDocSaved: React.Dispatch<React.SetStateAction<DocSavedState>>;

  handleSaveDoc: (data:AdvancedData, status:string) => void;
  handleRestoreDoc: (canvasObjects:any) => void;

  signMode: boolean;
};

const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

export const useCanvas = () => {
  const context = useContext(CanvasContext);

  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider");
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

  const [signMode, setSignMode] = useState<boolean>(false);
  const [onlyMyself, setOnlyMyself] = useState<boolean>(false);

  // current selected recipient
  const [activeRecipient, setActiveRecipient] = useState<string>("");
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  //show review and finish modal
  const[showReviewModal, setShowReviewModal] = useState<boolean>(false);

  //document main data
  const [docData, setDocData] = useState<DocData>({
    uid: "",
    filename: "",
    recipients: [],
    canvas: [],
  });

  //document saving states
  const [docSaving, setDocSaving] = useState<boolean>(false);

  const [docSaved, setDocSaved] = useState<DocSavedState>({
    draft: false,
    template: false,
    inprogress: false,
  });

  //stroe canvas objects
  type CanvasObjects = {
    uid: string;
    object: any;
  };
  const [canvasObjects, setCanvasObjects] = useState<CanvasObjects[]>([]);

  const removeCanvasObject = (uid: string) => {
    setCanvasObjects((prevObjects) => prevObjects.filter((item) => item.uid !== uid));
  };

  const userContextValues = useUser();

  useEffect(() => {
    if (
      recipients.length === 1 &&
      recipients[0].email === userContextValues.userData.email
    ) {
      setOnlyMyself(true);
    } else {
      setOnlyMyself(false);
    }
  }, [recipients]);

  // if canvas objects are modified, saved states are reset
  useEffect(() => {
    setDocSaved({
      draft: false,
      inprogress: false,
      template: false,
    });
  }, [canvasObjects]);

  const [controlSVGFile, setControlSVGFile] = useState<ControlSVGFile>({
    textbox: SVGFILE.textbox,
    arrow_bottom: SVGFILE.arrowBottom,
    calendar: SVGFILE.calendar,
    gear: SVGFILE.gear,    
    date: SVGFILE.date,
    dropdown: SVGFILE.dropdown,
    initials: SVGFILE.initials,
  });
  // canvas edit object
  const [edits, setEdits] = React.useState({});

  //setting form controls
  const [showCheckboxSettingForm, setShowCheckboxSettingForm] =
    useState<CheckboxSettingFormState>({
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

  const [showTextboxSettingForm, setShowTextboxSettingForm] =
    useState<TextboxSettingFormState>({
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

  const [showRadioboxSettingForm, setShowRadioboxSettingForm] =
    useState<RadioboxSettingFormState>({
      uid: "",
      show: false,
      position: { left: 0, top: 0 },
      value: {
        recipient: "",
        required: true,
      },
    });

  const [showDropdownboxSettingForm, setShowDropdownboxSettingForm] =
    useState<DropdownboxSettingFormState>({
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

  const [showDropdownboxListForm, setShowDropdownboxListForm] =
    useState<DropdownboxSettingFormState>({
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

  const [showDateboxSettingForm, setShowDateboxSettingForm] =
    useState<DateboxSettingFormState>({
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

  const [showDateboxCalendarForm, setShowDateboxCalendarForm] =
    useState<DateboxSettingFormState>({
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

  const [showInitialsboxSettingForm, setShowInitialsboxSettingForm] =
    useState<InitialsboxSettingFormState>({
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

  //transfer setting values from setting form to canvas object
  const handleCanvasObjectSetValue = (payload: any) => {
    if (canvas) {
      canvasObjects
        .filter((item) => item.uid === payload.uid)[0]
        .object.setValue(payload.value);
    }
  };

  //export editing cavas as a pdf
  const exportPDF = async (): Promise<void> => {
    const doc = document.querySelector("#singlePageExport") as HTMLElement | null;
    if (!doc) {
      console.error("Element #singlePageExport not found!");
      return;
    }
  
    try {
      setExporting(true);
      // Render the full canvas
      const canvas = await html2canvas(doc, {
        useCORS: true,
        logging: false,
        allowTaint: true,
        scale: 1,
      });
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [pageWidth, pageHeight], // Single page size
      });
  
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Canvas context not found!");
        return;
      }

      if(!numPages){
        return;
      }
  
      // Loop through each page section and add it to the PDF
      for (let i = 0; i < numPages; i++) {
        const offsetY = i * pageHeight; // Y offset for each slice
  
        // Create a temporary canvas for each page slice
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = pageHeight; // Height of one PDF page
  
        const pageCtx = pageCanvas.getContext("2d");
        if (!pageCtx) continue;
  
        // Copy a portion of the original canvas to the new page canvas
        pageCtx.drawImage(canvas, 0, -offsetY);
  
        // Convert page canvas to image
        const imgData = pageCanvas.toDataURL("image/png");
  
        // Add the image to the PDF
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        // console.log(pageHeight)
      }
  
      pdf.save("exported-document.pdf");
      setExporting(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setExporting(false);
    }
  };

  //add textbox
  const addText = (
    canvi: fabric.Canvas,
    startLeft: number,
    startTop: number,
  ) => {
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
      removeCanvasObject,
    ); // Initialize with 1 checkboxes

    setCanvasObjects([...canvasObjects, { uid, object: textboxGroup }]);

    textboxGroup.addToCanvas();
  };

  //add checkbox
  const addCheckbox = (
    canvi: fabric.Canvas,
    startLeft: number,
    startTop: number,
  ) => {
    const uid = uuidv4();
    const checkboxGroup = new CheckboxManager(
      uid,
      canvi,
      startLeft,
      startTop,
      1,
      activeRecipient,
      signMode,
      onlyMyself,
      setShowCheckboxSettingForm,
      removeCanvasObject,
    ); // Initialize with 1 checkboxes

    setCanvasObjects([...canvasObjects, { uid, object: checkboxGroup }]);

    checkboxGroup.addToCanvas(); // Add the group to the canvas
  };

  //add radiobox
  const addRadiobox = (
    canvi: fabric.Canvas,
    startLeft: number,
    startTop: number,
  ) => {
    const uid = uuidv4();
    const radioboxGroup = new RadioboxManager(
      uid,
      canvi,
      startLeft,
      startTop,
      1,
      activeRecipient,
      signMode,
      onlyMyself,
      setShowRadioboxSettingForm,
      controlSVGFile,
      removeCanvasObject,
    ); // Initialize with 1 checkboxes

    setCanvasObjects([...canvasObjects, { uid, object: radioboxGroup }]);

    radioboxGroup.addToCanvas(); // Add the group to the canvas
  };

  //add dropdownbox
  const addDropdownbox = (
    canvi: fabric.Canvas,
    startLeft: number,
    startTop: number,
  ) => {
    const uid = uuidv4();
    const dropdownboxGroup = new DropdownboxManager(
      uid,
      canvi,
      startLeft,
      startTop,
      activeRecipient,
      signMode,
      onlyMyself,
      setShowDropdownboxSettingForm,
      setShowDropdownboxListForm,
      controlSVGFile,
      removeCanvasObject,
    ); // Initialize with 1 checkboxes

    setCanvasObjects([...canvasObjects, { uid, object: dropdownboxGroup }]);

    dropdownboxGroup.addToCanvas(); // Add the group to the canvas
  };

  //add datebox
  const addDatebox = (
    canvi: fabric.Canvas,
    startLeft: number,
    startTop: number,
  ) => {
    const uid = uuidv4();
    const dateboxGroup = new DateboxManager(
      uid,
      canvi,
      startLeft,
      startTop,
      activeRecipient,
      signMode,
      onlyMyself,
      setShowDateboxSettingForm,
      setShowDateboxCalendarForm,
      controlSVGFile,
      removeCanvasObject,
    ); // Initialize with 1 checkboxes

    setCanvasObjects([...canvasObjects, { uid, object: dateboxGroup }]);

    dateboxGroup.addToCanvas(); // Add the group to the canvas
  };

  //add initialsbox
  const addInitialsbox = (
    canvi: fabric.Canvas,
    startLeft: number,
    startTop: number,
  ) => {
    const uid = uuidv4();
    const initialboxGroup = new InitialsboxManager(
      uid,
      canvi,
      startLeft,
      startTop,
      activeRecipient,
      signMode,
      setShowInitialsboxSettingForm,
      controlSVGFile,
      removeCanvasObject,
    ); // Initialize with 1 checkboxes

    setCanvasObjects([...canvasObjects, { uid, object: initialboxGroup }]);

    initialboxGroup.addToCanvas(); // Add the group to the canvas
  };

  const toggleDraw = (canvi: fabric.Canvas) => {
    canvi.isDrawingMode = !canvi.isDrawingMode;
    if (canvas) {
      const brush = canvas.freeDrawingBrush;

      brush.color = borderColor;
      brush.width = strokeWidth;
    }
  };
  // save document as a draft or template
  const handleSaveDoc = async (data:AdvancedData, status:string=DOC_STATUS.draft) => {
    if(canvasObjects.length > 0) {
      const canvas2JsonData:object[] = [];

      console.log(canvasObjects)

      canvasObjects.forEach( item => {
        canvas2JsonData.push(item.object)
      });

      console.log(canvas2JsonData);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/document/savedoc`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("session") || ""}`,
          },
          body: JSON.stringify({
            uid: docData.uid,
            status: status,
            canvas: canvas2JsonData,
            advanced: data.advanced,
            cc: data.cc,
            autoReminder: data.autoReminder,
            customExpDay: data.customExpDay,
          }),
        });
  
        if(!response.ok) {
          return;
        };

        switch (status) {
          case DOC_STATUS.draft:
            setDocSaved({ ...docSaved, draft: true });
            break;
          case DOC_STATUS.inprogress:
            setDocSaved({ ...docSaved, inprogress: true });
            break;
          default:
            break;
        };

      } catch (error) {
        return;
      }
    }
  }

  // restore document from database to canvas
  const handleRestoreDoc = () => {
    if(!canvas) return;
    if(docData.canvas.length > 0) {
      docData.canvas.forEach( item => {
        switch (item.controlType) {
          case canvasObject.textbox:
            const textboxGroup = new TextboxManager(
              item.uid,
              canvas,
              item.containerLeft,
              item.containerTop,
              item.recipient,
              signMode,
              onlyMyself,
              setShowTextboxSettingForm,
              controlSVGFile,
              removeCanvasObject,
              item as TextboxObject
            ); // Initialize with 1 checkboxes
      
            // setCanvasObjects([...canvasObjects, { uid: item.uid, object: textboxGroup }]);
            setCanvasObjects((prevObjects) => [
              ...prevObjects,
              { uid: item.uid, object: textboxGroup }
            ]);
      
            textboxGroup.restoreToCanvas();
            break;
          case canvasObject.checkbox:
            const checkboxGroup = new CheckboxManager(
              item.uid,
              canvas,
              item.containerLeft,
              item.containerTop,
              1,
              item.recipient,
              signMode,
              onlyMyself,
              setShowCheckboxSettingForm,
              removeCanvasObject,
              item as CheckboxObject
            ); // Initialize with 1 checkboxes
        
            // setCanvasObjects([...canvasObjects, { uid: item.uid, object: checkboxGroup }]);
            setCanvasObjects((prevObjects) => [
              ...prevObjects,
              { uid: item.uid, object: checkboxGroup }
            ]);
        
            checkboxGroup.addToCanvas(); // Add the group to the canvas
            break;
          case canvasObject.radiobox:
            const radioboxGroup = new RadioboxManager(
              item.uid,
              canvas,
              item.containerLeft,
              item.containerTop,
              1,
              item.recipient,
              signMode,
              onlyMyself,
              setShowRadioboxSettingForm,
              controlSVGFile,
              removeCanvasObject,
              item as CheckboxObject,
            ); // Initialize with 1 checkboxes
        
            setCanvasObjects((prevObjects) => [
              ...prevObjects,
              { uid: item.uid, object: radioboxGroup }
            ]);
        
            radioboxGroup.addToCanvas(); // Add the group to the canvas
            break;
          case canvasObject.dropdownbox:
            const dropdownboxGroup = new DropdownboxManager(
              item.uid,
              canvas,
              item.containerLeft,
              item.containerTop,
              item.recipient,
              signMode,
              onlyMyself,
              setShowDropdownboxSettingForm,
              setShowDropdownboxListForm,
              controlSVGFile,
              removeCanvasObject,
              item as DropDownBoxObject
            );

            setCanvasObjects((prevObjects) => [
              ...prevObjects,
              { uid: item.uid, object: dropdownboxGroup }
            ]);
            dropdownboxGroup.restoreToCanvas();
            break;
          case canvasObject.datebox:
            const dateboxGroup = new DateboxManager(
              item.uid,
              canvas,
              item.containerLeft,
              item.containerTop,
              item.recipient,
              signMode,
              onlyMyself,
              setShowDateboxSettingForm,
              setShowDateboxCalendarForm,
              controlSVGFile,
              removeCanvasObject,
              item as DateboxObject
            ); // Initialize with 1 checkboxes
        
            setCanvasObjects((prevObjects) => [
              ...prevObjects,
              { uid: item.uid, object: dateboxGroup }
            ]);
        
            dateboxGroup.restoreToCanvas();
            break;
          case canvasObject.initialbox:
            const initialboxGroup = new InitialsboxManager(
              item.uid,
              canvas,
              item.containerLeft,
              item.containerTop,
              item.recipient,
              signMode,
              setShowInitialsboxSettingForm,
              controlSVGFile,
              removeCanvasObject,
            ); // Initialize with 1 checkboxes
        
            setCanvasObjects((prevObjects) => [
              ...prevObjects,
              { uid: item.uid, object: initialboxGroup }
            ]);
        
            initialboxGroup.addToCanvas();
            break;
          default:
            break;
        }
      })
    }
  };
  // if canvas object exists in document data, it'll be restored
  useEffect(() => {
    if(canvas) handleRestoreDoc();
  }, [canvas]);

  useEffect(() => {
    console.log(canvasObjects)
  }, [canvasObjects])

  return (
    <CanvasContext.Provider
      value={{
        canvas,
        setCanvas,
        showReviewModal,
        setShowReviewModal,
        //sidebar controls
        addText,
        addCheckbox,
        addRadiobox,
        addDropdownbox,
        addDatebox,
        addInitialsbox,

        numPages,
        setNumPages,
        currPage,
        setCurrPage,

        selectedFile,
        setFile,
        toggleDraw,
        color,
        setColor,
        exportPDF,
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
        showDropdownboxListForm,
        setShowDropdownboxListForm,
        showDateboxSettingForm,
        setShowDateboxSettingForm,
        showDateboxCalendarForm,
        setShowDateboxCalendarForm,
        showInitialsboxSettingForm,
        setShowInitialsboxSettingForm,

        activeRecipient,
        setActiveRecipient,
        setRecipients,
        handleCanvasObjectSetValue,

        handleSaveDoc,
        handleRestoreDoc,

        docData,
        setDocData,
        docSaving,
        setDocSaving,
        docSaved,
        setDocSaved,

        signMode,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
