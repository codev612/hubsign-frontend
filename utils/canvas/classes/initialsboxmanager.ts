import { fabric } from "fabric";

import {
  generateColorForRecipient,
  hexToRgba,
  updateSvgColors,
} from "../utils";

import { ControlSVGFile, InitialsboxSettingFormState, InitialsboxSettings } from "@/interface/interface";
import {
  canvasControlMinHeight,
  canvasControlMinWidth,
  canvasControlRadious,
} from "@/constants/canvas";

class InitialsboxManager {
  private controlType = "initialsbox";
  private signMode: boolean = false;
  private color: string;
  private uid: string;
  private canvi: fabric.Canvas;
  private containerLeft: number;
  private containerTop: number;
  private scaleX: number;
  private scaleY: number;
  private currentTop: number;
  private textboxesState: boolean[] = [];
  private textbox: fabric.Textbox;
  private border: fabric.Rect;
  private iconBorder: fabric.Rect = new fabric.Rect();
  private iconText: fabric.Text = new fabric.Text("");
  private setShowSettingForm: React.Dispatch<React.SetStateAction<InitialsboxSettingFormState>>;
  private removeCanvasObject: (uid:string)=>void;
  //setting form properties
  private recipient: string = "";
  private required: boolean = true;
  private placeholder: string = "Signed by";
  private initialImage: string = "";
  private enteredText: string = "";
  private controlSVGFile: ControlSVGFile;
  private svgGroup: fabric.Object;
  private svgGearGroup: fabric.Object = new fabric.Object();
  private signImage: fabric.Image;
  private leftPadding: number = 10;

  constructor(
    uid: string,
    canvi: fabric.Canvas,
    startLeft: number,
    startTop: number,
    recipient: string,
    signMode: boolean,
    setShowSettingForm: React.Dispatch<React.SetStateAction<InitialsboxSettingFormState>>,
    controlSVGFile: ControlSVGFile,
    removeCanvasObject: (uid:string)=>void,
  ) {
    this.uid = uid;
    this.canvi = canvi;
    this.containerLeft = startLeft;
    this.containerTop = startTop;
    this.scaleX = 1.0;
    this.scaleY = 1.0;
    this.currentTop = startTop;

    this.recipient = recipient;
    this.signMode = signMode;
    this.controlSVGFile = controlSVGFile;
    this.color = generateColorForRecipient(recipient);

    this.setShowSettingForm = setShowSettingForm;
    this.removeCanvasObject = removeCanvasObject;

    this.textbox = new fabric.Textbox("");
    this.border = new fabric.Rect();
    this.svgGroup = new fabric.Object();
    this.signImage = new fabric.Image("");

    this.tracktextboxGroup();
    this.setupDeleteKeyHandler();
  }

  private createInitialboxes() {
    this.containerTop = this.currentTop;

    const svgString = this.controlSVGFile.initials;
    const updatedSvgString = updateSvgColors(
      svgString,
      hexToRgba(this.color, 0.1),
      hexToRgba(this.color, 1),
    );

    // Load SVG into Fabric.js
    fabric.loadSVGFromString(updatedSvgString, (objects, options) => {
      if (this.svgGroup) {
        this.canvi.remove(this.svgGroup); // Remove existing SVG before adding a new one
      }

      this.svgGroup = fabric.util.groupSVGElements(objects, options);
      (this.svgGroup as fabric.Object & { isSvg?: boolean }).isSvg = true;
      this.svgGroup.set({
        left: this.containerLeft + (200 - 100) / 2,
        top: this.containerTop + (56 - 24) / 2,
        selectable: false,
      });

      this.iconBorder = new fabric.Rect({
        width: 200,
        height: 56,
        left: this.containerLeft,
        top: this.containerTop,
        rx: 10,
        ry: 10,
        fill: hexToRgba(this.color, 0.1),
        stroke: hexToRgba(this.color, 1),
        cornerStyle: "circle",
      });

      this.iconText = new fabric.Text("Initials", {
        fontSize: 18,
        fontFamily: "Gothic",
        left: this.containerLeft + (200 - 100) / 2 + 24 + 8,
        top: this.containerTop + (56 - 18) / 2,
        selectable: false,
      });

      this.trackIconGroup();
      this.canvi.add(this.svgGroup, this.iconBorder, this.iconText);
    });

    this.canvi.renderAll();
  }

  // Track scaling of the textboxGroup
  private tracktextboxGroup() {
    if (this.textbox) {
      this.textbox.on("modified", () => {
        this.border.set({
          left: this.textbox.left! - this.leftPadding,
          top: this.textbox.top! - this.leftPadding,
          width:
            (this.textbox.width! + 1) * this.textbox.scaleX! +
            2 * this.leftPadding,
          height:
            (this.textbox.height! + 2) * this.textbox.scaleY! +
            2 * this.leftPadding,
        });

        this.canvi.renderAll();
      });

      this.textbox.on("scaling", () => {
        // this.showShowSettingForm();
        this.closeShowSettingForm();
        this.border.set({
          strokeDashArray: [2, 2, 2, 2],
          stroke: hexToRgba(this.color, 0.4),
        });
      });

      this.textbox.on("resizing", () => {
        // this.showShowSettingForm();
        this.closeShowSettingForm();
        this.border.set({
          strokeDashArray: [2, 2, 2, 2],
          stroke: hexToRgba(this.color, 0.4),
        });
      });

      this.textbox.on("mouseup", () => {
        this.showShowSettingForm();
        this.border.set({
          strokeDashArray: [0, 0],
          stroke: hexToRgba(this.color, 1),
        });
      });

      this.textbox.on("deselected", () => {
        this.closeShowSettingForm();
      });

      this.textbox.on("moving", () => {
        // Get the position of the group
        this.containerLeft = this.textbox.left!;
        this.containerTop = this.textbox.top!;
        this.border.set({
          strokeDashArray: [2, 2, 2, 2],
          stroke: hexToRgba(this.color, 0.4),
        });
        this.closeShowSettingForm();
      });

      // Catch editing event
      this.textbox.on("editing:entered", () => {
        this.textbox.set({
          fill: "#262626",
        });
        this.canvi.renderAll();
      });

      this.textbox.on("editing:exited", () => {
        if (
          this.textbox.text === this.placeholder ||
          this.textbox.text === ""
        ) {
          this.textbox.set({
            fill: "#6F6F6F",
            text: this.placeholder,
          });
        } else {
          this.textbox.set({
            fill: "#262626",
          });

          this.enteredText = this.textbox.text || "";
        }

        this.canvi.renderAll();
      });
    }
  }

  // Track scaling of the textboxGroup
  private trackIconGroup() {
    this.iconBorder.on("modified", () => {
      this.containerLeft = this.iconBorder.left!;
      this.containerTop = this.iconBorder.top!;

      this.svgGroup.set({
        left:
          this.iconBorder.left! + (this.iconBorder.getScaledWidth() - 100) / 2,
        top:
          this.iconBorder.top! + (this.iconBorder.getScaledHeight() - 24) / 2,
      });

      this.iconText.set({
        left:
          this.iconBorder.left! +
          (this.iconBorder.getScaledWidth() - 100) / 2 +
          24 +
          8,
        top:
          this.iconBorder.top! + (this.iconBorder.getScaledHeight() - 18) / 2,
      });

      this.canvi.renderAll();
    });

    this.iconBorder.on("scaling", () => {
      this.closeShowSettingForm();

      const scaleX = this.iconBorder.scaleX!;
      const scaleY = this.iconBorder.scaleY!;

      const newWidth = this.iconBorder.width! * scaleX;
      const newHeight = this.iconBorder.height! * scaleY;

      // Restrict minimum width and height
      if (newWidth < canvasControlMinWidth) {
        this.iconBorder.scaleX = canvasControlMinWidth / this.iconBorder.width!;
      }
      if (newHeight < canvasControlMinHeight) {
        this.iconBorder.scaleY =
          canvasControlMinHeight / this.iconBorder.height!;
      }

      this.iconBorder.set({
        rx: canvasControlRadious,
        ry: canvasControlRadious,
      });

      this.svgGroup.set({
        left:
          this.iconBorder.left! + (this.iconBorder.getScaledWidth() - 100) / 2,
        top:
          this.iconBorder.top! + (this.iconBorder.getScaledHeight() - 24) / 2,
      });

      this.iconText.set({
        left:
          this.iconBorder.left! +
          (this.iconBorder.getScaledWidth() - 100) / 2 +
          24 +
          8,
        top:
          this.iconBorder.top! + (this.iconBorder.getScaledHeight() - 18) / 2,
      });

      this.svgGearGroup.set({
        left: this.iconBorder.left! + this.iconBorder.getScaledWidth() + 8,
        top:
          this.iconBorder.top! + (this.iconBorder.getScaledHeight() - 24) / 2,
        selectable: false,
      });

      this.canvi.renderAll();
    });

    this.iconBorder.on("resizing", () => {
      this.closeShowSettingForm();
      this.svgGroup.set({
        left:
          this.iconBorder.left! +
          (this.iconBorder.getScaledWidth() / 2 - 24 - 8),
        top:
          this.iconBorder.top! + (this.iconBorder.getScaledHeight() - 24) / 2,
      });

      this.iconText.set({
        left: this.iconBorder.left! + this.iconBorder.getScaledWidth() / 2,
        top:
          this.iconBorder.top! + (this.iconBorder.getScaledHeight() - 24) / 2,
      });

      this.canvi.renderAll();
    });

    this.iconBorder.on("mouseup", () => {
      // this.closeShowSettingForm();
      this.showShowSettingForm();
    });

    this.iconBorder.on("deselected", () => {
      this.closeShowSettingForm();
    });

    this.iconBorder.on("moving", () => {
      this.closeShowSettingForm();
      // Get the position of the group
      this.containerLeft = this.iconBorder.left!;
      this.containerTop = this.iconBorder.top!;

      this.svgGroup.set({
        left:
          this.iconBorder.left! + (this.iconBorder.getScaledWidth() - 100) / 2,
        top:
          this.iconBorder.top! + (this.iconBorder.getScaledHeight() - 24) / 2,
      });

      this.iconText.set({
        left:
          this.iconBorder.left! +
          (this.iconBorder.getScaledWidth() - 100) / 2 +
          24 +
          8,
        top:
          this.iconBorder.top! + (this.iconBorder.getScaledHeight() - 18) / 2,
      });

      this.svgGearGroup.set({
        left: this.iconBorder.left! + this.iconBorder.getScaledWidth() + 8,
        top:
          this.iconBorder.top! + (this.iconBorder.getScaledHeight() - 24) / 2,
      });

      this.canvi.renderAll();
    });
  }

  private showShowSettingForm() {
    const groupPosition = this.iconBorder.getBoundingRect();

    this.setShowSettingForm({
      uid: this.uid,
      show: true,
      position: {
        left: groupPosition.left, // Position horizontally below the group
        top: groupPosition.top + groupPosition.height + 10, // Position vertically below the group
      },
      width: 100,
      value: {
        recipient: this.recipient,
        required: this.required,
        initialImage: this.initialImage,
      },
    });
  }

  private closeShowSettingForm() {
    const groupPosition = this.textbox.getBoundingRect();

    this.setShowSettingForm({
      uid: this.uid,
      show: false,
      position: {
        left: groupPosition.left, // Position horizontally below the group
        top: groupPosition.top + groupPosition.height + 10, // Position vertically below the group
      },
      width: 100,
      value: {
        recipient: this.recipient,
        required: this.required,
        initialImage: this.initialImage,
      },
    });
  }

  public addToCanvas() {
    this.createInitialboxes();
  }

  public setValue(value: InitialsboxSettings) {
    this.recipient = value.recipient;
    this.color = generateColorForRecipient(this.recipient);
    this.required = value.required;
    this.initialImage = value.initialImage;

    if (value.initialImage !== "") {
      this.updateSignedbox();
    } else {
      this.updateIconBorder();
      this.updateSvgColor();
    }
  }

  private updateIconBorder() {
    this.iconBorder.set({
      stroke: hexToRgba(this.color, 1),
      fill: hexToRgba(this.color, 0.05),
    });

    this.canvi.renderAll();
  }

  private updateSvgColor() {
    // Update SVG color and replace existing one
    const svgString = this.controlSVGFile.initials;
    const updatedSvgString = updateSvgColors(
      svgString,
      hexToRgba(this.color, 0.1),
      hexToRgba(this.color, 1),
    );

    // Store the previous position of svgGroup
    let prevLeft = this.svgGroup?.left || this.containerLeft;
    let prevTop = this.svgGroup?.top || this.containerTop;

    // Remove the old SVG before adding a new one
    if (this.svgGroup) {
      this.canvi.remove(this.svgGroup);
      this.canvi.renderAll();
    }

    fabric.loadSVGFromString(updatedSvgString, (objects, options) => {
      this.svgGroup = fabric.util.groupSVGElements(objects, options);
      (this.svgGroup as fabric.Object & { isSvg?: boolean }).isSvg = true;

      // Restore the position and scale of the new SVG
      this.svgGroup.set({
        left: prevLeft,
        top: prevTop,
      });

      this.trackIconGroup();
      this.canvi.add(this.svgGroup);
      this.canvi.renderAll();
    });
  }

  private updateSignedbox() {
    // Store the previous position of svgGroup
    let prevLeft = this.svgGroup?.left || this.containerLeft;
    let prevTop = this.svgGroup?.top || this.containerTop;
    let prevScaleX = this.svgGroup?.scaleX || 1;
    let prevScaleY = this.svgGroup?.scaleY || 1;

    if (this.iconBorder) {
      this.canvi.remove(this.iconBorder);
    }

    if (this.iconText) {
      this.canvi.remove(this.iconText);
    }

    if (this.svgGearGroup) {
      this.canvi.remove(this.svgGroup);
    }

    fabric.Image.fromURL(this.initialImage, (img) => {
      img.scaleToWidth(200);
      img.scaleToHeight(51);
      img.set({
        left: 5,
        top: 5,
        selectable: false,
        originX: "left",
        originY: "top",
      });

      const border = new fabric.Rect({
        left: 0,
        top: 0,
        stroke: this.color,
        strokeWidth: 2,
        fill: "transparent",
        borderColor: "transparent",
        width: img.getScaledWidth() + 15,
        height: 56,
        rx: 10,
        ry: 10,
        evented: true,
      });

      const text = new fabric.Text(this.placeholder, {
        left: 5,
        top: 5,
        fill: "#000",
        fontSize: 10,
        selectable: false,
        originX: "left",
        originY: "top",
      });

      // Create a group
      this.svgGroup = new fabric.Group([border, text, img], {
        left: prevLeft,
        top: prevTop,
        selectable: true,
        scaleX: prevScaleX,
        scaleY: prevScaleY,
      });

      this.signImage = img;
      this.trackIconGroup();
      this.canvi.add(this.svgGroup);
      this.canvi.renderAll();
    });
  }

  public updateTextboxGroup() {
    // Update the color of each checkbox individually
    this.textbox.set({
      // backgroundColor: hexToRgba(this.color, 0.1), // Update the fill based on the state
      borderColor: this.color,
      fill: this.enteredText === "" ? "#6F6F6F" : "#262626",
      text: this.enteredText === "" ? this.placeholder : this.enteredText,
    });

    this.border.set({
      stroke: hexToRgba(this.color, 1),
      backgroundColor: hexToRgba(this.color, 0.05),
    });

    this.canvi.renderAll(); // Re-render canvas
  }

  private setupDeleteKeyHandler() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        this.removeGroup();
      }
    });
  };

  public removeGroup() {
    // Remove the checkbox group from the canvas
    const activeObject = this.canvi.getActiveObject();
    
    if (activeObject === this.textbox || activeObject === this.iconBorder || this.svgGroup) {
      this.canvi.remove(
        this.svgGroup, 
        this.svgGearGroup, 
        this.iconBorder, 
        this.iconText,
        this.textbox,
        this.border,
        this.signImage,
        // this.arrowBottom,
      );
      this.removeCanvasObject(this.uid);

      this.canvi.renderAll();
    }
  };
}

export default InitialsboxManager;