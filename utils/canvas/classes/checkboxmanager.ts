import { v4 as uuidv4 } from 'uuid';
import { generateColorForRecipient } from '../randomcolor';
import { fabric } from 'fabric';

class CheckboxManager {
    private recipient: string = "";
    private signMode: boolean = false;
    private color: string;
    private defaultTick: boolean = true;
    private checkedBydefault: boolean = true;
    private required: boolean = true;
    private controlType = "checkbox";
    private id: string;
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
    private ticketPattern: fabric.Pattern;
    private setCheckboxItems: React.Dispatch<React.SetStateAction<number>>;
    private setShowSettingForm: React.Dispatch<React.SetStateAction<any>>;
   
    constructor(
      canvi: fabric.Canvas,
      startLeft: number,
      startTop: number,
      numCheckboxes: number,
      recipient: string,
      signMode: boolean,
      setCheckboxItems: React.Dispatch<React.SetStateAction<number>>,
      setShowSettingForm: React.Dispatch<React.SetStateAction<any>>,
    ) {
      this.id = uuidv4();
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
  
      this.setCheckboxItems = setCheckboxItems;
      this.setShowSettingForm = setShowSettingForm;

      this.checkboxesState = Array(numCheckboxes).fill(this.checkedBydefault); // Initial state of checkboxes
  
      // Track events of the checkbox group
      this.trackCheckboxGroup();

      const patternCanvas = document.createElement('canvas');
      patternCanvas.width = 20; // Width of the pattern
      patternCanvas.height = 20; // Height of the pattern
      const ctx = patternCanvas.getContext('2d')!;
      
      // Draw a tick mark on the canvas
      ctx.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
      ctx.strokeStyle = this.color; // Use recipient's color
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(4, 10); // Start of the tick
      ctx.lineTo(8, 14); // Middle point of the tick
      ctx.lineTo(16, 4); // End of the tick
      ctx.stroke();

      const patternDataURL = patternCanvas.toDataURL();
      // Create the Fabric.js pattern
      this.ticketPattern = new fabric.Pattern({
          source: patternDataURL,
          repeat: 'repeat',
      });
    }
  
    private createCheckboxes () {
      this.checkboxElements = [];
      this.containerTop = this.currentTop;
      
      for (let i = 0; i < this.numCheckboxes; i++) {
        const checkbox = new fabric.Rect({
          left: this.containerLeft,
          top: this.containerTop + 40 * (i+1) + 20 * i,
          width: 20,
          height: 20,
          // fill: this.checkedBydefault ? "white" : "#000",
          fill: this.checkedBydefault ? this.ticketPattern : "white",
          opacity: 1,
          borderColor: `${this.color}`,
          stroke: `${this.color}`,
          strokeWidth: 2,
          selectable: true,
          hasControls: false,
          lockMovementX: true,
          hasBorders: false,
          lockMovementY: true,
        });
  
        let isChecked = this.checkboxesState[i];
  
        checkbox.on('mousedown', () => {
          isChecked = !isChecked;
          this.checkboxesState[i] = isChecked;
          checkbox.set('fill', isChecked ? this.ticketPattern : "white");

          this.canvi.renderAll();
        });
        // Add checkbox and label to elements
        this.checkboxElements.push(checkbox);
      }
    }
  
    private createAddCheckboxButton() {
      const addCheckboxButton = new fabric.Text('+', {
        left: this.containerLeft,
        top: this.containerTop, // Position below checkboxes
        fontSize: 32,
        fill: '#007bff',
        selectable: false,
        hoverCursor: 'pointer',
      });
  
      addCheckboxButton.on('mousedown', () => {
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
        top: this.containerTop + this.checkboxGroup.getScaledHeight() + 20 * this.scaleY ,
        width: 20 * this.scaleX,
        height: 20 * this.scaleY,
        fill: 'white',
        stroke: '#000',
        strokeWidth: 2,
        selectable: true,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
      });
  
      let isChecked = this.checkboxesState[this.checkboxElements.length];
  
      checkbox.on('mousedown', () => {
        isChecked = !isChecked;
        this.checkboxesState[this.checkboxElements.length] = isChecked;
        // checkbox.set('fill', isChecked ? '#000' : 'white');
  
        // Remove existing checkmarks
        this.checkboxObjects.forEach((obj) => {
          if (obj instanceof fabric.Text && obj.text === '✔' && obj.left === checkbox.left && obj.top === checkbox.top) {
            this.checkboxObjects.splice(this.checkboxObjects.indexOf(obj), 1);
          }
        });
  
        if (isChecked) {
          const checkmark = new fabric.Text('✔', {
            left: this.containerLeft,
            top: this.containerTop,
            fontSize: 18,
            fill: 'white',
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
      const checkboxtgroup = new fabric.Group(this.addButtonElement.concat(this.checkboxElements), {
        left: this.containerLeft,
        top: this.currentTop,
        selectable: true,
        subTargetCheck: true,
      });
      return checkboxtgroup;
    }
  
    // Track scaling of the checkboxGroup
    private trackCheckboxGroup() {
      this.checkboxGroup.on('scaling', () => {
        this.showShowSettingForm();
      });
      this.checkboxGroup.on('selected', () => {
        this.showShowSettingForm();
      });
      this.checkboxGroup.on('moving', () => {
        // Get the position of the group
        this.containerLeft = this.checkboxGroup.left!;
        this.containerTop = this.checkboxGroup.top!;
        this.showShowSettingForm();
      });
    }
  
    private showShowSettingForm() {
      const groupPosition = this.checkboxGroup.getBoundingRect();
      this.setShowSettingForm({
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
  
    public addToCanvas() {
      this.canvi.add(this.checkboxGroup);
      this.canvi.renderAll();
    }
  
    public updateCheckboxGroup() {
      console.log("updated");
      this.canvi.renderAll(); // Re-render canvas
    }
}

export default CheckboxManager;