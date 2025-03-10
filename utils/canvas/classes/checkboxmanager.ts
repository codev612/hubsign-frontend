import { fabric } from "fabric";

import { generateColorForRecipient } from "../utils";
import { CheckboxSettingFormState } from "@/interface/interface";
import { canvasObject } from "@/constants/canvas";

class CheckboxManager {
  private recipient: string = "";
  private signMode: boolean = false;
  private color: string;
  private defaultTick: boolean = true;
  private checkedBydefault: boolean = true;
  private required: boolean = true;
  private controlType = canvasObject.checkbox;
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
  private checkboxElements: fabric.Object[] = [];
  private addButtonElement: fabric.Object[] = [];
  private checkboxGroup: fabric.Group;
  private tickPattern: fabric.Pattern;
  private crossPattern: fabric.Pattern;
  private setShowSettingForm: React.Dispatch<React.SetStateAction<CheckboxSettingFormState>>;
  private removeCanvasObject: (uid:string)=>void;

  constructor(
    uid: string,
    canvi: fabric.Canvas,
    startLeft: number,
    startTop: number,
    numCheckboxes: number,
    recipient: string,
    signMode: boolean,
    setShowSettingForm: React.Dispatch<React.SetStateAction<CheckboxSettingFormState>>,
    removeCanvasObject: (uid:string)=>void
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
    this.color = generateColorForRecipient(recipient);

    this.checkboxGroup = this.createCheckboxGroup();

    this.setShowSettingForm = setShowSettingForm;
    this.removeCanvasObject = removeCanvasObject;

    this.checkboxesState = Array(numCheckboxes).fill(this.checkedBydefault); // Initial state of checkboxes

    // Track events of the checkbox group
    this.trackCheckboxGroup();

    this.tickPattern = this.createPattern()["tick"];
    this.crossPattern = this.createPattern()["cross"];

    this.setupDeleteKeyHandler();
  }

  private createCheckboxes() {
    this.checkboxElements = [];
    this.containerTop = this.currentTop;

    for (let i = 0; i < this.numCheckboxes; i++) {
      console.log(this.tickPattern);
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
        strokeWidth: 2,
        selectable: true,
        hasControls: false,
        lockMovementX: true,
        hasBorders: false,
        lockMovementY: true,
        rx: 5, // Border radius for horizontal corners
        ry: 5,
      });

      let isChecked = this.checkboxesState[i];

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
  }

  private createAddCheckboxButton() {
    const addCheckboxButton = new fabric.Text("+", {
      left: this.containerLeft,
      top: this.containerTop, // Position below checkboxes
      fontSize: 32,
      fill: "#007bff",
      selectable: false,
      hoverCursor: "pointer",
    });

    addCheckboxButton.on("mousedown", () => {
      this.addNewCheckbox();
      this.showShowSettingForm();
    });

    this.addButtonElement.push(addCheckboxButton);
  }

  private addNewCheckbox() {
    this.scaleX = this.scaleX * this.checkboxGroup.scaleX!;
    this.scaleY = this.scaleY * this.checkboxGroup.scaleY!;

    const checkbox = new fabric.Rect({
      left: this.containerLeft,
      top:
        this.containerTop +
        this.checkboxGroup.getScaledHeight() +
        20 * this.scaleY,
      width: 20 * this.scaleX,
      height: 20 * this.scaleY,
      fill: "transparent",
      stroke: "#000",
      strokeWidth: 2,
      selectable: true,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
    });

    let isChecked = this.checkboxesState[this.checkboxElements.length];

    checkbox.on("mousedown", () => {
      isChecked = !isChecked;
      this.checkboxesState[this.checkboxElements.length] = isChecked;
      // checkbox.set('fill', isChecked ? '#000' : 'white');
      // Remove existing checkmarks
      this.checkboxObjects.forEach((obj) => {
        if (
          obj instanceof fabric.Text &&
          obj.text === "✔" &&
          obj.left === checkbox.left &&
          obj.top === checkbox.top
        ) {
          this.checkboxObjects.splice(this.checkboxObjects.indexOf(obj), 1);
        }
      });

      if (isChecked) {
        const checkmark = new fabric.Text("✔", {
          left: this.containerLeft,
          top: this.containerTop,
          fontSize: 18,
          fill: "white",
        });

        this.checkboxObjects.push(checkmark);
        this.canvi.add(checkmark);
      }
      this.canvi.renderAll();
    });

    this.checkboxElements.push(checkbox);
    this.checkboxGroup.addWithUpdate(checkbox);
    this.canvi.renderAll();
  }

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
  }

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
  }

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
  }

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
  }

  public addToCanvas() {
    this.canvi.add(this.checkboxGroup);
    this.canvi.renderAll();
  }

  public updateCheckboxGroup() {
    console.log("updated");
    // Update the color of each checkbox individually
    this.checkboxElements.forEach((checkbox, index) => {
      checkbox.set({
        stroke: this.color,
        borderColor: this.color,
        fill: this.checkedBydefault
          ? this.defaultTick
            ? this.tickPattern
            : this.crossPattern
          : "transparent", // Update the fill based on the state
      });
    });

    this.canvi.renderAll(); // Re-render canvas
  }

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
  }

  public setValue(value: any) {
    this.recipient = value.recipient;
    this.checkedBydefault = value.defaultCheck;
    this.defaultTick = value.defaultTick === "tick" ? true : false;
    this.required = value.required;

    // Update the color and patterns based on the new recipient
    this.createPattern();

    // // Refresh the checkbox group
    this.updateCheckboxGroup();
  }

  private setupDeleteKeyHandler() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Delete") {
        this.removeGroup();
      }
    });
  }

  public removeGroup() {
    // Remove the checkbox group from the canvas
    const activeObject = this.canvi.getActiveObject();

    if (activeObject === this.checkboxGroup) {
      this.canvi.remove(this.checkboxGroup);

      // Optional: Clear related data if necessary
      this.checkboxElements = [];
      this.checkboxesState = [];
      this.addButtonElement = [];
      this.elements = [];

      this.removeCanvasObject(this.uid);

      this.canvi.renderAll();
    }
  }

  //for store on database
  // Serialize the object state
  public serialize(): string {
    const serializableState = {
      uid: this.uid,
      containerLeft: this.containerLeft,
      containerTop: this.containerTop,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      currentTop: this.currentTop,
      numCheckboxes: this.numCheckboxes,
      recipient: this.recipient,
      signMode: this.signMode,
      color: this.color,
      checkedBydefault: this.checkedBydefault,
      defaultTick: this.defaultTick,
      required: this.required,
      checkboxesState: this.checkboxesState,
    };

    return JSON.stringify(serializableState);
  }

  // Restore the object state
  public static deserialize(
    json: string,
    canvi: fabric.Canvas,
    setCheckboxItems: React.Dispatch<React.SetStateAction<number>>,
    setShowSettingForm: React.Dispatch<React.SetStateAction<any>>,
    removeCanvasObject:(uid:string)=>void,
  ): CheckboxManager {
    const parsed = JSON.parse(json);

    const manager = new CheckboxManager(
      parsed.uid,
      canvi,
      parsed.containerLeft,
      parsed.containerTop,
      parsed.numCheckboxes,
      parsed.recipient,
      parsed.signMode,
      setShowSettingForm,
      removeCanvasObject,
    );

    manager.scaleX = parsed.scaleX;
    manager.scaleY = parsed.scaleY;
    manager.currentTop = parsed.currentTop;
    manager.color = parsed.color;
    manager.checkedBydefault = parsed.checkedBydefault;
    manager.defaultTick = parsed.defaultTick;
    manager.required = parsed.required;
    manager.checkboxesState = parsed.checkboxesState;

    // Recreate the checkbox group and patterns
    manager.createPattern();
    manager.updateCheckboxGroup();

    return manager;
  }
}

export default CheckboxManager;

// const manager = new CheckboxManager(...); // Create the manager
// const serializedManager = manager.serialize();

// // Store serializedManager in your database
// Retrieve the serialized object from the database
// const storedJson = /* Fetch from DB */;

// const restoredManager = CheckboxManager.deserialize(
//   storedJson,
//   fabricCanvas, // Pass the fabric.Canvas instance
//   setCheckboxItems, // React state setter
//   setShowSettingForm // React state setter
// );

// // Add the restored manager to the canvas
// restoredManager.addToCanvas();
