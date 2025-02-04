import { generateColorForRecipient, hexToRgba } from '../utils';
import { fabric } from 'fabric';
import { ControlSVGFile } from '@/interface/interface';

class RadioboxManager {
    private recipient: string = "";
    private signMode: boolean = false;
    private color: string;
    private defaultTick: boolean = true;
    private checkedBydefault: boolean = true;
    private required: boolean = true;
    private controlType = "radiobox";
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
    private tickPattern: fabric.Pattern;
    private crossPattern: fabric.Pattern;
    private setCheckboxItems: React.Dispatch<React.SetStateAction<number>>;
    private setShowSettingForm: React.Dispatch<React.SetStateAction<any>>;
    private controlSVGFile: ControlSVGFile;
   
    constructor(
      uid: string,
      canvi: fabric.Canvas,
      startLeft: number,
      startTop: number,
      numCheckboxes: number,
      recipient: string,
      signMode: boolean,
      setCheckboxItems: React.Dispatch<React.SetStateAction<number>>,
      setShowSettingForm: React.Dispatch<React.SetStateAction<any>>,
      controlSVGFile: ControlSVGFile,
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

      this.tickPattern = new fabric.Pattern({ source: '', repeat: 'no-repeat' });
      this.crossPattern = new fabric.Pattern({ source: '', repeat: 'no-repeat' });
      this.createPattern();

      this.radioboxGroup = this.createRadioboxGroup();
  
      this.setCheckboxItems = setCheckboxItems;
      this.setShowSettingForm = setShowSettingForm;

      this.checkboxesState = Array(numCheckboxes).fill(this.checkedBydefault); // Initial state of checkboxes
  
      // Track events of the radiobox group
      this.trackRadioboxGroup();

      this.setupDeleteKeyHandler();
    }
  
    private createRadioboxes () {
      this.radioboxElements = [];
      this.containerTop = this.currentTop;
      
      for (let i = 0; i < this.numCheckboxes; i++) {
        const rect = new fabric.Rect({
          left: this.containerLeft,
          top: this.containerTop + 40 * (i+1) + 20 * i,
          width: 32,
          height: 32,
          fill: "transparent",
          stroke: this.color,
          strokeWidth: 1,
          rx:10,
          ry:10,
        });

        const circle = new fabric.Circle({
          left: this.containerLeft + 7,
          top: this.containerTop + 40 * (i+1) + 20 * i + 7,
          radius: 9,
          fill: "white",
          // backgroundColor: "white",
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
            top: this.containerTop + 40 * (i+1) + 20 * i + 11.5,
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
        });

        const group = new fabric.Group([rect, circle, radiobox], {
          subTargetCheck: true,
        });
  
        let isChecked = this.checkboxesState[i];
  

        radiobox.on('mousedown', () => {
            isChecked = !isChecked;
            this.checkboxesState[i] = isChecked;
            radiobox.set('fill', isChecked ? this.color : "transparent");

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
          fill: "#f4f4f4", // Background color of the button
          rx: 10, // Rounded corners
          ry: 10,
          selectable: false,
          hoverCursor: 'pointer',
        });
      
        // Create the "+" text
        const plusSymbol = new fabric.Text('+', {
          fontSize: 24, // Adjust as needed for the symbol size
          fill: '#000', // Color of the "+"
          selectable: false,
          hoverCursor: 'pointer',
          originX: 'center',
          originY: 'center',
        });
      
        // Position the "+" text in the center of the button
        plusSymbol.left = this.containerLeft + buttonWidth / 2 + 1;
        plusSymbol.top = this.containerTop + buttonHeight / 2 + 1;
      
        // Group the rectangle and text together
        const addCheckboxButton = new fabric.Group([buttonBackground, plusSymbol], {
          left: this.containerLeft,
          top: this.containerTop,
          selectable: false,
          hoverCursor: 'pointer',
        });
      
        // Add click event
        addCheckboxButton.on('mousedown', () => {
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
          fill: "#f4f4f4", // Background color of the button
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
        const reduceCheckboxButton = new fabric.Group([buttonBackground, minusSymbol], {
          left: this.containerLeft + 34, // Position it next to the add button
          top: this.containerTop,
          selectable: false,
          hoverCursor: "pointer",
        });
      
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
          top: this.containerTop + this.radioboxGroup.getScaledHeight() + 5 * this.scaleY,
          width: 32 * this.scaleX,
          height: 32 * this.scaleY,
          fill: "transparent",
          stroke: this.color,
          strokeWidth: 1,
          rx: 10 * this.scaleX,
          ry: 10 * this.scaleY,
        });

        const circle = new fabric.Circle({
          left: this.containerLeft + 7 * this.scaleX,
          top: this.containerTop + this.radioboxGroup.getScaledHeight() + 5 * this.scaleY + 7 * this.scaleY,
          radius: 9 * this.scaleX,
          fill: "white",
          borderColor: `${this.color}`,
          stroke: `${this.color}`,
          strokeWidth: 2 * this.scaleX,
          selectable: true,
          hasControls: false,
          lockMovementX: true,
          hasBorders: false,
          lockMovementY: true,
        });

        const radiobox = new fabric.Circle({
            left: this.containerLeft + 11.5 * this.scaleX,
            top: this.containerTop + this.radioboxGroup.getScaledHeight() + 5 * this.scaleY + 11.5 * this.scaleY,
            radius: 5 * this.scaleX,
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
    
        radiobox.on('mousedown', () => {
            isChecked = !isChecked;
            this.checkboxesState[this.radioboxElements.length] = isChecked;    
            // Remove existing checkmarks
            radiobox.set('fill', isChecked ? this.color : "transparent");

            this.canvi.renderAll();
        });
        
        const group = new fabric.Group([rect, circle, radiobox], {
          subTargetCheck: true,
        });


        this.radioboxElements.push(group);
        this.radioboxGroup.addWithUpdate(group);
        this.canvi.renderAll();
    }

    private createRadioboxGroup(): fabric.Group {
    
        this.createRadioboxes(); // Initialize checkboxes
        this.createAddCheckboxButton(); // Add the "+" button to add checkboxes
        this.createReduceCheckboxButton(); // Add the "-" button to remove checkboxes
      
        const radioboxGroup = new fabric.Group([...this.addButtonElement, ...this.radioboxElements], {
          left: this.containerLeft,
          top: this.currentTop,
          transparentCorners: false,
          cornerStyle: "circle",
          backgroundColor: hexToRgba(this.color, 1),
          fill: hexToRgba(this.color, 1),
          selectable: true,
          subTargetCheck: true,
        });
        return radioboxGroup;
    }
  
    // Track scaling of the radioboxGroup
    private trackRadioboxGroup() {
      this.radioboxGroup.on('scaling', () => {
        this.showShowSettingForm();
        // this.canvi.renderAll();
      });
      this.radioboxGroup.on('mouseup', () => {
        this.showShowSettingForm();
      });
      this.radioboxGroup.on('deselected', () => {
        this.closeShowSettingForm();
      });
      this.radioboxGroup.on('moving', () => {
        // Get the position of the group
        this.containerLeft = this.radioboxGroup.left!;
        this.containerTop = this.radioboxGroup.top!;
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
          defaultTick: this.defaultTick,
          checkedBydefault: this.checkedBydefault,
          required: this.required,
        }
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
          defaultTick: this.defaultTick,
          checkedBydefault: this.checkedBydefault,
          required: this.required,
        }
      });
    }
  
    public addToCanvas() {
      this.canvi.add(this.radioboxGroup);
      this.canvi.renderAll();
    }
  
    public updateCheckboxGroup() {
      console.log("updated");
      // Update the color of each radiobox individually
      this.radioboxElements.forEach((radiobox, index) => {
        radiobox.set({
          stroke: this.color,
          borderColor: this.color,
          fill: "transparent", // Update the fill based on the state
        });
      });

      this.canvi.renderAll() // Re-render canvas
    }

    private createPattern () {

      this.color = generateColorForRecipient(this.recipient);

      const patternCanvas = document.createElement('canvas');
      patternCanvas.width = 20;
      patternCanvas.height = 20;
      const ctx = patternCanvas.getContext('2d')!;

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
      this.tickPattern = new fabric.Pattern({
          source: tickPatternDataURL,
          repeat: 'no-repeat',
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
      this.crossPattern = new fabric.Pattern({
          source: crossPatternDataURL,
          repeat: 'no-repeat',
      });
    }

    private updatePattern() {

      this.color = generateColorForRecipient(this.recipient);
    
      const patternCanvas = document.createElement('canvas');
      patternCanvas.width = 20 * this.scaleX;  // Adjust width based on scale
      patternCanvas.height = 20 * this.scaleY; // Adjust height based on scale
      const ctx = patternCanvas.getContext('2d')!;
    
      // Recreate the tick pattern
      ctx.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
      ctx.strokeStyle = this.color; // Update the color
      ctx.lineWidth = 2 * this.scaleX; // Adjust stroke width based on scale
      ctx.beginPath();
      ctx.moveTo(4 * this.scaleX, 10 * this.scaleY);
      ctx.lineTo(8 * this.scaleX, 14 * this.scaleY);
      ctx.lineTo(16 * this.scaleX, 4 * this.scaleY);
      ctx.stroke();
    
      const tickPatternDataURL = patternCanvas.toDataURL();
      this.tickPattern = new fabric.Pattern({
          source: tickPatternDataURL,
          repeat: 'no-repeat',
      });
    
      ctx.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2 * this.scaleX;
      ctx.beginPath();
      ctx.moveTo(4 * this.scaleX, 4 * this.scaleY);
      ctx.lineTo(16 * this.scaleX, 16 * this.scaleY);
      ctx.stroke();
    
      ctx.beginPath();
      ctx.moveTo(16 * this.scaleX, 4 * this.scaleY);
      ctx.lineTo(4 * this.scaleX, 16 * this.scaleY);
      ctx.stroke();
    
      const crossPatternDataURL = patternCanvas.toDataURL();
      this.crossPattern = new fabric.Pattern({
          source: crossPatternDataURL,
          repeat: 'no-repeat',
      });
    }
    

    public setValue(value:any) {
      this.recipient = value.recipient;
      this.checkedBydefault = value.defaultCheck;
      this.defaultTick = value.defaultTick==="tick" ? true:false;
      this.required = value.required;

      // Update the color and patterns based on the new recipient
      this.createPattern()   

      // // Refresh the radiobox group
      this.updateCheckboxGroup();
    }

    private setupDeleteKeyHandler() {
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Delete' || event.key === 'Backspace') {
          this.removeCheckboxGroup();
        }
      });
    }

    public removeCheckboxGroup() {
      // Remove the radiobox group from the canvas
      const activeObject = this.canvi.getActiveObject();
      if (activeObject === this.radioboxGroup) {
        this.canvi.remove(this.radioboxGroup);
    
        // Optional: Clear related data if necessary
        this.radioboxElements = [];
        this.checkboxesState = [];
        this.addButtonElement = [];
        this.elements = [];
        
        // Trigger React state updates if required
        this.setShowSettingForm({ show: false });
      
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
      controlSVGFile: ControlSVGFile,
    ): RadioboxManager {
      const parsed = JSON.parse(json);
  

      const manager = new RadioboxManager(
        parsed.uid,
        canvi,
        parsed.containerLeft,
        parsed.containerTop,
        parsed.numCheckboxes,
        parsed.recipient,
        parsed.signMode,
        setCheckboxItems,
        setShowSettingForm,
        controlSVGFile
      );

      manager.scaleX = parsed.scaleX;
      manager.scaleY = parsed.scaleY;
      manager.currentTop = parsed.currentTop;
      manager.color = parsed.color;
      manager.checkedBydefault = parsed.checkedBydefault;
      manager.defaultTick = parsed.defaultTick;
      manager.required = parsed.required;
      manager.checkboxesState = parsed.checkboxesState;
  
      // Recreate the radiobox group and patterns
      manager.createPattern();
      manager.updateCheckboxGroup();
  
      return manager;
    }
}

export default RadioboxManager;

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
