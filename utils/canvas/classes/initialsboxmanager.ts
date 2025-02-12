import { generateColorForRecipient, hexToRgba, updateSvgColors } from '../utils';
import { fabric } from 'fabric';
import { Text } from 'fabric/fabric-impl';
import { parse } from 'svg-parser'
import { ControlSVGFile } from '@/interface/interface';

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
    private setShowSettingForm: React.Dispatch<React.SetStateAction<any>>;
    //setting form properties
    private recipient: string = "";
    private required: boolean = true;
    private placeholder: string = "Signed by";
    private initialImage: string = "";
    private enteredText: string = "";
    private controlSVGFile: ControlSVGFile;
    private svgGroup: fabric.Object;
    private signImage: fabric.Image;
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
      this.signImage = new fabric.Image("");

      this.tracktextboxGroup();
    }
    
    private createInitialboxes() {
      this.containerTop = this.currentTop;

      const svgString = this.controlSVGFile.initialsbox;
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
      
      this.canvi.renderAll();
    }
    
    // Track scaling of the textboxGroup
    private tracktextboxGroup() {
      if(this.textbox) {
        this.textbox.on('modified', () => {
          this.border.set({
              left: this.textbox.left! - this.leftPadding,
              top: this.textbox.top! - this.leftPadding,
              width: (this.textbox.width! + 1) * this.textbox.scaleX! + 2 * this.leftPadding,
              height: (this.textbox.height! + 2) * this.textbox.scaleY! + 2 * this.leftPadding,
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

            this.enteredText = this.textbox.text || '';
          }

          this.canvi.renderAll();
        });
      }
    }

    // Track scaling of the textboxGroup
    private trackSvgGroup() {
      if(this.svgGroup) {
        this.svgGroup.on('modified', () => {
          this.canvi.renderAll();
        });

        this.svgGroup.on('scaling', () => {
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
    }
  
    private showShowSettingForm() {
      const groupPosition = this.svgGroup.getBoundingRect();
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
            initialImage: this.initialImage,
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
          required: this.required,
          initialImage: this.initialImage,
        }
      });
    }
  
    public addToCanvas() {
    //   this.canvi.add(this.textboxGroup);
        this.createInitialboxes();
        this.canvi.add(this.textbox);
    //   this.canvi.renderAll();
    }

    public setValue(value:any) {
      this.recipient = value.recipient;
      this.color = generateColorForRecipient(this.recipient);
      this.required = value.required;
      this.initialImage = value.initialImage;
      (value.initialImage!=="") ? this.updateSignedbox() : this.updateSvgColor();
    }

    private updateSvgColor() {

      // Update SVG color and replace existing one
      const svgString = this.controlSVGFile.initialsbox;
      const updatedSvgString = updateSvgColors(svgString, hexToRgba(this.color, 0.1), hexToRgba(this.color, 1));

      // Store the previous position of svgGroup
      let prevLeft = this.svgGroup?.left || this.containerLeft;
      let prevTop = this.svgGroup?.top || this.containerTop;
      let prevScaleX = this.svgGroup?.scaleX || 1;
      let prevScaleY = this.svgGroup?.scaleY || 1;

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
          scaleX: prevScaleX,
          scaleY: prevScaleY,
        });

        this.trackSvgGroup();
        this.canvi.add(this.svgGroup);
        this.canvi.renderAll();
      });
    }

    // private updateSignedbox() {

    //   if (this.svgGroup) {
    //     this.canvi.remove(this.svgGroup);
    //     this.canvi.renderAll();

    //     const border = new fabric.Rect({
    //       left: this.containerLeft,
    //       top: this.containerTop,
    //       stroke: this.color,
    //       strokeWidth: 2,
    //       fill: "transparent",
    //       borderColor: "transparent",
    //       width: 200,
    //       height: 56,
    //       rx: 10,
    //       ry: 10,
    //       evented: true,
    //     });

    //     const text = new fabric.Text(this.placeholder, {
    //       left: this.containerLeft + 5,
    //       top: this.containerTop + 5,
    //       fill: "#000",
    //       fontSize: 10,
    //       selectable: false,
    //     });

    //     fabric.Image.fromURL(this.initialImage, (img) => {
    //       img.scaleToWidth(200);
    //       img.scaleToHeight(51);
    //       img.set({
    //         left: this.containerLeft,
    //         top: this.containerTop + 5,
    //         evented: true,
    //       });
    //       this.signImage = img;
    //       this.canvi.add(img).renderAll();
    //     });

    //     this.canvi.add(text);
    //     this.canvi.add(border);
        
    //     border.on('moving', () => {
    //       text.set({
    //         left: border.left! + 5 * border.getScaledWidth() / 200,
    //         top: border.top! + 5 * border.getScaledHeight() / 56,
    //       });

    //       this.signImage.set({
    //         left: border.left! + 5,
    //         top: border.top! + 5,
    //       });
    //     });

    //     border.on('scaling', () => {
    //       text.set({
    //         left: border.left! + 5 * border.getScaledWidth() / 200,
    //         top: border.top! + 5 * border.getScaledHeight() / 56,
    //       });

    //       this.signImage.set({
    //         left: border.left! + 5,
    //         top: border.top! + 5,
    //       });

    //       this.signImage.scaleToWidth(border.getScaledWidth()-5 * border.getScaledWidth() / 200);
    //       this.signImage.scaleToHeight(border.getScaledHeight()-5 * border.getScaledHeight() / 56);
    //     });

    //     border.on("resizing", () => {
    //       console.log("resizing")
    //     })
    //   };
    // }

    private updateSignedbox() {

      // Store the previous position of svgGroup
      let prevLeft = this.svgGroup?.left || this.containerLeft;
      let prevTop = this.svgGroup?.top || this.containerTop;
      let prevScaleX = this.svgGroup?.scaleX || 1;
      let prevScaleY = this.svgGroup?.scaleY || 1;

      if (this.svgGroup) {
        this.canvi.remove(this.svgGroup);
        this.canvi.renderAll();
      }
    
      const border = new fabric.Rect({
        left: 0,
        top: 0,
        stroke: this.color,
        strokeWidth: 2,
        fill: "transparent",
        borderColor: "transparent",
        width: 200,
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
    
        // Create a group
        this.svgGroup = new fabric.Group([border, text, img], {
          left: prevLeft,
          top: prevTop,
          selectable: true,
          scaleX: prevScaleX,
          scaleY: prevScaleY,
        });
    
        this.signImage = img;
        this.trackSvgGroup();
        this.canvi.add(this.svgGroup);
        this.canvi.renderAll();
    
        // Handle scaling
        // this.svgGroup.on("scaling", () => {
        //   const scaleX = this.svgGroup.scaleX || 1;
        //   const scaleY = this.svgGroup.scaleY || 1;
    
        //   // Resize the border
        //   border.set({
        //     width: 200 * scaleX,
        //     height: 56 * scaleY,
        //   });
    
        //   // Resize text and image proportionally
        //   text.set({
        //     left: 5 * scaleX,
        //     top: 5 * scaleY,
        //     fontSize: 10 * scaleX, // Scale font size
        //   });
    
        //   img.set({
        //     left: 5 * scaleX,
        //     top: 5 * scaleY,
        //   });
    
        //   img.scaleToWidth(200 * scaleX);
        //   img.scaleToHeight(51 * scaleY);
    
        //   this.svgGroup.setCoords(); // Update the group's bounding box
        // });
      });
    }

    public updateTextboxGroup() {
      // Update the color of each checkbox individually
      this.textbox.set({
        // backgroundColor: hexToRgba(this.color, 0.1), // Update the fill based on the state
        borderColor: this.color,
        fill: this.enteredText==="" ? "#6F6F6F" : "#262626",
        text: this.enteredText==="" ? this.placeholder : this.enteredText,
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

export default InitialsboxManager;

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