import { fabric } from "fabric";

import { generateColorForRecipient, hexToRgba } from "../utils";

import { CheckboxObject, ControlSVGFile, RadioboxSettingFormState } from "@/interface/interface";
import { canvasObject } from "@/constants/canvas";

class RadioboxManager {
  private recipient: string = "";
  private signMode: boolean = false;
  private color: string;
  private required: boolean = true;
  private controlType = canvasObject.radiobox;
  private uid: string;
  private canvi: fabric.Canvas;
  private containerLeft: number;
  private containerTop: number;
  private scaleX: number;
  private scaleY: number;
  private width: number = 83;
  private height: number = 56;
  private currentTop: number;
  private numCheckboxes: number;
  private checkboxesState: boolean[] = [];
  private radioboxElements: fabric.Object[] = [];
  private addButtonElement: fabric.Object[] = [];
  private radioboxGroup: fabric.Group;
  private radioboxWrapper: fabric.Rect;
  private setShowSettingForm: React.Dispatch<React.SetStateAction<RadioboxSettingFormState>>;
  private controlSVGFile: ControlSVGFile;
  private removeCanvasObject: (uid:string)=>void;
  private onlyMyself: boolean;
  private jsonData?: CheckboxObject;

  constructor(
    uid: string,
    canvi: fabric.Canvas,
    startLeft: number,
    startTop: number,
    numCheckboxes: number,
    recipient: string,
    signMode: boolean,
    onlyMyself: boolean,
    setShowSettingForm: React.Dispatch<React.SetStateAction<RadioboxSettingFormState>>,
    controlSVGFile: ControlSVGFile,
    removeCanvasObject: (uid:string)=>void,
    jsonData?: CheckboxObject,
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
    this.onlyMyself = onlyMyself;
    this.color = generateColorForRecipient(recipient);

    this.setShowSettingForm = setShowSettingForm;
    this.removeCanvasObject = removeCanvasObject;

    if (jsonData) {
      this.jsonData = jsonData;
      this.checkboxesState = [...jsonData.checkboxesState]; // Ensure correct synchronization
      this.required = jsonData.required;
      this.scaleX = jsonData.scaleX || 1;
      this.scaleY = jsonData.scaleY || 1;
    } else {
      this.checkboxesState = Array(numCheckboxes).fill(false); // Default initialization
    }

    this.radioboxWrapper = new fabric.Rect();

    this.radioboxGroup = this.createRadioboxGroup();

    // Track events of the radiobox group
    this.trackRadioboxGroup();

    this.setupDeleteKeyHandler();
  }

  private createRadioboxes() {
    this.radioboxElements = [];
    this.checkboxesState = Array(0).fill(false);
    this.containerTop = this.currentTop;

    for (let i = 0; i < this.numCheckboxes; i++) {
      // const rect = new fabric.Rect({
      //   left: this.containerLeft,
      //   top: this.containerTop + 40 * (i + 1) + 20 * i,
      //   width: 32,
      //   height: 32,
      //   fill: "transparent",
      //   stroke: this.color,
      //   strokeWidth: 1,
      //   rx: 10,
      //   ry: 10,
      //   backgroundColor: hexToRgba(this.color, 0.1),
      // });

      // const circle = new fabric.Circle({
      //   left: this.containerLeft + 7,
      //   top: this.containerTop + 40 * (i + 1) + 20 * i + 7,
      //   radius: 9,
      //   fill: "white",
      //   borderColor: `${this.color}`,
      //   stroke: `${this.color}`,
      //   strokeWidth: 2,
      //   selectable: true,
      //   hasControls: false,
      //   lockMovementX: true,
      //   hasBorders: false,
      //   lockMovementY: true,
      // });

      // const radiobox = new fabric.Circle({
      //   left: this.containerLeft + 11.5,
      //   top: this.containerTop + 40 * (i + 1) + 20 * i + 11.5,
      //   radius: 5,
      //   fill: "transparent",
      //   // backgroundColor:hexToRgba(this.color, 0.1),
      //   borderColor: `${this.color}`,
      //   stroke: `${this.color}`,
      //   // strokeWidth: 2,
      //   selectable: true,
      //   hasControls: false,
      //   lockMovementX: true,
      //   hasBorders: false,
      //   lockMovementY: true,
      //   hasRotatingPoint: false,
      //   hoverCursor: "hand",
      // });

      // const group = new fabric.Group([rect, circle, radiobox], {
      //   subTargetCheck: true,
      // });

      // let isChecked = this.checkboxesState[i];

      // radiobox.on("mousedown", () => {
      //   isChecked = !isChecked;
      //   this.checkboxesState[i] = isChecked;
      //   radiobox.set("fill", isChecked ? this.color : "transparent");

      //   this.canvi.renderAll();
      // });
      // Add radiobox and label to elements
      // this.radioboxElements.push(group);
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
      this.addNewCheckbox(this.radioboxElements.length);
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
      console.log(this.checkboxesState)

      this.radioboxWrapper.set({
        height: this.radioboxGroup.height! * this.radioboxGroup.scaleY! + 16,
      });

      this.canvi.renderAll(); // Re-render canvas
    }
  }

  private addNewCheckbox(index:number) {
    this.scaleX = this.scaleX * this.radioboxGroup.scaleX!;
    this.scaleY = this.scaleY * this.radioboxGroup.scaleY!;
  
    this.checkboxesState.push(false);

    let isChecked = this.jsonData ? this.jsonData?.checkboxesState[index] : false;
    console.log(this.jsonData?.checkboxesState[index])
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
      fill: isChecked ? this.color : "transparent",
      borderColor: `${this.color}`,
      stroke: `${this.color}`,
      selectable: true,
      hasControls: false,
      lockMovementX: true,
      hasBorders: false,
      lockMovementY: true,
    });

    radiobox.on("mousedown", () => {
      // Uncheck all radio buttons in this group
      this.radioboxElements.forEach((group, i) => {
        const fabricGroup = group as fabric.Group; // Explicitly cast to fabric.Group
        const radio = fabricGroup.item(2) as unknown as fabric.Circle; // Assuming the radio button is the third item
        radio.set("fill", "transparent");
        this.checkboxesState[i] = false;
      });

      // Check the clicked radio button
      isChecked = true;
      this.checkboxesState[index] = true;
      radiobox.set("fill", this.color);

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
      height: 88 - 32,
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

    this.width = radioboxGroup.getScaledWidth();
    this.height = radioboxGroup.getScaledHeight();

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
      console.log(this.radioboxGroup.getScaledHeight());
      this.width = this.radioboxGroup.getScaledWidth();
      this.height = this.radioboxGroup.getScaledHeight();
      this.containerLeft = this.radioboxGroup.left!;
      this.containerTop = this.radioboxGroup.top!;
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
    if(this.jsonData?.checkboxesState.length! > 0) {
      // this.checkboxesState = this.jsonData?.checkboxesState || [false];
      for (let index = 0; index < this.jsonData?.checkboxesState.length!; index++) {
        this.addNewCheckbox(index);
      }
    }

    if(this.jsonData?.width) {
      this.radioboxGroup.scaleToWidth(this.jsonData.width + 16);
    }

    if(this.jsonData?.height) {
      this.radioboxGroup.scaleToHeight(this.jsonData.height + 16);
    }

    // if(this.jsonData?.scaleX) {
    //   this.radioboxGroup.set({
    //     scaleX: this.jsonData.scaleX
    //   })
    // }

    // if(this.jsonData?.scaleY) {
    //   this.radioboxGroup.set({
    //     scaleX: this.jsonData.scaleY
    //   })
    // }

    this.radioboxWrapper.set({
      height: this.radioboxGroup.height! * this.radioboxGroup.scaleY! + 16,
      width: this.radioboxGroup.width! * this.radioboxGroup.scaleX! + 16
    });

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

      // Trigger React state updates if required
      this.removeCanvasObject(this.uid);

      this.canvi.renderAll();
    }
  }

  public toJson() {
    return JSON.stringify({
      uid: this.uid,
      recipient: this.recipient,
      signMode: this.signMode,
      onlyMyself: this.onlyMyself,
      color: this.color,
      required: this.required,
      controlType: this.controlType,
      containerLeft: this.containerLeft,
      containerTop: this.containerTop,
      scaleX: this.radioboxGroup.scaleX ?? 1, // Ensure scale values are saved
      scaleY: this.radioboxGroup.scaleY ?? 1,
      width: this.radioboxGroup.width ?? 0, // Save the original width
      height: this.radioboxGroup.height ?? 0, // Save the original height
      checkboxesState: this.checkboxesState, // Store checkbox states
      numCheckboxes: this.numCheckboxes,
      radioboxElements: this.radioboxElements.map((el) => el.toObject()), // Store radiobox elements
    });
  }
}

export default RadioboxManager;