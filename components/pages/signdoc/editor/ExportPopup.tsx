import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { fabric } from 'fabric';
import { Dialog, Transition } from '@headlessui/react';
import { useButtons } from '@/context/canvas';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Backdrop } from '@mui/material';
import Loader from './Loader';

interface ExportPopupProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  className: string;
}

const ExportPopup: React.FC<ExportPopupProps> = (props) => {
  const contextValues = useButtons();
  const [exportCanvas, setExportCanvas] = useState<fabric.StaticCanvas | null>(null);
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
      exportCanvas?.loadFromJSON(contextValues.edits[newPage], exportCanvas.renderAll.bind(exportCanvas));
  };

  const initCanvas = () =>
    new fabric.StaticCanvas('canvas-export', {
      isDrawingMode: false,
      height: 842,
      width: 595,
      backgroundColor: 'rgba(0,0,0,0)',
    });
    
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

  const onExport = () => {
    setCurrPage(1);
    setExporting(true);
    const docToExport = document.querySelector("#toExport") as HTMLElement;
    const pdf = new jsPDF("p", "mm", "a4");

    setTimeout(() => {
      let i = 0;
      const intervalId = setInterval(() => {
        html2canvas(docToExport)
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, 100,100);
          });

        i += 1;
        if (i <= numPages!) {
          changePage(1);
          pdf.addPage();
          pdf.setPage(i);
        } else {
          stopInterval();
        }
      }, 3000);

      const stopInterval = () => {
        clearInterval(intervalId);
        // Get the total number of pages
        const pageCount = (pdf as any).internal.getNumberOfPages();
        // Delete the last page
        pdf.deletePage(pageCount);
        // Save the PDF
        pdf.save("Edge_lamp_editor.pdf");
        setExporting(false);
        props.setOpen(false);
      };

    }, 1000);
  };

  return (
    <Transition.Root show={props.open} as={Fragment}>
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
                  contextValues.theme ? "bg-[rgb(26,26,26)] text-white" : "bg-white"
                }`}
              >
                <Backdrop
                  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={isExporting}
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
                              style={{ opacity: currPage <= numPages! ? '1' : '0' }}
                            >
                              <Document
                                file={contextValues.selectedFile}
                                onLoadSuccess={onDocumentLoadSuccess}
                                className="flex justify-center"
                              >
                                <div className="absolute z-[9]">
                                  <canvas id="canvas-export" />
                                </div>
                                <Page
                                  pageNumber={currPage}
                                  data-doc-page // Use a data attribute instead of id
                                  className={`px-4 py-2 ${
                                    !isExporting && 'shadow-lg border'
                                  } ${contextValues.theme && "border-[rgba(36,36,36,0)]"}`}
                                  width={595}
                                  height={842}
                                />
                              </Document>
                            </div>
                            <div
                              className="fixed top-1 flex items-center justify-center w-full gap-3 mt-3 opacity-70"
                              style={{ opacity: currPage <= numPages! ? '1' : '0' }}
                            >
                              {currPage > 1 && (
                                <button
                                  onClick={() => changePage(-1)}
                                  className="px-2 py-1 text-sm bg-gray-700 rounded-md text-white"
                                >
                                  {'<'}
                                </button>
                              )}
                              <div className="px-2 py-1 text-sm bg-gray-700 rounded-md text-white">
                                Page {currPage} of {numPages}
                              </div>
                              {currPage < numPages! && (
                                <button
                                  onClick={() => changePage(1)}
                                  className="px-2 py-1 text-sm bg-gray-700 rounded-md text-white"
                                >
                                  {'>'}
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
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    onClick={onExport}
                  >
                    {isExporting ? <span>Exporting...</span> : <span>Export</span>}
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
