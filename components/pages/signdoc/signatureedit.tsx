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
import Cookies from "js-cookie";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import Image from "next/image";

import FileAdd from "../adddoc/fileadd";

import Dot from "@/components/ui/dot";
import { allowedSignatureFile } from "@/constants/common";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onOpenChange: (isOpen: boolean) => void;
  setInitialImage: (dataUrl: string) => void;
}

const fontColor = ["#111111", "#184CAA", "#B92812"];
const fontFamily = [
  "Playwrite Island",
  "Kalam",
  "Rock Salt",
  "Mr Dafoe",
  "La Belle Aurore",
];

const canvasWidth = 840;
const canvasHeight = 260;

const SignatureEditModal: React.FC<ModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  setInitialImage,
}) => {
  const drawRef = useRef<HTMLCanvasElement | null>(null);
  const typeRef = useRef<HTMLCanvasElement | null>(null);
  const [drawCanvas, setDrawCanvas] = useState<fabric.Canvas | null>(null);
  const [typeCanvas, setTypeCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#000");
  const [selectedFont, setSelectedFont] = useState<string>("Playwrite Island");
  const [textInput, setTextInput] = useState<string>("");

  const [filename, setFilename] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<string>("draw");

  type SavedImage = {
    _id: string;
    dataUrl: string;
    type: string;
  };

  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [activeSavedImage, setActiveSavedImage] = useState<string>("");

  // const [activeInitialImage, setActiveInitialImage] = useState<string>("");

  // Initialize Fabric.js Canvas
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (drawRef.current && !drawCanvas) {
          const draw = new fabric.Canvas(drawRef.current, {
            isDrawingMode: true,
            backgroundColor: "rgba(0,0,0,0)",
            stopContextMenu: false,
            height: canvasHeight,
            width: canvasWidth,
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
            height: canvasHeight,
            width: canvasWidth,
            selection: true,
          });

          const textBox = new fabric.Textbox(textInput, {
            left: 30,
            top: 100,
            fontFamily: selectedFont,
            width: canvasWidth,
            // height: canvasHeight,
            fontSize: 72,
            fill: selectedColor,
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

  useEffect(() => {
    if (typeCanvas) {
      document.fonts.load(`16px ${selectedFont}`).then(() => {
        typeCanvas.getObjects("textbox").forEach((obj) => {
          if (obj instanceof fabric.Textbox) {
            obj.set({
              fontFamily: selectedFont,
              fill: selectedColor,
            });
            obj.set("text", textInput);
          }
        });
        typeCanvas.renderAll();
      });
    }
  }, [selectedFont, typeCanvas, textInput, selectedColor]);

  useEffect(() => {
    const fetchSavedImages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/signature?type=${title}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("session") || ""}`,
            },
          },
        );

        if (!response.ok) {
          setSavedImages([]);

          return;
        }

        const json = await response.json();
        setSavedImages(json);
      } catch (error) {
        console.error("Error fetching saved images:", error);
        setSavedImages([]);
      }
    };

    fetchSavedImages();
  }, []); // Add 'title' as a dependency

  // Clear Canvas
  const clearDrawCanvas = () => {
    if (drawCanvas) {
      drawCanvas.clear();
      drawCanvas.setBackgroundColor("rgba(0,0,0,0)", () =>
        drawCanvas.renderAll(),
      );
    }
  };

  const clearTypeCanvas = () => {
    if (typeCanvas) {
      setTextInput("");
    }
  };

  // check file size and type
  const fileCheck = (file: File) => {
    return (file && file!.size > allowedSignatureFile.size) ||
      !allowedSignatureFile.extention.includes(file!.type)
      ? false
      : true;
  };

  const handleSetFile = (file: File) => {
    if (file && fileCheck(file)) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      setFilename("");
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilename("");
  };

  const getCroppedDrawSignatureImage = () => {
    if (!drawCanvas) return null;

    const objects = drawCanvas.getObjects();

    if (objects.length === 0) return null; // No drawing

    drawCanvas.discardActiveObject();
    drawCanvas.renderAll();

    // Get bounding box of all drawn objects
    const boundingRect = drawCanvas.getObjects().reduce(
      (acc, obj) => {
        const objBounds = obj.getBoundingRect();

        return {
          left: Math.min(acc.left, objBounds.left),
          top: Math.min(acc.top, objBounds.top),
          right: Math.max(acc.right, objBounds.left + objBounds.width),
          bottom: Math.max(acc.bottom, objBounds.top + objBounds.height),
        };
      },
      { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity },
    );

    const width = boundingRect.right - boundingRect.left + 60;
    const height = boundingRect.bottom - boundingRect.top + 60;

    if (width <= 0 || height <= 0) return null; // No valid content

    // Convert to transparent PNG with cropping
    return drawCanvas.toDataURL({
      format: "png",
      left: boundingRect.left - 30,
      top: boundingRect.top - 30,
      width,
      height,
      multiplier: 2, // Increases resolution (optional)
    });
  };

  const getCroppedTypedSignatureImage = () => {
    if (!typeCanvas || !textInput) return null;

    const textObj = typeCanvas.getObjects("textbox")[0] as fabric.Textbox;

    if (!textObj) return null; // No text

    typeCanvas.discardActiveObject();
    typeCanvas.renderAll();

    const left = 0;
    const top = textObj.getBoundingRect().top - 30;

    const ctx = document.createElement("canvas").getContext("2d");

    var width = textObj.width;

    if (ctx) {
      ctx.font = `${textObj.fontSize}px ${selectedFont}`;
      width = ctx.measureText(textInput).width + 60;
    }

    const height = textObj.calcTextHeight() + 60;

    console.log(left, top, width, height);

    // Convert to transparent PNG with cropping
    return typeCanvas.toDataURL({
      format: "png",
      left,
      top,
      width,
      height,
    });
  };

  const downloadImage = (dataUrl: string, filename: string) => {
    if (!dataUrl) return;
    const link = document.createElement("a");

    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveInitialImage = async (dataUrl: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/signature`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("session") || ""}`,
          },
          body: JSON.stringify({ dataUrl: dataUrl, type: `${title}` }),
        },
      );

      console.log(response.ok);
      if (!response.ok) {
        return;
      }
      const json = await response.json();

      setSavedImages([
        ...savedImages,
        { dataUrl: json.dataUrl, type: json.type, _id: json._id },
      ]);
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };

  const removeSavedImage = async (id: string) => {
    if (!id) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/signature?`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("session") || ""}`,
          },
          body: JSON.stringify({ id }),
        },
      );

      if (!response.ok) {
        return;
      }

      setSavedImages(savedImages.filter((img) => img._id !== id));
    } catch (error) {
      console.log(error);

      return;
    }
  };

  const handleAccept = () => {
    switch (activeTab) {
      case "draw":
        setInitialImage(getCroppedDrawSignatureImage() || "");
        break;
      case "type":
        setInitialImage(getCroppedTypedSignatureImage() || "");
        break;
      case "upload":
        if (selectedFile) {
          const reader = new FileReader();

          reader.onload = () => {
            const imageData = reader.result as string; // Convert to base64 string

            setInitialImage(imageData);
          };
          reader.readAsDataURL(selectedFile); // Convert file to base64
        } else {
          setInitialImage("");
        }
        break;
      case "saved":
        if (activeSavedImage) {
          setInitialImage(
            savedImages.filter((img) => img._id === activeSavedImage)[0]
              .dataUrl,
          );
        }
        break;
      default:
        break;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      size="4xl"
      onOpenChange={onOpenChange}
    >
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
                destroyInactiveTabPanel={false}
                variant="underlined"
                onSelectionChange={(key) => setActiveTab(String(key))}
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
                          <li key={color}>
                            <button onClick={() => setSelectedColor(color)}>
                              <Dot color={color} size="16px" />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-row gap-1">
                        <button
                          className="flex flex-row items-center gap-1 border-2 rounded-lg hover:bg-gray-100 p-1"
                          onClick={async () => {
                            const drawImage = getCroppedDrawSignatureImage();

                            if (drawImage) {
                              downloadImage(drawImage, "drawn_signature.png");
                              await saveInitialImage(drawImage);
                            }
                          }}
                        >
                          <BookmarkAddedOutlinedIcon />
                          <span>Save this {title}</span>
                        </button>
                        <button
                          className="border-2 rounded-lg p-1 hover:bg-gray-100 p-1"
                          onClick={clearDrawCanvas}
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
                            <li key={color}>
                              <button onClick={() => setSelectedColor(color)}>
                                <Dot color={color} size="16px" />
                              </button>
                            </li>
                          ))}
                        </ul>
                        <select
                          className="border-2 rounded-lg p-1"
                          onChange={(e) => setSelectedFont(e.target.value)}
                        >
                          {fontFamily.map((font) => (
                            <option key={font} value={font}>
                              {font}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-row gap-1">
                        <button
                          className="flex flex-row items-center gap-1 border-2 rounded-lg hover:bg-gray-100 p-1"
                          onClick={async () => {
                            const typeImage = getCroppedTypedSignatureImage();

                            if (typeImage) {
                              downloadImage(typeImage, "typed_signature.png");
                              await saveInitialImage(typeImage);
                            }
                          }}
                        >
                          <BookmarkAddedOutlinedIcon />
                          <span>Save this {title}</span>
                        </button>
                        <button
                          className="border-2 rounded-lg p-1 hover:bg-gray-100 p-1"
                          onClick={clearTypeCanvas}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your signature"
                        type="text"
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
                  <div className={`flex flex-col gap-1 h-[${canvasHeight}px]`}>
                    <div className="flex flex-row justify-end text-text">
                      <div className="flex flex-row gap-1">
                        <button
                          className="flex flex-row items-center gap-1 border-2 rounded-lg hover:bg-gray-100 p-1"
                          onClick={() => {
                            if (selectedFile) {
                              const reader = new FileReader();

                              reader.onload = async () => {
                                const imageData = reader.result as string; // Convert to base64 string

                                // setInitialImage(imageData);
                                await saveInitialImage(imageData);
                              };
                              reader.readAsDataURL(selectedFile); // Convert file to base64
                            }
                          }}
                        >
                          <BookmarkAddedOutlinedIcon />
                          <span>Save this {title}</span>
                        </button>
                        <button
                          className="border-2 rounded-lg p-1 hover:bg-gray-100 p-1"
                          onClick={clearFile}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col text-sm gap-2 items-center justify-center h-[260px] w-full bg-[#F8F8F8]">
                      {selectedFile ? (
                        <Image
                          alt="Uploaded signature"
                          className="max-w-full max-h-full object-contain rounded-md"
                          src={URL.createObjectURL(selectedFile)}
                          width={500}
                          height={300}
                        />
                      ) : (
                        <FileAdd
                          description="Click to upload a document from your device, or drag & drop it here. Supported files: JPG, PNG"
                          filename={filename}
                          setFile={handleSetFile}
                          setFilename={setFilename}
                          title="Upload signature"
                        />
                      )}
                    </div>
                  </div>
                </Tab>
                {/* Saved Tab */}
                <Tab key="saved" title="Saved">
                  <ul className="flex flex-col gap-1">
                    {savedImages.map((img) => (
                      <li
                        key={img._id}
                        className="flex flex-row gap-1 items-center justify-between"
                      >
                        <button
                          className={`bg-[#F8F8F8] ${img._id === activeSavedImage ? "border border-primary" : ""} h-[60px] w-full flex items-center justify-start rounded-lg overflow-hidden`}
                          onClick={() => setActiveSavedImage(img._id)}
                        >
                          <Image
                            alt="initials"
                            className="h-[60px] w-auto object-contain"
                            src={img.dataUrl}
                            width={100}
                            height={100}
                          />
                        </button>
                        <button
                          className="border border-gray-300 rounded-lg hover:bg-gray-100 h-[60px] flex items-center justify-center px-3 text-text"
                          onClick={() => removeSavedImage(img._id)}
                        >
                          <DeleteForeverOutlinedIcon />
                        </button>
                      </li>
                    ))}
                  </ul>
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={onClose}>
                Close
              </Button>
              <Button
                className="text-white"
                color="primary"
                type="submit"
                onPress={() => handleAccept()}
              >
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
