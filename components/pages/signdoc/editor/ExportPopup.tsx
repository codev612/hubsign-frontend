import React, { Fragment, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { fabric } from "fabric";
import { Dialog, Transition } from "@headlessui/react";
import { Backdrop } from "@mui/material";
import { useCanvas } from "@/context/canvas";
import { pageHeight, pageWidth } from "@/constants/canvas";
import jsPDF from "jspdf";
import Loader from "./Loader";

interface ExportPopupProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  className: string;
}

const ExportPopup: React.FC<ExportPopupProps> = (props) => {
  const contextValues = useCanvas();
  const [exportCanvas, setExportCanvas] = useState<fabric.StaticCanvas | null>(
    null
  );
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currPage, setCurrPage] = useState<number>(1);
  const [isExporting, setExporting] = useState<boolean>(false);

  useEffect(() => {
    if (exportCanvas && contextValues.edits[currPage]) {
      exportCanvas.loadFromJSON(contextValues.edits[currPage], () => {
        exportCanvas.renderAll(); // Optional: Renders the canvas after loading the JSON
      });
    }
  }, [contextValues.edits, currPage, exportCanvas]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrPage(1);
    setExportCanvas(initCanvas());
  };

  const changePage = (offset: number) => {
    const newPage = currPage + offset;

    setCurrPage(newPage);
    exportCanvas?.clear();
    contextValues.edits[newPage] &&
      exportCanvas?.loadFromJSON(
        contextValues.edits[newPage],
        exportCanvas.renderAll.bind(exportCanvas)
      );
  };

  const initCanvas = () =>
    new fabric.StaticCanvas("canvas-export", {
      isDrawingMode: false,
      height: pageHeight * 12,
      width: pageWidth,
      backgroundColor: "rgba(0,0,0,0)",
    });

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const renderPageToPDF = (pdf: jsPDF, pageNum: number, callback: () => void) => {
    // Load the current page's fabric content from the context
    const canvasElement = exportCanvas?.toCanvasElement();
    if (!canvasElement) return;

    // Draw the Fabric canvas to a data URL (image)
    const imgData = canvasElement.toDataURL("image/png");

    // Add this image as a page in the PDF
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297); // A4 size in mm (210x297mm)
    if (pageNum < numPages!) {
      pdf.addPage(); // Add a new page for the next page of the document
    }

    callback(); // Trigger the next step after rendering
  };

  const onExport = () => {
    setCurrPage(1);
    setExporting(true);
    const pdf = new jsPDF("p", "mm", "a4");

    const exportPDFPages = async () => {
      for (let page = 1; page <= numPages!; page++) {
        setCurrPage(page);
        exportCanvas?.clear();
        // Ensure that the canvas content is loaded and rendered before exporting
        contextValues.edits[page] &&
          exportCanvas?.loadFromJSON(contextValues.edits[page], () => {
            exportCanvas.renderAll(); // Render the current page's canvas
            renderPageToPDF(pdf, page, () => {
              if (page === numPages) {
                // Only save the PDF after all pages are rendered
                setTimeout(() => {
                  pdf.save("Edge_lamp_editor.pdf");
                  setExporting(false);
                  props.setOpen(false); // Close the modal
                }, 500);
              }
            });
          });
      }
    };

    exportPDFPages();
  };

  return (
    <Transition.Root as={Fragment} show={props.open}>
      <Dialog as="div" className="relative z-50" onClose={props.setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 w-full">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`my-6 relative transform overflow-hidden rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transition-all ${
                  contextValues.theme
                    ? "bg-[rgb(26,26,26)] text-white"
                    : "bg-white"
                }`}
              >
                <Backdrop
                  open={isExporting}
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                >
                  <div className="fixed top-[25%]">
                    <Loader />
                  </div>
                </Backdrop>
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <div className="mt-2">
                      <div>
                        {contextValues.selectedFile && (
                          <div className="w-full py-4">
                            <div
                              ref={contextValues.exportPage}
                              id="toExport"
                              style={{
                                opacity: currPage <= numPages! ? "1" : "0",
                              }}
                            >
                              <Document
                                className="flex justify-center"
                                file={contextValues.selectedFile}
                                onLoadSuccess={onDocumentLoadSuccess}
                              >
                                <div className="absolute z-[9]">
                                  <canvas id="canvas-export" />
                                </div>
                                <Page
                                  data-doc-page
                                  className={`px-4 py-2 ${
                                    !isExporting && "shadow-lg border"
                                  } ${contextValues.theme && "border-[rgba(36,36,36,0)]"}`}
                                  height={842}
                                  pageNumber={currPage}
                                  width={595}
                                />
                              </Document>
                            </div>
                            <div
                              className="fixed top-1 flex items-center justify-center w-full gap-3 mt-3 opacity-70"
                              style={{
                                opacity: currPage <= numPages! ? "1" : "0",
                              }}
                            >
                              {currPage > 1 && (
                                <button
                                  className="px-2 py-1 text-sm bg-gray-700 rounded-md text-white"
                                  onClick={() => changePage(-1)}
                                >
                                  {"<"}
                                </button>
                              )}
                              <div className="px-2 py-1 text-sm bg-gray-700 rounded-md text-white">
                                Page {currPage} of {numPages}
                              </div>
                              {currPage < numPages! && (
                                <button
                                  className="px-2 py-1 text-sm bg-gray-700 rounded-md text-white"
                                  onClick={() => changePage(1)}
                                >
                                  {">"}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    type="button"
                    onClick={onExport}
                  >
                    {isExporting ? (
                      <span>Exporting...</span>
                    ) : (
                      <span>Export</span>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ExportPopup;
