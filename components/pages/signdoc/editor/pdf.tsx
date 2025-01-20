import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useDropzone } from 'react-dropzone';
import { fabric } from 'fabric';
import { useButtons } from '@/context/canvas';
import { MdClose } from 'react-icons/md';
import Loader from './Loader';
import { Icon } from './Icon';
import SideBar from '@/components/pages/signdoc/editor/SideBar';
import ControlBar from './ControlBar';

const PDFBoard: React.FC = () => {
  const contextValues = useButtons();
  const [docIsLoading, setDocIsLoading] = useState<boolean>(false);

  const showSettingForm = contextValues.showSettingForm;
  const setShowSettingForm = contextValues.setShowSettingForm;

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files: File[]) => {
      setDocIsLoading(true);
      contextValues.setFile(files[0]);
    },
    accept: {
      'application/pdf': ['.pdf']
    }
  });

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
    });
    
    return fabricCanvas;
  };

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

  return (
    <div className='min-h-[100vh]'>
      {contextValues.selectedFile && <SideBar />}
      {contextValues.selectedFile ? (
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
              
              <Document
                file={contextValues.selectedFile}
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
                    {showSettingForm.show && (
                      <div
                        style={{
                          position: 'absolute',
                          left: showSettingForm.position.left,
                          top: showSettingForm.position.top,
                          background: '#fff',
                          padding: '20px',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        {/* Your form content goes here */}
                        <p>Form for Checkbox Settings</p>
                        {/* Example input fields */}
                        <label htmlFor="numCheckboxes">Number of checkboxes:</label>
                        <input
                          id="numCheckboxes"
                          type="number"
                          // value={checkboxItems}
                          // onChange={(e) => setCheckboxItems(Number(e.target.value))}
                        />
                        <button onClick={() => setShowSettingForm({
                          show: false,
                          position: { left: 0, top: 0 }
                        })}>Close</button>
                      </div>
                    )}
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
              </Document>
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
      ) : (
        <div
          className="w-full min-h-[100vh] py-8 flex items-center justify-center"
          {...getRootProps()}
        >
          <div className="flex w-[40vw] h-[40vh] justify-center items-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
            <div className="space-y-1 text-center">
              <Icon />
              <div className={`flex text-md ${contextValues.theme ? 'text-gray-400' : 'text-gray-600'}`}>
                <label className="relative cursor-pointer rounded-md bg-transparent font-medium text-indigo-500 hover:text-indigo-500">
                  <span>Upload a file</span>
                </label>
                <input
                  type="file"
                  className="sr-only"
                  accept="application/pdf"
                  {...getInputProps()}
                />
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-sm">PDF</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFBoard;
