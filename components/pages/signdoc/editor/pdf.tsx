import type { PDFDocumentProxy } from "pdfjs-dist";

import { Document, Page, pdfjs } from "react-pdf";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { fabric } from "fabric";
import Cookies from "js-cookie";
import { Divider } from "@heroui/react";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import SkipPreviousOutlinedIcon from "@mui/icons-material/SkipPreviousOutlined";
import SkipNextOutlinedIcon from "@mui/icons-material/SkipNextOutlined";

import Loader from "./Loader";
import ControlBar from "./ControlBar";
import Checkboxgroup from "./settingforms/checkboxgroup";
import TextboxGroup from "./settingforms/textboxgroup";
import RadioboxGroup from "./settingforms/radioboxgroup";
import DropdownboxList from "./settingforms/dropdownlist";
import DateboxCalendar from "./settingforms/dateboxcalendar";
import InitialsboxGroup from "./settingforms/initialsboxgroup";
import DateboxSetting from "./settingforms/dateboxsetting";
import DropdownboxSetting from "./settingforms/dropdownsetting";

import {
  CheckboxGroupProps,
  TextboxGroupProps,
  RadioboxGroupProps,
  DropdownboxGroupProps,
  DateboxSettingProps,
  DateboxCalendarProps,
  InitialsboxGroupProps,
} from "@/interface/interface";
import { DocData, DropdownboxListProps } from "@/interface/interface";
import SideBar from "@/components/pages/signdoc/editor/SideBar";
import { useCanvas } from "@/context/canvas";
import { pageHeight, pageWidth } from "@/constants/canvas";

const PDFBoard: React.FC = () => {
  const params = useParams();
  const canvasContextValues = useCanvas();

  const [docIsLoading, setDocIsLoading] = useState<boolean>(true);
  const [docData, setDocData] = useState<DocData>({
    filename: "",
    recipients: [],
  });

  const [numPages, setNumPages] = useState<number>(0);

  const pdfWrapperRef = useRef<HTMLDivElement | null>(null);

  //tracking pdf scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!pdfWrapperRef.current) return;

      const pages = pdfWrapperRef.current.querySelectorAll(".react-pdf__Page");
      let currentPage = canvasContextValues.currPage;

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const { top } = page.getBoundingClientRect();

        // If the page is near the top of the viewport, set it as the current page
        if (top >= 0 && top < window.innerHeight / 2) {
          currentPage = i + 1;
          break;
        }
      }

      if (canvasContextValues.currPage !== currentPage) {
        console.log(currentPage);
        canvasContextValues.setCurrPage(currentPage);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [numPages, canvasContextValues]);

  const scrollToPage = (pageNumber: number) => {
    if (!pdfWrapperRef.current) return;

    const pages = pdfWrapperRef.current.querySelectorAll(".react-pdf__Page");

    if (pageNumber > 0 && pageNumber <= pages.length) {
      const targetPage = pages[pageNumber - 1] as HTMLElement;

      if (targetPage) {
        window.scrollTo({
          top: targetPage.offsetTop - 100,
          behavior: "smooth",
        });
      }
    }
  };

  //variables for setting forms
  const showCheckboxSettingForm = canvasContextValues.showCheckboxSettingForm;
  const setShowCheckboxSettingForm =
    canvasContextValues.setShowCheckboxSettingForm;

  const showTextboxSettingForm = canvasContextValues.showTextboxSettingForm;
  const setShowTextboxSettingForm =
    canvasContextValues.setShowTextboxSettingForm;

  const showRadioboxSettingForm = canvasContextValues.showRadioboxSettingForm;
  const setShowRadioboxSettingForm =
    canvasContextValues.setShowRadioboxSettingForm;

  const showDropdownboxSettingForm =
    canvasContextValues.showDropdownboxSettingForm;
  const setShowDropdownboxSettingForm =
    canvasContextValues.setShowDropdownboxSettingForm;

  const showDropdownboxListForm = canvasContextValues.showDropdownboxListForm;
  const setShowDropdownboxListForm =
    canvasContextValues.setShowDropdownboxListForm;

  const showDateboxSettingForm = canvasContextValues.showDateboxSettingForm;
  const setShowDateboxSettingForm =
    canvasContextValues.setShowDateboxSettingForm;

  const showDateboxCalendarForm = canvasContextValues.showDateboxCalendarForm;
  const setShowDateboxCalendarForm =
    canvasContextValues.setShowDateboxCalendarForm;

  const showInitialsboxSettingForm =
    canvasContextValues.showInitialsboxSettingForm;
  const setShowInitialsboxSettingForm =
    canvasContextValues.setShowInitialsboxSettingForm;

  // Create a type for our form configuration
  type FormConfig = {
    show: boolean;
    Component: React.ComponentType<any>;
    props:
      | CheckboxGroupProps
      | TextboxGroupProps
      | RadioboxGroupProps
      | DropdownboxGroupProps
      | DropdownboxListProps
      | DateboxSettingProps
      | DateboxCalendarProps
      | InitialsboxGroupProps;
  };

  // Now use these types in your component
  const settingForms: FormConfig[] = [
    {
      show: showCheckboxSettingForm.show,
      Component: Checkboxgroup,
      props: {
        showCheckboxSettingForm,
        setShowCheckboxSettingForm,
        recipients: docData.recipients,
        setCheckboxSetting: canvasContextValues.handleCanvasObjectSetValue,
      },
    },
    {
      show: showTextboxSettingForm.show,
      Component: TextboxGroup,
      props: {
        showTextboxSettingForm,
        setShowTextboxSettingForm,
        recipients: docData.recipients,
        setTextboxSetting: canvasContextValues.handleCanvasObjectSetValue,
      },
    },
    {
      show: showRadioboxSettingForm.show,
      Component: RadioboxGroup,
      props: {
        showRadioboxSettingForm,
        setShowRadioboxSettingForm,
        recipients: docData.recipients,
        setRadioboxSetting: canvasContextValues.handleCanvasObjectSetValue,
      },
    },
    {
      show: showDropdownboxSettingForm.show,
      Component: DropdownboxSetting,
      props: {
        showDropdownboxSettingForm,
        setShowDropdownboxSettingForm,
        recipients: docData.recipients,
        setDropdownboxSetting: canvasContextValues.handleCanvasObjectSetValue,
        signMode: canvasContextValues.signMode,
      },
    },
    {
      show: showDropdownboxListForm.show,
      Component: DropdownboxList,
      props: {
        showDropdownboxListForm,
        setShowDropdownboxListForm,
        recipients: docData.recipients,
        setDropdownboxList: canvasContextValues.handleCanvasObjectSetValue,
        signMode: canvasContextValues.signMode,
      },
    },
    {
      show: showDateboxSettingForm.show,
      Component: DateboxSetting,
      props: {
        showDateboxSettingForm,
        setShowDateboxSettingForm,
        recipients: docData.recipients,
        setDateboxSetting: canvasContextValues.handleCanvasObjectSetValue,
        signMode: canvasContextValues.signMode,
      },
    },
    {
      show: showDateboxCalendarForm.show,
      Component: DateboxCalendar,
      props: {
        showDateboxCalendarForm,
        setShowDateboxCalendarForm,
        recipients: docData.recipients,
        setDateboxCalendar: canvasContextValues.handleCanvasObjectSetValue,
        signMode: canvasContextValues.signMode,
      },
    },
    {
      show: showInitialsboxSettingForm.show,
      Component: InitialsboxGroup,
      props: {
        showInitialsboxSettingForm,
        setShowInitialsboxSettingForm,
        recipients: docData.recipients,
        setInitialsboxSetting: canvasContextValues.handleCanvasObjectSetValue,
        signMode: canvasContextValues.signMode,
      },
    },
  ];

  // const { getRootProps, getInputProps } = useDropzone({
  //   onDrop: (files: File[]) => {
  //     setDocIsLoading(true);
  //     canvasContextValues.setFile(files[0]);
  //   },
  //   accept: {
  //     'application/pdf': ['.pdf']
  //   }
  // });

  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/document/${params.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("session") || ""}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const json = await response.json();

        setDocData({
          ...docData,
          filename: json.filename,
          recipients: json.recipients,
        });
        canvasContextValues.setRecipients(json.recipients);
      } catch (error) {
        // setError("Failed to fetch data");
        console.error(error);
      } finally {
        // setLoading(false); // Set loading to false when fetching is done
      }
    };

    fetchDocumentData();
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: PDFDocumentProxy): void => {
    canvasContextValues.setEdits({});
    setNumPages(numPages);
    canvasContextValues.setNumPages(numPages);
    canvasContextValues.setCurrPage(1);
    canvasContextValues.setCanvas(initCanvas(numPages));
    setTimeout(() => setDocIsLoading(false), 2000);
  };

  const initCanvas = (pages: number): fabric.Canvas => {
    // Initialize fabric canvas
    const fabricCanvas = new fabric.Canvas("canvas", {
      isDrawingMode: false,
      height: pageHeight * pages,
      width: pageWidth,
      backgroundColor: "rgba(0,0,0,0)",
      stopContextMenu: true,
      selection: false,
    });

    return fabricCanvas;
  };

  const exportPDF = async () => {
    if (!canvasContextValues.canvas) return;

    // Step 1: Load the existing PDF
    const existingPdfBytes = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/document/pdf/${docData.filename}`,
    ).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Step 2: Add canvas data as images on each page
    const canvas = canvasContextValues.canvas;

    for (let i = 0; i < numPages; i++) {
      const page = pdfDoc.getPage(i);

      // Set the current page on the canvas
      canvasContextValues.setCurrPage(i + 1);
      canvas.renderAll(); // Rerender the current page to ensure it's updated

      // Convert canvas to image
      const imageDataUrl = canvas.toDataURL({
        format: "png",
        multiplier: 2, // Higher quality export
      });

      // Embed the image into the PDF
      // const pngImage = await pdfDoc.embedPng(imageDataUrl);
      // const { width, height } = page.getSize();

      // page.drawImage(pngImage, {
      //   x: 0,
      //   y: 0,
      //   width,
      //   height,
      // });
    }

    // Step 3: Download the modified PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Trigger download
    const link = document.createElement("a");

    link.href = url;
    link.download = `${docData.filename.replace(".pdf", "")}-signed.pdf`;
    link.click();
  };

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  return (
    <div className="min-h-[100vh]">
      <SideBar docData={docData} />
      <div className="w-full">
        <div className="flex flex-col justify-center items-center">
          <div className="w-[868]">
            <ControlBar docData={docData} exportPDF={exportPDF} />
          </div>
          <div
            className="flex items-center justify-center"
            id="singlePageExport"
          >
            {docIsLoading && (
              <>
                <div className="w-[100%] h-[100%] top-[0] fixed bg-[rgba(50,50,50,0.2)] z-[1001] backdrop-blur-sm" />
                <div className="fixed z-[1100] flex w-[100%] h-[100%] top-[0] justify-center items-center">
                  <Loader color={"#606060"} size={120} />
                </div>
              </>
            )}

            {docData.filename ? (
              <div ref={pdfWrapperRef} id="pdfWrapper">
                <Document
                  // file={canvasContextValues.selectedFile}
                  className="flex justify-center"
                  file={`${process.env.NEXT_PUBLIC_SERVER_URL}/document/pdf/${docData.filename}`}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <div id="doc">
                    <div
                      className="absolute z-[9] p-0"
                      // id="canvasWrapper"
                      style={{ visibility: "visible" }}
                    >
                      <canvas id="canvas" />
                      {/* Render setting form Components Dynamically */}
                      {settingForms.map(({ show, Component, props }, index) =>
                        show ? <Component key={index} {...props} /> : null,
                      )}
                    </div>
                    <div
                      className={`${
                        !canvasContextValues.isExporting &&
                        canvasContextValues.theme
                          ? "bg-[rgb(25,25,25)] shadow-[0px_0px_16px_rgb(0,0,0)] border-none"
                          : "shadow-lg border"
                      }`}
                    >
                      {/* <Page
                    pageNumber={canvasContextValues.currPage}
                    width={868}
                    height={842}
                  /> */}
                      {Array.from({ length: numPages }, (_, i) => (
                        <div key={i}>
                          <Page
                            key={i}
                            height={1123}
                            pageNumber={i + 1}
                            width={868}
                          />
                          <Divider />
                        </div>
                      ))}
                    </div>
                  </div>
                </Document>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex fixed bottom-2 items-center justify-center w-full gap-3 z-50">
          {canvasContextValues.currPage > 1 && (
            <div className="flex flex-row gap-1">
              <button
                className="px-4 py-2 bg-gray-700 rounded-md text-white"
                onClick={() => scrollToPage(1)}
              >
                <SkipPreviousOutlinedIcon />
              </button>
              <button
                className="px-4 py-2 bg-gray-700 rounded-md text-white"
                onClick={() => scrollToPage(canvasContextValues.currPage - 1)}
              >
                <ArrowBackIosOutlinedIcon fontSize="small" />
              </button>
            </div>
          )}
          <div className="px-4 py-2 bg-gray-700 rounded-md text-white">
            {canvasContextValues.currPage} of {numPages}
          </div>
          {canvasContextValues.currPage < numPages && (
            <div className="flex flex-row gap-1">
              <button
                className="px-4 py-2 bg-gray-700 rounded-md text-white"
                onClick={() => scrollToPage(canvasContextValues.currPage + 1)}
              >
                <ArrowForwardIosOutlinedIcon fontSize="small" />
              </button>
              <button
                className="px-4 py-2 bg-gray-700 rounded-md text-white"
                onClick={() => scrollToPage(numPages)}
              >
                <SkipNextOutlinedIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFBoard;
