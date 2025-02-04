import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { fabric } from 'fabric';
import Cookies from 'js-cookie';
import { useButtons } from '@/context/canvas';
import Loader from './Loader';
import SideBar from '@/components/pages/signdoc/editor/SideBar';
import ControlBar from './ControlBar';
import { DocData } from '@/interface/interface';
import Checkboxgroup from './settingforms/checkboxgroup';
import TextboxGroup from './settingforms/textboxgroup';
import RadioboxGroup from './settingforms/radioboxgroup';

const PDFBoard: React.FC = () => {
  const params = useParams();
  const contextValues = useButtons();
  const [docIsLoading, setDocIsLoading] = useState<boolean>(true);
  const [docData, setDocData] = useState<DocData>({
    filename: "",
    recipients: []
  });
  //setting form controls 
  const showCheckboxSettingForm = contextValues.showCheckboxSettingForm;
  const setShowCheckboxSettingForm = contextValues.setShowCheckboxSettingForm;

  const showTextboxSettingForm = contextValues.showTextboxSettingForm;
  const setShowTextboxSettingForm = contextValues.setShowTextboxSettingForm;

  const showRadioboxSettingForm = contextValues.showRadioboxSettingForm;
  const setShowRadioboxSettingForm = contextValues.setShowRadioboxSettingForm;

  // const { getRootProps, getInputProps } = useDropzone({
  //   onDrop: (files: File[]) => {
  //     setDocIsLoading(true);
  //     contextValues.setFile(files[0]);
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
      } catch (error) {
        // setError("Failed to fetch data");
        console.error(error);
      } finally {
        // setLoading(false); // Set loading to false when fetching is done
      }
    };
    fetchDocumentData();
  }, [])

  function onDocumentLoadSuccess({ numPages }: PDFDocumentProxy): void {
    contextValues.setEdits({});
    contextValues.setNumPages(numPages);
    contextValues.setCurrPage(1);
    contextValues.setCanvas(initCanvas());
    setTimeout(() => setDocIsLoading(false), 2000);
  }

  function changePage(offset: number) {
    const page = contextValues.currPage;
    
    // Save current page state to edits
    contextValues.edits[page] = contextValues.canvas!.toObject();
    contextValues.setEdits(contextValues.edits);
  
    // Update to the next page
    contextValues.setCurrPage((page) => page + offset);
  
    // Clear and load the canvas with the new page state
    contextValues.canvas!.clear();
    if (contextValues.edits[page + offset]) {
      contextValues.canvas!.loadFromJSON(
        contextValues.edits[page + offset],
        () => {
          console.log("Canvas loaded from JSON");
          contextValues.canvas!.renderAll();
        }
      );
    }
  }

  const initCanvas = (): fabric.Canvas => {
    // Initialize fabric canvas
    const fabricCanvas = new fabric.Canvas('canvas', {
      isDrawingMode: false,
      height:1123,
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
              // file={contextValues.selectedFile}
              file={`${process.env.NEXT_PUBLIC_SERVER_URL}/document/pdf/${docData.filename}`}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex justify-center"
            >
              <div id="doc">
                <div
                  className="absolute z-[9] p-0"
                  id="canvasWrapper"
                  style={{ visibility: "visible" }}
                >
                  <canvas id="canvas" />
                  {/* setting form controls */}
                  {showCheckboxSettingForm.show && <Checkboxgroup 
                    showCheckboxSettingForm={showCheckboxSettingForm} 
                    setShowCheckboxSettingForm={setShowCheckboxSettingForm}
                    recipients={docData.recipients}
                    setCheckboxSetting={contextValues.handleCanvasObjectSetValue}
                  />}
                  {showTextboxSettingForm.show && <TextboxGroup 
                    showTextboxSettingForm={showTextboxSettingForm} 
                    setShowTextboxSettingForm={setShowTextboxSettingForm}
                    recipients={docData.recipients}
                    setTextboxSetting={contextValues.handleCanvasObjectSetValue}
                  />}
                  {showRadioboxSettingForm.show && <RadioboxGroup 
                    showRadioboxSettingForm={showRadioboxSettingForm} 
                    setShowRadioboxSettingForm={setShowRadioboxSettingForm}
                    recipients={docData.recipients}
                    setRadioboxSetting={contextValues.handleCanvasObjectSetValue}
                  />}
                </div>
                <div
                  className={`${
                    !contextValues.isExporting && contextValues.theme
                      ? "bg-[rgb(25,25,25)] shadow-[0px_0px_16px_rgb(0,0,0)] border-none"
                      : "shadow-lg border"
                  }`}
                >
                  <Page
                    pageNumber={contextValues.currPage}
                    width={868}
                    height={842}
                  />
                </div>
              </div>
            </Document> : ""}
          </div>
        </div>
        <div className="flex fixed bottom-2 items-center justify-center w-full gap-3 z-50">
          {contextValues.currPage > 1 && (
            <button
              onClick={() => changePage(-1)}
              className="px-4 py-2 bg-gray-700 rounded-md text-white"
            >
              {'<'}
            </button>
          )}
          <div className="px-4 py-2 bg-gray-700 rounded-md text-white">
            Page {contextValues.currPage} of {contextValues.numPages}
          </div>
          {contextValues.currPage < contextValues.numPages! && (
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
