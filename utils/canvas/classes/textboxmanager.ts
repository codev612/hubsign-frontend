import { generateColorForRecipient, hexToRgba } from '../randomcolor';
import { fabric } from 'fabric';
import { Text } from 'fabric/fabric-impl';

class TextboxManager {
    
    private signMode: boolean = false;
    private color: string;
    
    private controlType = "textbox";
    private uid: string;
    private canvi: fabric.Canvas;
    private containerLeft: number;
    private containerTop: number;
    private scaleX: number;
    private scaleY: number;
    private currentTop: number;
    private numtextboxes: number;
    private textboxesState: boolean[] = [];
    private textbox: fabric.Object;
    private border: fabric.Object;
    private setShowSettingForm: React.Dispatch<React.SetStateAction<any>>;
    //setting form properties
    private recipient: string = "";
    private required: boolean = true;
    private placeholder: string = "Enter value";
    private textvalue: string="Text";
    private customPlaceholder: boolean=false;
   
    constructor(
      uid: string,
      canvi: fabric.Canvas,
      startLeft: number,
      startTop: number,
      numtextboxes: number,
      recipient: string,
      signMode: boolean,
      setShowSettingForm: React.Dispatch<React.SetStateAction<any>>,
    ) {
      this.uid = uid;
      this.canvi = canvi;
      this.containerLeft = startLeft;
      this.containerTop = startTop;
      this.scaleX = 1.0;
      this.scaleY = 1.0;
      this.currentTop = startTop;
      this.numtextboxes = numtextboxes;

      this.recipient = recipient;
      this.signMode = signMode;
      this.color = generateColorForRecipient(recipient);
  
      this.setShowSettingForm = setShowSettingForm;
      
      this.textbox = new fabric.Textbox("");
      this.border = new fabric.Rect();

      this.tracktextboxGroup();
    }
    
    private createtextboxes() {
        this.containerTop = this.currentTop;

        // Create a border rectangle
        this.border = new fabric.Rect({
          left: this.containerLeft,
          top: this.containerTop,
          width: 100 + 2,
          height: 14 + 2,
          stroke: hexToRgba(this.color, 1),
          strokeDashArray: [0, 0],
          strokeWidth: 1,
          fill: 'transparent',
          selectable: false,
          evented: true,
          // rx: 4,
          // ry: 4,
        });
    
        // Create the textbox
        this.textbox = new fabric.Textbox(this.textvalue, {
            left: this.containerLeft,
            top: this.containerTop,
            width: 100,
            fontSize: 14,
            textAlign: "center",
            backgroundColor: hexToRgba(this.color, 0.05),
            fill: "#000",
            borderColor: this.color,
            cornerStyle: "circle",
            transparentCorners: false,
            evented: true,
        });

        this.tracktextboxGroup();

        this.canvi.add(this.border, this.textbox);
        this.canvi.renderAll();
    }
    
    // Track scaling of the textboxGroup
    private tracktextboxGroup() {
      this.textbox.on('modified', () => {
        console.log(this.scaleX, this.scaleY);
        this.border.set({
            left: this.textbox.left,
            top: this.textbox.top,
            width: this.textbox.width,
            height: this.textbox.height,
            scaleX: this.textbox.scaleX,
            scaleY: this.textbox.scaleY,
        });
        this.canvi.renderAll();
      });
      this.textbox.on('scaling', () => {
        // this.showShowSettingForm();  
        this.closeShowSettingForm();
        this.border.set({
          strokeDashArray: [2, 2, 2, 2],
          stroke: hexToRgba(this.color, 0.4),
        })
      });
      this.textbox.on('mouseup', () => {
        this.showShowSettingForm();
        this.border.set({
          strokeDashArray: [0, 0],
          stroke: hexToRgba(this.color, 1),
        })
      });
      this.textbox.on('deselected', () => {
        this.closeShowSettingForm();
      });
      this.textbox.on('moving', () => {
        // Get the position of the group
        this.containerLeft = this.textbox.left!;
        this.containerTop = this.textbox.top!;
        this.border.set({
          strokeDashArray: [2, 2, 2, 2],
          stroke: hexToRgba(this.color, 0.4),
        })
        this.closeShowSettingForm();
      });
    }
  
    private showShowSettingForm() {
      const groupPosition = this.textbox.getBoundingRect();
      this.setShowSettingForm({
        uid: this.uid,
        show: true,
        position: {
            left: groupPosition.left, // Position horizontally below the group
            top: groupPosition.top + groupPosition.height + 10, // Position vertically below the group
        },
        value: {
            recipient: this.recipient,
            customPlaceholder: this.customPlaceholder,
            placeholder: this.placeholder,
            required: this.required,
        }
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
        value: {
            recipient: this.recipient,
            customPlaceholder: this.customPlaceholder,
            placeholder: this.placeholder,
            required: this.required,
        }
      });
    }
  
    public addToCanvas() {
    //   this.canvi.add(this.textboxGroup);
        this.createtextboxes();
        this.canvi.add(this.textbox);
    //   this.canvi.renderAll();
    }


    public setValue(value:any) {
      this.recipient = value.recipient;
      this.color = generateColorForRecipient(this.recipient);
      this.customPlaceholder = value.customPlaceholder;
      this.placeholder = value.placeholder;
      this.required = value.required;
      
      this.updateTextboxGroup();
    }

    public updateTextboxGroup() {
        console.log("updated");
        // Update the color of each checkbox individually
        this.textbox.set({
            backgroundColor: hexToRgba(this.color, 0.1), // Update the fill based on the state
        });

        this.border.set({
          stroke: hexToRgba(this.color, 1), 
        });
  
        this.canvi.renderAll() // Re-render canvas
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
        numtextboxes: this.numtextboxes,
        recipient: this.recipient,
        signMode: this.signMode,
        color: this.color,
        // checkedBydefault: this.checkedBydefault,
        // defaultTick: this.defaultTick,
        required: this.required,
        textboxesState: this.textboxesState,
      };
  
      return JSON.stringify(serializableState);
    }
}

export default TextboxManager;

// const manager = new textboxManager(...); // Create the manager
// const serializedManager = manager.serialize();

// // Store serializedManager in your database
// Retrieve the serialized object from the database
// const storedJson = /* Fetch from DB */;

// const restoredManager = textboxManager.deserialize(
//   storedJson,
//   fabricCanvas, // Pass the fabric.Canvas instance
//   settextboxItems, // React state setter
//   setShowSettingForm // React state setter
// );

// // Add the restored manager to the canvas
// restoredManager.addToCanvas();