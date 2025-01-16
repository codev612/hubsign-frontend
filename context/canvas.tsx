"use client"

import React, { useRef, useEffect, useState, createContext, useContext } from 'react';
import { fabric } from 'fabric';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Roboto } from 'next/font/google';

type CanvasContextProps = {
  canvas: fabric.Canvas | null;
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | null>>;
  addRect: (canvi: fabric.Canvas) => void;
  addCircle: (canvi: fabric.Canvas) => void;
  addText: (canvi: fabric.Canvas) => void;
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
};

const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

export const useButtons = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useButtons must be used within a CanvasProvider');
  }
  return context;
};

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

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
  // canvas edits
  const [edits, setEdits] = React.useState({});

  useEffect(() => {
    const wrapper = document.getElementById("canvasWrapper");
    if (wrapper) {
      wrapper.style.visibility = hideCanvas ? "hidden" : "visible";
    }
  }, [hideCanvas]);

  useEffect(() => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        activeObject.set("fill", color);
        canvas.renderAll();
      }
    }
  }, [color, canvas]);

  useEffect(() => {
    if (canvas) {
      if (canvas.isDrawingMode) {
        canvas.freeDrawingBrush.color = borderColor;
      }
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        activeObject.set("stroke", borderColor);
        canvas.renderAll();
      }
    }
  }, [borderColor, canvas]);

  useEffect(() => {
    if (canvas) {
      if (canvas.isDrawingMode) {
        canvas.freeDrawingBrush.width = strokeWidth;
      }
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        activeObject.set("strokeWidth", strokeWidth);
        canvas.renderAll();
      }
    }
  }, [strokeWidth, canvas]);

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

  const addText = (canvi: fabric.Canvas) => {
    const text = new fabric.Textbox("Type Here ...", {
      fill: color,
      fontFamily: roboto.style.fontFamily,
    });
    canvi.add(text);
    canvi.renderAll();
    canvi.isDrawingMode = false;
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
        addRect,
        addCircle,
        addText,
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
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
