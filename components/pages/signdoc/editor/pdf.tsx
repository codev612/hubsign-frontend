import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { fabric } from 'fabric';
import Cookies from 'js-cookie';
import { useCanvas } from '@/context/canvas';
import Loader from './Loader';
import SideBar from '@/components/pages/signdoc/editor/SideBar';
import ControlBar from './ControlBar';
import { DocData } from '@/interface/interface';
import Checkboxgroup from './settingforms/checkboxgroup';
import TextboxGroup from './settingforms/textboxgroup';
import RadioboxGroup from './settingforms/radioboxgroup';
import DropdownboxGroup from './settingforms/dropdownbox';
import DateboxGroup from './settingforms/dateboxgroup';
import InitialsboxGroup from './settingforms/initialsboxgroup';
import {
  CheckboxGroupProps, 
  TextboxGroupProps, 
  RadioboxGroupProps, 
  DropdownboxGroupProps,
  DateboxGroupProps,
  InitialsboxGroupProps,
} from '@/interface/interface';

const PDFBoard: React.FC = () => {
  const params = useParams();
  const canvasContextValues = useCanvas();

  const [docIsLoading, setDocIsLoading] = useState<boolean>(true);
  const [docData, setDocData] = useState<DocData>({
    filename: "",
    recipients: []
  });

  //variables for setting forms
  const showCheckboxSettingForm = canvasContextValues.showCheckboxSettingForm;
  const setShowCheckboxSettingForm = canvasContextValues.setShowCheckboxSettingForm;

  const showTextboxSettingForm = canvasContextValues.showTextboxSettingForm;
  const setShowTextboxSettingForm = canvasContextValues.setShowTextboxSettingForm;

  const showRadioboxSettingForm = canvasContextValues.showRadioboxSettingForm;
  const setShowRadioboxSettingForm = canvasContextValues.setShowRadioboxSettingForm;

  const showDropdownboxSettingForm = canvasContextValues.showDropdownboxSettingForm;
  const setShowDropdownboxSettingForm = canvasContextValues.setShowDropdownboxSettingForm;

  const showDateboxSettingForm = canvasContextValues.showDateboxSettingForm;
  const setShowDateboxSettingForm = canvasContextValues.setShowDateboxSettingForm;

  const showInitialsboxSettingForm = canvasContextValues.showInitialsboxSettingForm;
  const setShowInitialsboxSettingForm = canvasContextValues.setShowInitialsboxSettingForm;

  // Create a type for our form configuration
  type FormConfig = {
    show: boolean;
    Component: React.ComponentType<any>;
    props: CheckboxGroupProps | TextboxGroupProps | RadioboxGroupProps | DropdownboxGroupProps | DateboxGroupProps | InitialsboxGroupProps;
  }
  
  // Now use these types in your component
  const settingForms: FormConfig[] = [
    {
      show: showCheckboxSettingForm.show,
      Component: Checkboxgroup,
      props: {
        showCheckboxSettingForm,
        setShowCheckboxSettingForm,
        recipients: docData.recipients,
        setCheckboxSetting: canvasContextValues.handleCanvasObjectSetValue
      }
    },
    {
      show: showTextboxSettingForm.show,
      Component: TextboxGroup,
      props: {
        showTextboxSettingForm,
        setShowTextboxSettingForm,
        recipients: docData.recipients,
        setTextboxSetting: canvasContextValues.handleCanvasObjectSetValue
      }
    },
    {
      show: showRadioboxSettingForm.show,
      Component: RadioboxGroup,
      props: {
        showRadioboxSettingForm,
        setShowRadioboxSettingForm,
        recipients: docData.recipients,
        setRadioboxSetting: canvasContextValues.handleCanvasObjectSetValue
      }
    },
    {
      show: showDropdownboxSettingForm.show,
      Component: DropdownboxGroup,
      props: {
        showDropdownboxSettingForm,
        setShowDropdownboxSettingForm,
        recipients: docData.recipients,
        setDropdownboxSetting: canvasContextValues.handleCanvasObjectSetValue,
        signMode: canvasContextValues.signMode
      }
    },
    {
      show: showDateboxSettingForm.show,
      Component: DateboxGroup,
      props: {
        showDateboxSettingForm,
        setShowDateboxSettingForm,
        recipients: docData.recipients,
        setDateboxSetting: canvasContextValues.handleCanvasObjectSetValue,
        signMode: canvasContextValues.signMode
      }
    },
    {
      show: showInitialsboxSettingForm.show,
      Component: InitialsboxGroup,
      props: {
        showInitialsboxSettingForm,
        setShowInitialsboxSettingForm,
        recipients: docData.recipients,
        setInitialsboxSetting: canvasContextValues.handleCanvasObjectSetValue,
        signMode: canvasContextValues.signMode
      }
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
        setDocData({ ...docData, filename: json.filename, recipients: json.recipients });
        canvasContextValues.setRecipients(json.recipients);
      } catch (error) {
        // setError("Failed to fetch data");
        console.error(error);
      } finally {
        // setLoading(false); // Set loading to false when fetching is done
      }
    };
    fetchDocumentData();
  }, [])

  // function onDocumentLoadSuccess({ numPages }: PDFDocumentProxy): void {
  //   canvasContextValues.setEdits({});
  //   canvasContextValues.setNumPages(numPages);
  //   canvasContextValues.setCurrPage(1);
  //   canvasContextValues.setCanvas(initCanvas());
  //   setTimeout(() => setDocIsLoading(false), 2000);
  // }

  // function changePage(offset: number) {
  //   const page = canvasContextValues.currPage;
    
  //   // Save current page state to edits
  //   canvasContextValues.edits[page] = canvasContextValues.canvas!.toObject();
  //   canvasContextValues.setEdits(canvasContextValues.edits);
  
  //   // Update to the next page
  //   canvasContextValues.setCurrPage((page) => page + offset);
  
  //   // Clear and load the canvas with the new page state
  //   canvasContextValues.canvas!.clear();
  //   if (canvasContextValues.edits[page + offset]) {
  //     canvasContextValues.canvas!.loadFromJSON(
  //       canvasContextValues.edits[page + offset],
  //       () => {
  //         console.log("Canvas loaded from JSON");
  //         canvasContextValues.canvas!.renderAll();
  //       }
  //     );
  //   }
  // }

  const onDocumentLoadSuccess = ({ numPages }: PDFDocumentProxy): void => {
    canvasContextValues.setEdits({});
    canvasContextValues.setNumPages(numPages);
    canvasContextValues.setCurrPage(1);
    canvasContextValues.setCanvas(initCanvas());
    setTimeout(() => setDocIsLoading(false), 2000);
  };
  
  const changePage = (offset: number): void => {
    const page = canvasContextValues.currPage;
  
    // Save current page state to edits
    canvasContextValues.edits[page] = canvasContextValues.canvas!.toObject();
    canvasContextValues.setEdits(canvasContextValues.edits);
  
    // Update to the next page
    canvasContextValues.setCurrPage((page) => page + offset);
  
    // Clear and load the canvas with the new page state
    canvasContextValues.canvas!.clear();
    if (canvasContextValues.edits[page + offset]) {
      canvasContextValues.canvas!.loadFromJSON(
        canvasContextValues.edits[page + offset],
        () => {
          console.log("Canvas loaded from JSON");
          canvasContextValues.canvas!.renderAll();
        }
      );
    }
  };

  const initCanvas = (): fabric.Canvas => {
    // Initialize fabric canvas
    const fabricCanvas = new fabric.Canvas('canvas', {
      isDrawingMode: false,
      height: 1123,
      width: 868,
      backgroundColor: 'rgba(0,0,0,0)',
      stopContextMenu: true,
      selection: false,
    });
    
    return fabricCanvas;
  };

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

  return (
    <div className='min-h-[100vh]'>
      <SideBar docData={docData} />
      <div className="w-full">
        <div className="flex flex-col justify-center items-center">
          <div className='w-[868]'>
            <ControlBar />
          </div>
          <div id="singlePageExport" className="flex items-center justify-center">
            {docIsLoading && (
              <>
                <div className="w-[100%] h-[100%] top-[0] fixed bg-[rgba(50,50,50,0.2)] z-[1001] backdrop-blur-sm"></div>
                <div className="fixed z-[1100] flex w-[100%] h-[100%] top-[0] justify-center items-center">
                  <Loader color={"#606060"} size={120} />
                </div>
              </>
            )}
            
            {docData.filename ? <Document
              // file={canvasContextValues.selectedFile}
              file={`${process.env.NEXT_PUBLIC_SERVER_URL}/document/pdf/${docData.filename}`}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex justify-center"
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
                    show ? <Component key={index} {...props} /> : null
                  )}
                </div>
                <div
                  className={`${
                    !canvasContextValues.isExporting && canvasContextValues.theme
                      ? "bg-[rgb(25,25,25)] shadow-[0px_0px_16px_rgb(0,0,0)] border-none"
                      : "shadow-lg border"
                  }`}
                >
                  <Page
                    pageNumber={canvasContextValues.currPage}
                    width={868}
                    height={842}
                  />
                </div>
              </div>
            </Document> : ""}
          </div>
        </div>
        <div className="flex fixed bottom-2 items-center justify-center w-full gap-3 z-50">
          {canvasContextValues.currPage > 1 && (
            <button
              onClick={() => changePage(-1)}
              className="px-4 py-2 bg-gray-700 rounded-md text-white"
            >
              {'<'}
            </button>
          )}
          <div className="px-4 py-2 bg-gray-700 rounded-md text-white">
            Page {canvasContextValues.currPage} of {canvasContextValues.numPages}
          </div>
          {canvasContextValues.currPage < canvasContextValues.numPages! && (
            <button
              onClick={() => changePage(1)}
              className="px-4 py-2 bg-gray-700 rounded-md text-white"
            >
              {'>'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFBoard;
