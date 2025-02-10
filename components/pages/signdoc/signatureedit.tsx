import { useEffect, useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
  Input,
} from "@heroui/react";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import { fabric } from "fabric";
import Dot from "@/components/common/dot";

import { Kalam, Rock_Salt, Mr_Dafoe, La_Belle_Aurore } from 'next/font/google';
// import { Font } from "next/dist/compiled/@vercel/og/satori";

const kalam = Kalam({ subsets: ['latin'], weight: '400', variable: '--font-kalam' });
const rockSalt = Rock_Salt({ subsets: ['latin'], weight: '400', variable: '--font-rockSalt' });
const mrDafoe = Mr_Dafoe({ subsets: ['latin'], weight: '400', variable: '--font-mrDafoe' });
const laBelleAurore = La_Belle_Aurore({ subsets: ['latin'], weight: '400', variable: '--font-laBelleAurore' });

interface ModalProps {
  isOpen: boolean;
  title: string;
  actionState: ({ state, data }: { state: boolean; data: any }) => void;
  onOpenChange: (isOpen: boolean) => void;
}

const fontColor = ["#111111", "#184CAA", "#B92812"];
const fontFamily = [
  "Playwrite Island",
  "Kalam",
  "Rock Salt",
  "Mr Dafoe",
  "La Belle Aurore",
];

const SignatureEditModal: React.FC<ModalProps> = ({
  isOpen,
  onOpenChange,
  title,
}) => {
  const drawRef = useRef<HTMLCanvasElement | null>(null);
  const typeRef = useRef<HTMLCanvasElement | null>(null);
  const [drawCanvas, setDrawCanvas] = useState<fabric.Canvas | null>(null);
  const [typeCanvas, setTypeCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedColor, setSelectedColor] = useState("#000");
  const [selectedFont, setSelectedFont] = useState("Playwrite Island");
  const [textInput, setTextInput] = useState("");

  // Initialize Fabric.js Canvas
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (drawRef.current && !drawCanvas) {
          const draw = new fabric.Canvas(drawRef.current, {
            isDrawingMode: true,
            backgroundColor: "rgba(0,0,0,0)",
            stopContextMenu: false,
            height: 260,
            width: 464,
            selection: false,
          });

          draw.freeDrawingBrush.color = selectedColor;
          draw.freeDrawingBrush.width = 2;

          setDrawCanvas(draw);
        }

        if (typeRef.current && !typeCanvas) {
          const type = new fabric.Canvas(typeRef.current, {
            isDrawingMode: false,
            backgroundColor: "rgba(0,0,0,0)",
            stopContextMenu: false,
            height: 260,
            width: 464,
            selection: true,
          });

          const textBox = new fabric.Textbox(textInput, {
            fontFamily: selectedFont,
            width: 464,
            top: 115,
            fontSize: 64,
            editable: false,
            selectable: false,
            hasControls: false,
            hasBorders: false,
            evented: false,
          });

          document.fonts.load(`16px ${selectedFont}`).then(() => {
            type.add(textBox);
            type.renderAll();
          });

          setTypeCanvas(type);
        }
      }, 200); // Delay to ensure modal is rendered

      return () => clearTimeout(timer);
    } else {
      drawCanvas?.dispose();
      typeCanvas?.dispose();
      setDrawCanvas(null);
      setTypeCanvas(null);
    }
  }, [isOpen]);

  // Update brush color when selectedColor changes
  useEffect(() => {
    if (drawCanvas && drawCanvas.isDrawingMode) {
      drawCanvas.freeDrawingBrush.color = selectedColor;
    }
  }, [selectedColor, drawCanvas]);

  // Add typed text to canvas
  const addTextToCanvas = () => {
    if (typeCanvas && textInput.trim()) {
      const text = new fabric.Text(textInput, {
        left: 50,
        top: 50,
        fontSize: 24,
        fill: selectedColor,
        fontFamily: "Arial",
      });
      typeCanvas.add(text);
      typeCanvas.renderAll();
    }
  };

  useEffect(() => {
    if (typeCanvas) {
      document.fonts.load(`16px ${selectedFont}`).then(() => {
        typeCanvas.getObjects("textbox").forEach((obj) => {
          if (obj instanceof fabric.Textbox) {
            obj.set({
              fontFamily: selectedFont,
            });
            obj.set("text", textInput);
          }
        });
        typeCanvas.renderAll();
      });
    }
  }, [selectedFont, typeCanvas, textInput]);  

  // Clear Canvas
  const clearDrawCanvas = () => {
    if (drawCanvas) {
      drawCanvas.clear();
      drawCanvas.setBackgroundColor("rgba(0,0,0,0)", () => drawCanvas.renderAll());
    }
  };

  const clearTypeCanvas = () => {
    if (typeCanvas) {
      typeCanvas.clear();
      typeCanvas.setBackgroundColor("rgba(0,0,0,0)", () => typeCanvas.renderAll());
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <Tabs
                aria-label="Options"
                classNames={{
                  tabList:
                    "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                  cursor: "w-full bg-primary",
                  tab: "max-w-fit p-0 h-12",
                  tabContent: "group-data-[selected=true]:text-primary",
                }}
                color="primary"
                variant="underlined"
                destroyInactiveTabPanel={false}
                // selectedKey={"type"}
                // defaultSelectedKey={"type"}
              >
                {/* Draw Tab */}
                <Tab key="draw" title="Draw">
                  <div className="flex flex-col text-sm gap-2 text-text">
                    <div className="flex flex-row justify-between">
                      <ul className="flex flex-row items-center gap-1">
                        <li>Color:</li>
                        {fontColor.map((color) => (
                          <li key={color} onClick={() => setSelectedColor(color)}>
                            <Dot size="16px" color={color} />
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-row gap-1">
                        <button className="flex flex-row items-center gap-1 border-2 rounded-lg hover:bg-gray-100 p-1">
                          <BookmarkAddedOutlinedIcon />
                          <span>Save this {title}</span>
                        </button>
                        <button
                          onClick={clearDrawCanvas}
                          className="border-2 rounded-lg p-1 hover:bg-gray-100 p-1"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="h-[260px] bg-[#F8F8F8] rounded-md">
                      <canvas ref={drawRef} />
                    </div>
                  </div>
                </Tab>
                {/* Type Tab */}
                <Tab key="type" title="Type">
                  <div className="flex flex-col text-sm gap-2 text-text">
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-row gap-1">
                        <ul className="flex flex-row items-center gap-1">
                          <li>Color:</li>
                          {fontColor.map((color) => (
                            <li key={color} onClick={() => setSelectedColor(color)}>
                              <Dot size="16px" color={color} />
                            </li>
                          ))}
                        </ul>
                        <select className="border-2 rounded-lg p-1" onChange={(e)=>setSelectedFont(e.target.value)}>
                          {fontFamily.map((font) => (
                            <option value={font} key={font}>
                              {font}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-row gap-1">
                        <button className="flex flex-row items-center gap-1 border-2 rounded-lg hover:bg-gray-100 p-1">
                          <BookmarkAddedOutlinedIcon />
                          <span>Save this {title}</span>
                        </button>
                        <button
                          onClick={clearTypeCanvas}
                          className="border-2 rounded-lg p-1 hover:bg-gray-100 p-1"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Type your signature"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                      />
                      {/* <Button onPress={addTextToCanvas} color="primary" className="text-white">
                        Add
                      </Button> */}
                    </div>
                    <div className="h-[260px] bg-[#F8F8F8] rounded-md">
                      <canvas ref={typeRef} />
                    </div>
                  </div>
                </Tab>
                {/* Upload Tab */}
                <Tab key="upload" title="Upload">
                  <div className="flex flex-col text-sm gap-2">
                    <input type="file" className="border p-2 rounded-lg" />
                  </div>
                </Tab>
                {/* Saved Tab */}
                <Tab key="saved" title="Saved">
                  <p className="text-center text-gray-500">No saved signatures.</p>
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={onClose}>
                Close
              </Button>
              <Button type="submit" className="text-white" color="primary">
                Accept and Sign
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SignatureEditModal;
