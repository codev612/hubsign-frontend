import { fabric } from "fabric";

import { generateColorForRecipient, hexToRgba } from "../utils";

import { ControlSVGFile, RadioboxSettingFormState } from "@/interface/interface";
import { canvasObject } from "@/constants/canvas";

class RadioboxManager {
  private recipient: string = "";
  private signMode: boolean = false;
  private color: string;
  private defaultTick: boolean = true;
  private checkedBydefault: boolean = true;
  private required: boolean = true;
  private controlType = canvasObject.radiobox;
  private uid: string;
  private canvi: fabric.Canvas;
  private containerLeft: number;
  private containerTop: number;
  private scaleX: number;
  private scaleY: number;
  private currentTop: number;
  private numCheckboxes: number;
  private checkboxObjects: fabric.Object[] = [];
  private checkboxesState: boolean[] = [];
  private elements: fabric.Object[] = [];
  private radioboxElements: fabric.Object[] = [];
  private addButtonElement: fabric.Object[] = [];
  private radioboxGroup: fabric.Group;
  private radioboxWrapper: fabric.Rect;
  private setShowSettingForm: React.Dispatch<React.SetStateAction<RadioboxSettingFormState>>;
  private controlSVGFile: ControlSVGFile;
  private removeCanvasObject: (uid:string)=>void;

  constructor(
    uid: string,
    canvi: fabric.Canvas,
    startLeft: number,
    startTop: number,
    numCheckboxes: number,
    recipient: string,
    signMode: boolean,
    setShowSettingForm: React.Dispatch<React.SetStateAction<RadioboxSettingFormState>>,
    controlSVGFile: ControlSVGFile,
    removeCanvasObject: (uid:string)=>void,
  ) {
    this.uid = uid;
    this.canvi = canvi;
    this.controlSVGFile = controlSVGFile;
    this.containerLeft = startLeft;
    this.containerTop = startTop;
    this.scaleX = 1.0;
    this.scaleY = 1.0;
    this.currentTop = startTop;
    this.numCheckboxes = numCheckboxes;

    this.recipient = recipient;
    this.signMode = signMode;
    this.color = generateColorForRecipient(recipient);

    this.radioboxWrapper = new fabric.Rect();

    this.radioboxGroup = this.createRadioboxGroup();
    this.setShowSettingForm = setShowSettingForm;
    this.removeCanvasObject = removeCanvasObject;

    this.checkboxesState = Array(numCheckboxes).fill(this.checkedBydefault); // Initial state of checkboxes

    // Track events of the radiobox group
    this.trackRadioboxGroup();

    this.setupDeleteKeyHandler();
  }

  private createRadioboxes() {
    this.radioboxElements = [];
    this.containerTop = this.currentTop;

    for (let i = 0; i < this.numCheckboxes; i++) {
      const rect = new fabric.Rect({
        left: this.containerLeft,
        top: this.containerTop + 40 * (i + 1) + 20 * i,
        width: 32,
        height: 32,
        fill: "transparent",
        stroke: this.color,
        strokeWidth: 1,
        rx: 10,
        ry: 10,
        backgroundColor: hexToRgba(this.color, 0.1),
      });

      const circle = new fabric.Circle({
        left: this.containerLeft + 7,
        top: this.containerTop + 40 * (i + 1) + 20 * i + 7,
        radius: 9,
        fill: "white",
        borderColor: `${this.color}`,
        stroke: `${this.color}`,
        strokeWidth: 2,
        selectable: true,
        hasControls: false,
        lockMovementX: true,
        hasBorders: false,
        lockMovementY: true,
      });

      const radiobox = new fabric.Circle({
        left: this.containerLeft + 11.5,
        top: this.containerTop + 40 * (i + 1) + 20 * i + 11.5,
        radius: 5,
        fill: "transparent",
        // backgroundColor:hexToRgba(this.color, 0.1),
        borderColor: `${this.color}`,
        stroke: `${this.color}`,
        // strokeWidth: 2,
        selectable: true,
        hasControls: false,
        lockMovementX: true,
        hasBorders: false,
        lockMovementY: true,
        hasRotatingPoint: false,
        hoverCursor: "hand",
      });

      const group = new fabric.Group([rect, circle, radiobox], {
        subTargetCheck: true,
      });

      let isChecked = this.checkboxesState[i];

      radiobox.on("mousedown", () => {
        isChecked = !isChecked;
        this.checkboxesState[i] = isChecked;
        radiobox.set("fill", isChecked ? this.color : "transparent");

        this.canvi.renderAll();
      });
      // Add radiobox and label to elements
      this.radioboxElements.push(group);
    }
  }

  private createAddCheckboxButton() {
    const buttonWidth = 32; // Desired width
    const buttonHeight = 32; // Desired height

    // Create a rectangle for the button's background
    const buttonBackground = new fabric.Rect({
      left: this.containerLeft,
      top: this.containerTop,
      width: buttonWidth,
      height: buttonHeight,
      stroke: "#F4F4F4",
      strokeWidth: 2,
      fill: "white", // Background color of the button
      rx: 10, // Rounded corners
      ry: 10,
      selectable: false,
      hoverCursor: "pointer",
    });

    // Create the "+" text
    const plusSymbol = new fabric.Text("+", {
      fontSize: 24, // Adjust as needed for the symbol size
      fill: "#000", // Color of the "+"
      selectable: false,
      hoverCursor: "pointer",
      originX: "center",
      originY: "center",
    });

    // Position the "+" text in the center of the button
    plusSymbol.left = this.containerLeft + buttonWidth / 2 + 1;
    plusSymbol.top = this.containerTop + buttonHeight / 2 + 1;

    // Group the rectangle and text together
    const addCheckboxButton = new fabric.Group([buttonBackground, plusSymbol], {
      left: this.containerLeft,
      top: this.containerTop,
      selectable: false,
      hoverCursor: "pointer",
    });

    // Add click event
    addCheckboxButton.on("mousedown", () => {
      this.addNewCheckbox();
      this.showShowSettingForm();
    });

    this.addButtonElement.push(addCheckboxButton);
  }

  private createReduceCheckboxButton() {
    const buttonWidth = 32; // Desired width
    const buttonHeight = 32; // Desired height

    // Create a rectangle for the button's background
    const buttonBackground = new fabric.Rect({
      left: this.containerLeft + 34, // Position it next to the add button
      top: this.containerTop,
      width: buttonWidth,
      height: buttonHeight,
      stroke: "#F4F4F4",
      strokeWidth: 2,
      fill: "white", // Background color of the button
      rx: 10, // Rounded corners
      ry: 10,
      selectable: false,
      hoverCursor: "pointer",
    });

    // Create the "-" text
    const minusSymbol = new fabric.Text("-", {
      fontSize: 24, // Adjust as needed for the symbol size
      fill: "#000", // Color of the "-"
      selectable: false,
      hoverCursor: "pointer",
      originX: "center",
      originY: "center",
    });

    // Position the "-" text in the center of the button
    minusSymbol.left = this.containerLeft + 36 + buttonWidth / 2;
    minusSymbol.top = this.containerTop + buttonHeight / 2;

    // Group the rectangle and text together
    const reduceCheckboxButton = new fabric.Group(
      [buttonBackground, minusSymbol],
      {
        left: this.containerLeft + 34, // Position it next to the add button
        top: this.containerTop,
        selectable: false,
        hoverCursor: "pointer",
      },
    );

    // Add click event
    reduceCheckboxButton.on("mousedown", () => {
      this.removeLastCheckbox();
      this.showShowSettingForm();
    });

    this.addButtonElement.push(reduceCheckboxButton);
  }

  private removeLastCheckbox() {
    if (this.radioboxElements.length > 0) {
      // Remove the last radiobox from the canvas
      const lastRadiobox = this.radioboxElements.pop();

      this.radioboxGroup.removeWithUpdate(lastRadiobox!);

      // Update the state
      this.checkboxesState.pop();

      this.canvi.renderAll(); // Re-render canvas
    }
  }

  private addNewCheckbox() {
    this.scaleX = this.scaleX * this.radioboxGroup.scaleX!;
    this.scaleY = this.scaleY * this.radioboxGroup.scaleY!;

    // this.updatePattern();
    const rect = new fabric.Rect({
      left: this.containerLeft,
      top:
        this.containerTop +
        this.radioboxGroup.getScaledHeight() +
        5 * this.scaleY,
      width: 32 * this.scaleX,
      height: 32 * this.scaleY,
      fill: "transparent",
      stroke: this.color,
      strokeWidth: 1,
      rx: 10 * this.scaleX,
      ry: 10 * this.scaleY,
      backgroundColor: hexToRgba(this.color, 0.1),
    });

    const circle = new fabric.Circle({
      left: this.containerLeft + 7 * this.scaleX,
      top:
        this.containerTop +
        this.radioboxGroup.getScaledHeight() +
        5 * this.scaleY +
        7 * this.scaleY,
      radius: 9,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      fill: "white",
      borderColor: `${this.color}`,
      stroke: `${this.color}`,
      strokeWidth: 2,
      selectable: true,
      hasControls: false,
      lockMovementX: true,
      hasBorders: false,
      lockMovementY: true,
    });

    const radiobox = new fabric.Circle({
      left: this.containerLeft + 11.5 * this.scaleX,
      top:
        this.containerTop +
        this.radioboxGroup.getScaledHeight() +
        5 * this.scaleY +
        11.5 * this.scaleY,
      radius: 5,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      fill: "transparent",
      borderColor: `${this.color}`,
      stroke: `${this.color}`,
      selectable: true,
      hasControls: false,
      lockMovementX: true,
      hasBorders: false,
      lockMovementY: true,
    });

    let isChecked = this.checkboxesState[this.radioboxElements.length];

    radiobox.on("mousedown", () => {
      isChecked = !isChecked;
      this.checkboxesState[this.radioboxElements.length] = isChecked;
      // Remove existing checkmarks
      radiobox.set("fill", isChecked ? this.color : "transparent");

      this.canvi.renderAll();
    });

    const group = new fabric.Group([rect, circle, radiobox], {
      subTargetCheck: true,
    });

    this.radioboxElements.push(group);
    this.radioboxGroup.addWithUpdate(group);
    this.canvi.renderAll();

    this.radioboxWrapper.set({
      height: this.radioboxGroup.height! * this.radioboxGroup.scaleY! + 16,
    });

    this.canvi.renderAll();
  }

  private createRadioboxGroup(): fabric.Group {
    this.createRadioboxes(); // Initialize checkboxes
    this.createAddCheckboxButton(); // Add the "+" button to add checkboxes
    this.createReduceCheckboxButton(); // Add the "-" button to remove checkboxes

    this.radioboxWrapper = new fabric.Rect({
      left: this.containerLeft - 8,
      top: this.containerTop - 8,
      width: 83,
      height: 88,
      fill: "transparent",
      stroke: this.color,
      strokeDashArray: [2, 2, 2, 2],
      strokeWidth: 1,
      rx: 10 * this.scaleX,
      ry: 10 * this.scaleY,
      backgroundColor: hexToRgba(this.color, 0.05),
      selectable: false,
      evented: true,
    });

    this.canvi.add(this.radioboxWrapper);

    const radioboxGroup = new fabric.Group(
      [...this.addButtonElement, ...this.radioboxElements],
      {
        left: this.containerLeft,
        top: this.currentTop,
        borderDashArray: [2, 2, 2, 2],
        padding: 8,
        transparentCorners: false,
        cornerStyle: "circle",
        selectable: true,
        subTargetCheck: true,
        evented: true,
        hasControls: true,
        hasRotatingPoint: false,
        // lockScalingX: true,
        // lockScalingY: true,
        // lockUniScaling: true,
      },
    );

    return radioboxGroup;
  }

  // Track scaling of the radioboxGroup
  private trackRadioboxGroup() {
    this.radioboxGroup.on("modified", () => {
      this.radioboxWrapper.set({
        left: this.radioboxGroup.left! - 8,
        top: this.radioboxGroup.top! - 8,
        width: this.radioboxGroup.width! * this.radioboxGroup.scaleX! + 16,
        height: this.radioboxGroup.height! * this.radioboxGroup.scaleY! + 16,
      });
    });

    this.radioboxGroup.on("scaling", () => {
      this.showShowSettingForm();
      // this.canvi.renderAll();
    });

    this.radioboxGroup.on("mouseup", () => {
      this.showShowSettingForm();
    });

    this.radioboxGroup.on("deselected", () => {
      this.closeShowSettingForm();
    });

    this.radioboxGroup.on("moving", () => {
      // Get the position of the group
      this.containerLeft = this.radioboxGroup.left!;
      this.containerTop = this.radioboxGroup.top!;

      this.radioboxWrapper.set({
        left: this.containerLeft - 8,
        top: this.containerTop - 8,
      });

      this.closeShowSettingForm();
    });
  }

  private showShowSettingForm() {
    const groupPosition = this.radioboxGroup.getBoundingRect();

    this.setShowSettingForm({
      uid: this.uid,
      show: true,
      position: {
        left: groupPosition.left, // Position horizontally below the group
        top: groupPosition.top + groupPosition.height + 10, // Position vertically below the group
      },
      value: {
        recipient: this.recipient,
        required: this.required,
      },
    });
  }

  private closeShowSettingForm() {
    const groupPosition = this.radioboxGroup.getBoundingRect();

    this.setShowSettingForm({
      uid: this.uid,
      show: false,
      position: {
        left: groupPosition.left, // Position horizontally below the group
        top: groupPosition.top + groupPosition.height + 10, // Position vertically below the group
      },
      value: {
        recipient: this.recipient,
        required: this.required,
      },
    });
  }

  public addToCanvas() {
    this.canvi.add(this.radioboxGroup);
    this.canvi.renderAll();
  }

  public updateRadioboxGroup() {
    console.log("updated");
    // Update the color of each radiobox individually
    this.radioboxElements.forEach((radiobox, index) => {
      console.log(radiobox);
      radiobox.set({
        stroke: this.color,
        borderColor: this.color,
        fill: "transparent", // Update the fill based on the state
      });
    });

    this.radioboxWrapper.set({
      backgroundColor: hexToRgba(this.color, 0.05),
      stroke: this.color,
    });

    this.canvi.renderAll();
  }

  public setValue(value: any) {
    this.recipient = value.recipient;
    this.required = value.required;
    this.color = generateColorForRecipient(value.recipient);

    // Refresh the radiobox group
    this.updateRadioboxGroup();
  }

  private setupDeleteKeyHandler() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Delete") {
        this.removeCheckboxGroup();
      }
    });
  }

  public removeCheckboxGroup() {
    // Remove the radiobox group from the canvas
    const activeObject = this.canvi.getActiveObject();

    if (activeObject === this.radioboxGroup) {
      this.canvi.remove(this.radioboxGroup);
      this.canvi.remove(this.radioboxWrapper);

      // Optional: Clear related data if necessary
      this.radioboxElements = [];
      this.checkboxesState = [];
      this.addButtonElement = [];
      this.elements = [];

      // Trigger React state updates if required
      this.removeCanvasObject(this.uid);

      this.canvi.renderAll();
    }
  }
}

export default RadioboxManager;