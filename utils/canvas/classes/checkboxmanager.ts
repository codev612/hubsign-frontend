import { fabric } from "fabric";

import { generateColorForRecipient } from "../utils";
import { CheckboxObject, CheckboxSettingFormState } from "@/interface/interface";
import { canvasObject } from "@/constants/canvas";

class CheckboxManager {
  private controlType = canvasObject.checkbox;
  private recipient: string = "";
  private signMode: boolean = false;
  private color: string;
  private defaultTick: boolean = true;
  private checkedBydefault: boolean = true;
  private required: boolean = true;
  private uid: string;
  private canvi: fabric.Canvas;
  private containerLeft: number;
  private containerTop: number;
  private scaleX: number;
  private scaleY: number;
  private currentTop: number;
  private numCheckboxes: number;
  private checkboxesState: boolean[] = [];
  private checkboxElements: fabric.Object[] = [];
  private addButtonElement: fabric.Object[] = [];
  private checkboxGroup: fabric.Group;
  private tickPattern: fabric.Pattern;
  private crossPattern: fabric.Pattern;
  private setShowSettingForm: React.Dispatch<React.SetStateAction<CheckboxSettingFormState>>;
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
    setShowSettingForm: React.Dispatch<React.SetStateAction<CheckboxSettingFormState>>,
    removeCanvasObject: (uid:string)=>void,
    jsonData?: CheckboxObject,
  ) {
    this.uid = uid;
    this.canvi = canvi;
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

    this.checkboxGroup = this.createCheckboxGroup();

    this.setShowSettingForm = setShowSettingForm;
    this.removeCanvasObject = removeCanvasObject;

    this.checkboxesState = Array(numCheckboxes).fill(this.checkedBydefault); // Initial state of checkboxes

    if(jsonData) {
      this.jsonData = jsonData;
      this.required = jsonData.required;
      this.defaultTick = jsonData.tickPattern ==="tick" ? true : false;
      this.checkedBydefault = jsonData.checkedBydefault;
    }

    // Track events of the checkbox group
    this.trackCheckboxGroup();

    this.tickPattern = this.createPattern()["tick"];
    this.crossPattern = this.createPattern()["cross"];

    this.setupDeleteKeyHandler();
  };

  private createCheckboxes() {
    this.checkboxElements = [];
    this.containerTop = this.currentTop;

    for (let i = 0; i < this.numCheckboxes; i++) {
      const checkbox = new fabric.Rect({
        left: this.containerLeft,
        top: this.containerTop + 40 * (i + 1) + 20 * i,
        width: 20,
        height: 20,
        // fill: this.checkedBydefault ? (this.defaultTick ? this.tickPattern : this.crossPattern) : "transparent",
        fill: this.tickPattern,
        // backgroundColor:this.color,
        borderColor: `${this.color}`,
        stroke: `${this.color}`,
        strokeWidth: 1,
        selectable: true,
        hasControls: false,
        lockMovementX: true,
        hasBorders: false,
        lockMovementY: true,
        rx: 5, // Border radius for horizontal corners
        ry: 5,
      });

      let isChecked = this.checkboxesState[i];

      if(this.onlyMyself || this.signMode)
        checkbox.on("mousedown", () => {
          isChecked = !isChecked;
          this.checkboxesState[i] = isChecked;
          checkbox.set(
            "fill",
            isChecked
              ? this.defaultTick
                ? this.tickPattern
                : this.crossPattern
              : "transparent",
          );

          this.canvi.renderAll();
        });

      // Add checkbox and label to elements
      this.checkboxElements.push(checkbox);
    }
  };

  private createCheckboxGroup(): fabric.Group {
    this.createCheckboxes(); // Initialize checkboxes
    // this.createAddCheckboxButton(); // Add the "+" button to add checkboxes
    const checkboxgroup = new fabric.Group(
      this.addButtonElement.concat(this.checkboxElements),
      {
        left: this.containerLeft,
        top: this.currentTop,
        selectable: true,
        subTargetCheck: true,
      },
    );

    return checkboxgroup;
  };

  // Track scaling of the checkboxGroup
  private trackCheckboxGroup() {
    this.checkboxGroup.on("scaling", () => {
      this.showShowSettingForm();
    });

    this.checkboxGroup.on("mouseup", () => {
      this.showShowSettingForm();
    });

    this.checkboxGroup.on("deselected", () => {
      this.closeShowSettingForm();
    });

    this.checkboxGroup.on("moving", () => {
      // Get the position of the group
      this.containerLeft = this.checkboxGroup.left!;
      this.containerTop = this.checkboxGroup.top!;
      this.closeShowSettingForm();
    });
  };

  private showShowSettingForm() {
    const groupPosition = this.checkboxGroup.getBoundingRect();

    this.setShowSettingForm({
      uid: this.uid,
      show: true,
      position: {
        left: groupPosition.left, // Position horizontally below the group
        top: groupPosition.top + groupPosition.height + 10, // Position vertically below the group
      },
      value: {
        recipient: this.recipient,
        defaultTick: this.defaultTick,
        checkedBydefault: this.checkedBydefault,
        required: this.required,
      },
    });
  };

  private closeShowSettingForm() {
    const groupPosition = this.checkboxGroup.getBoundingRect();

    this.setShowSettingForm({
      uid: this.uid,
      show: false,
      position: {
        left: groupPosition.left, // Position horizontally below the group
        top: groupPosition.top + groupPosition.height + 10, // Position vertically below the group
      },
      value: {
        recipient: this.recipient,
        defaultTick: this.defaultTick,
        checkedBydefault: this.checkedBydefault,
        required: this.required,
      },
    });
  };

  public addToCanvas() {
    this.canvi.add(this.checkboxGroup);
    this.canvi.renderAll();
  };

  public updateCheckboxGroup() {
    console.log("updated");
    // Update the color of each checkbox individually
    this.checkboxElements.forEach((checkbox, index) => {
      checkbox.set({
        stroke: this.color,
        borderColor: this.color,
        fill: ( this.checkedBydefault && (this.onlyMyself || this.signMode) ) ? ( this.defaultTick ? this.tickPattern : this.crossPattern ) : "transparent", // Update the fill based on the state
      });
    });

    this.canvi.renderAll(); // Re-render canvas
  };

  private createPattern() {
    this.color = generateColorForRecipient(this.recipient);

    const patternCanvas = document.createElement("canvas");

    patternCanvas.width = 20;
    patternCanvas.height = 20;
    const ctx = patternCanvas.getContext("2d")!;

    // Recreate the tick pattern
    ctx.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
    ctx.strokeStyle = this.color; // Update the color
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(4, 10);
    ctx.lineTo(8, 14);
    ctx.lineTo(16, 4);
    ctx.stroke();

    const tickPatternDataURL = patternCanvas.toDataURL();
    const tickPattern = new fabric.Pattern({
      source: tickPatternDataURL,
      repeat: "no-repeat",
    });

    ctx.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
    ctx.strokeStyle = this.color; // Update the color
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(4, 4);
    ctx.lineTo(16, 16);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(16, 4);
    ctx.lineTo(4, 16);
    ctx.stroke();

    const crossPatternDataURL = patternCanvas.toDataURL();
    const crossPattern = new fabric.Pattern({
      source: crossPatternDataURL,
      repeat: "no-repeat",
    });

    return {
      tick: tickPattern,
      cross: crossPattern,
    };
  };

  public setValue(value: any) {
    this.recipient = value.recipient;
    this.checkedBydefault = value.defaultCheck;
    this.defaultTick = value.defaultTick === "tick" ? true : false;
    this.required = value.required;

    // Update the color and patterns based on the new recipient
    this.createPattern();
    // // Refresh the checkbox group
    this.updateCheckboxGroup();
  };

  private setupDeleteKeyHandler() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Delete") {
        this.removeGroup();
      }
    });
  };

  public removeGroup() {
    // Remove the checkbox group from the canvas
    const activeObject = this.canvi.getActiveObject();

    if (activeObject === this.checkboxGroup) {
      this.canvi.remove(this.checkboxGroup);

      // Optional: Clear related data if necessary
      this.checkboxElements = [];
      this.checkboxesState = [];
      this.addButtonElement = [];

      this.removeCanvasObject(this.uid);

      this.canvi.renderAll();
    }
  };

  public toJSON() {
    return {
      uid: this.uid,
      controlType: this.controlType,
      containerLeft: this.containerLeft,
      containerTop: this.containerTop,
      scaleX: this.checkboxGroup.scaleX ?? this.scaleX, // Ensure scale is preserved
      scaleY: this.checkboxGroup.scaleY ?? this.scaleY,
      recipient: this.recipient,
      signMode: this.signMode,
      onlyMyself: this.onlyMyself,
      color: this.color,
      required: this.required,
      numCheckboxes: this.numCheckboxes, // Save total checkboxes
      checkboxesState: this.checkboxesState, // Save checkbox states
      checkboxPositions: this.checkboxElements.map(cb => ({
        left: cb.left,
        top: cb.top
      })), // Save individual checkbox positions
      tickPattern: this.defaultTick ? "tick" : "cross", // Store as identifier
      checkedBydefault: this.checkedBydefault // Save default state
    };
  };
}

export default CheckboxManager;