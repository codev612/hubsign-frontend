import { generateColorForRecipient, hexToRgba, updateSvgColors } from '../utils';
import { fabric } from 'fabric';
import { Text } from 'fabric/fabric-impl';
import { parse } from 'svg-parser'
import { ControlSVGFile } from '@/interface/interface';

class DateboxManager {
    
    private controlType = "datebox";
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
    private setShowSettingForm: React.Dispatch<React.SetStateAction<any>>;
    //setting form properties
    private recipient: string = "";
    private required: boolean = true;
    private placeholder: string = "Enter date";
    private textvalue: string = "Text";
    private selectedItem: string = "";
    private dropdownItems: string[] = [];
    private customPlaceholder: boolean=false;
    private controlSVGFile: ControlSVGFile;
    private svgGroup: fabric.Object;
    private arrowBottom: fabric.Object;
    private leftPadding: number = 10;
   
    constructor(
        uid: string,
        canvi: fabric.Canvas,
        startLeft: number,
        startTop: number,
        recipient: string,
        signMode: boolean,
        setShowSettingForm: React.Dispatch<React.SetStateAction<any>>,
        controlSVGFile: ControlSVGFile,
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
        
        this.textbox = new fabric.Textbox("");
        this.border = new fabric.Rect();
        this.svgGroup = new fabric.Object();
        this.arrowBottom = new fabric.Object();

        this.tracktextboxGroup();
    }
    
    private createtextboxes() {
        this.containerTop = this.currentTop;

        if(!this.signMode) {
            const svgString = this.controlSVGFile.datebox;
            const updatedSvgString = updateSvgColors(svgString, hexToRgba(this.color, 0.1), hexToRgba(this.color, 1));

            // Load SVG into Fabric.js
            fabric.loadSVGFromString(updatedSvgString, (objects, options) => {
                if (this.svgGroup) {
                    this.canvi.remove(this.svgGroup); // Remove existing SVG before adding a new one
                }
        
                this.svgGroup = fabric.util.groupSVGElements(objects, options);
                (this.svgGroup as fabric.Object & { isSvg?: boolean }).isSvg = true;
                this.svgGroup.set({
                    left: this.containerLeft,
                    top: this.containerTop,
                    selectable: true,
                })

                this.trackSvgGroup();    
                this.canvi.add(this.svgGroup);
            });
        } else {
            const svgString = this.controlSVGFile.calendar;
            const updatedSvgString = updateSvgColors(svgString, hexToRgba(this.color, 0.05), hexToRgba(this.color, 1));

            // Load SVG into Fabric.js
            fabric.loadSVGFromString(updatedSvgString, (objects, options) => {
                this.arrowBottom = fabric.util.groupSVGElements(objects, options);
                (this.arrowBottom as fabric.Object & { isSvg?: boolean }).isSvg = true;
                this.arrowBottom.set({
                    left: this.containerLeft + 200 - this.leftPadding,
                    top: this.containerTop + 6,
                    selectable: false,
                })

                this.canvi.add(this.arrowBottom);
            });
            // Create a border rectangle
            this.border = new fabric.Rect({
                left: this.containerLeft - this.leftPadding,
                top: this.containerTop - this.leftPadding,
                width: 200 + 1 + 2 * this.leftPadding,
                height: 32 + 2 * this.leftPadding - 3,
                stroke: hexToRgba(this.color, 1),
                strokeDashArray: [0, 0],
                strokeWidth: 1,
                fill: hexToRgba(this.color, 0.05),
                selectable: false,
                evented: true,
                rx: 10,
                ry: 10,
            });
        
            // Create the textbox
            this.textbox = new fabric.Textbox(
                this.selectedItem==="" ? this.placeholder : this.selectedItem, 
                {
                    left: this.containerLeft,
                    top: this.containerTop,
                    width: 200,
                    fontSize: 24,
                    textAlign: "left",
                    padding: this.leftPadding,
                    backgroundColor: "transparent",
                    fill: this.selectedItem==="" ? "#6F6F6F" : "#262626",
                    borderColor: 'transparent',
                    cornerStyle: "circle",
                    transparentCorners: false,
                    evented: true,
                    editable: false,
                }
            );

            this.tracktextboxGroup();

            this.canvi.add(this.border, this.textbox);
        }  
        
        this.canvi.renderAll();
    }
    
    // Track scaling of the DropdownboxGroup
    private tracktextboxGroup() {
        this.textbox.on('modified', () => {
            this.border.set({
                left: this.textbox.left! - this.leftPadding,
                top: this.textbox.top! - this.leftPadding,
                width: (this.textbox.width! + 1) * this.textbox.scaleX! + 2 * this.leftPadding,
                height: (this.textbox.height! + 2) * this.textbox.scaleY! + 2 * this.leftPadding,
            });

            this.arrowBottom.set({
                left: this.textbox.left! + this.textbox.width! * this.textbox.scaleX! - this.leftPadding,
                top: this.textbox.top! + this.textbox.height!/2 * this.textbox.scaleY! - this.arrowBottom.height!/2,
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
        this.textbox.on('resizing', () => {
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

        // Catch editing event
        this.textbox.on('editing:entered', () => {
            this.textbox.set({
            fill: "#262626",
            })
            this.canvi.renderAll();
        });

        this.textbox.on('editing:exited', () => {
            if(this.textbox.text === this.placeholder || this.textbox.text === "") {
            this.textbox.set({
                fill: "#6F6F6F",
                text: this.placeholder,
            })
            } else {
            this.textbox.set({
                fill: "#262626",
                
            })

            this.selectedItem = this.textbox.text || '';
            }

            this.canvi.renderAll();
        });
    }

    // Track scaling of the DropdownboxGroup
    private trackSvgGroup() {
        this.svgGroup.on('modified', () => {
            this.canvi.renderAll();
        });
        this.svgGroup.on('scaling', () => {
            // this.showShowSettingForm();  
            this.closeShowSettingForm();
        });
        this.svgGroup.on('resizing', () => {
            // this.showShowSettingForm();  
            this.closeShowSettingForm();
        });
        this.svgGroup.on('mouseup', () => {
            this.showShowSettingForm();
        });
        this.svgGroup.on('deselected', () => {
            this.closeShowSettingForm();
        });
        this.svgGroup.on('moving', () => {
            // Get the position of the group
            this.containerLeft = this.svgGroup.left!;
            this.containerTop = this.svgGroup.top!;
            this.closeShowSettingForm();
        });
    }
  
    private showShowSettingForm() {
      const groupPosition = this.signMode ? this.textbox.getBoundingRect() : this.svgGroup.getBoundingRect();
      this.setShowSettingForm({
        uid: this.uid,
        show: true,
        position: {
            left: groupPosition.left, // Position horizontally below the group
            top: groupPosition.top + groupPosition.height + 5, // Position vertically below the group
        },
        width: this.border.width!,
        value: {
            recipient: this.recipient,
            items: this.dropdownItems,
            selectedItem: this.selectedItem,
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
            items: this.dropdownItems,
            selectedItem: this.selectedItem,
            required: this.required,
        }
      });
    }

    public addToCanvas() {
        this.createtextboxes();
        this.canvi.add(this.textbox);
    }

    public setValue(value:any) {
        this.recipient = value.recipient;
        this.color = generateColorForRecipient(this.recipient);
        this.dropdownItems = value.items;
        this.required = value.required;
        this.selectedItem = value.selectedItem;
        
        if(!this.signMode) {
            this.updateSvgColor();
        } else {
            this.updateTextboxGroup();
        }      
    }

    private updateSvgColor() {

        // Update SVG color and replace existing one
        const svgString = this.controlSVGFile.dropdownbox;
        const updatedSvgString = updateSvgColors(svgString, hexToRgba(this.color, 0.1), hexToRgba(this.color, 1));

        // Store the previous position of svgGroup
        let prevLeft = this.svgGroup?.left || this.containerLeft;
        let prevTop = this.svgGroup?.top || this.containerTop;
        let prevScaleX = this.svgGroup?.scaleX || 1;
        let prevScaleY = this.svgGroup?.scaleY || 1;

        // Remove the old SVG before adding a new one
        if (this.svgGroup) {
            console.log('remove')
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
                scaleX: prevScaleX,
                scaleY: prevScaleY,
            });

            this.trackSvgGroup();
            this.canvi.add(this.svgGroup);
            this.canvi.renderAll();
        });
    }

    public updateTextboxGroup() {
        console.log("updated");
        // Update the color of each checkbox individually
        this.textbox.set({
            // backgroundColor: hexToRgba(this.color, 0.1), // Update the fill based on the state
            borderColor: this.color,
            fill: this.selectedItem==="" ? "#6F6F6F" : "#262626",
            text: this.selectedItem==="" ? this.placeholder : this.selectedItem,
        });
      
        this.border.set({
          stroke: hexToRgba(this.color, 1), 
          backgroundColor: hexToRgba(this.color, 0.05),
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

export default DateboxManager;

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