import { fabric } from "fabric";
import { format } from "date-fns";

import {
  generateColorForRecipient,
  hexToRgba,
  updateSvgColors,
} from "../utils";

import { ControlSVGFile } from "@/interface/interface";
import {
  canvasControlMinHeight,
  canvasControlMinWidth,
  canvasControlRadious,
  canvasObject,
} from "@/constants/canvas";

class DateboxManager {
  private controlType = canvasObject.datebox;
  private signMode: boolean = false;
  private onlyMyself: boolean = false;
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
  private iconText: fabric.Text = new fabric.Text("Date");
  private border: fabric.Rect;
  private iconBorder: fabric.Rect = new fabric.Rect();
  private valueBorder: fabric.Rect = new fabric.Rect();
  private setShowSettingForm: React.Dispatch<React.SetStateAction<any>>;
  private setShowCalendarForm: React.Dispatch<React.SetStateAction<any>>;
  //setting form properties
  private recipient: string = "";
  private required: boolean = true;
  private format: string = "mm/dd/yyyy";
  private lockedToday: boolean = false;
  private placeholder: string = "Enter date";
  private selectedDate: Date | null = null;
  private formatedDate: string = "";

  private controlSVGFile: ControlSVGFile;
  private svgGroup: fabric.Object = new fabric.Object();
  private svgGearGroup: fabric.Object = new fabric.Object();
  private calendarIcon: fabric.Object;
  private leftPadding: number = 10;
  private removeCanvasObject: (uid:string)=>void

  constructor(
    uid: string,
    canvi: fabric.Canvas,
    startLeft: number,
    startTop: number,
    recipient: string,
    signMode: boolean,
    onlyMyself: boolean,
    setShowSettingForm: React.Dispatch<React.SetStateAction<any>>,
    setShowCalendarForm: React.Dispatch<React.SetStateAction<any>>,
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
    this.onlyMyself = onlyMyself;
    this.controlSVGFile = controlSVGFile;
    this.color = generateColorForRecipient(recipient);

    this.setShowSettingForm = setShowSettingForm;
    this.setShowCalendarForm = setShowCalendarForm;
    this.removeCanvasObject = removeCanvasObject;

    this.textbox = new fabric.Textbox("");
    this.border = new fabric.Rect();
    this.calendarIcon = new fabric.Object();

    this.tracktextboxGroup();
    this.setupDeleteKeyHandler()
;  }

  private createtextboxes() {
    this.containerTop = this.currentTop;

    if (!this.signMode && !this.onlyMyself) {
      const svgString = this.controlSVGFile.date;
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
          left: this.containerLeft + 100 - 24 - 8,
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
        });

        this.iconText = new fabric.Text("Date", {
          fontSize: 18,
          fontFamily: "Gothic",
          left: this.containerLeft + 100,
          top: this.containerTop + 16,
          selectable: false,
        });

        this.trackIconGroup();
        this.canvi.add(this.svgGroup, this.iconBorder, this.iconText);
      });

      const svgGearString = this.controlSVGFile.gear;
      const updatedSvgGearString = updateSvgColors(
        svgGearString,
        hexToRgba(this.color, 1),
        hexToRgba(this.color, 1),
      );

      fabric.loadSVGFromString(updatedSvgGearString, (objects, options) => {
        if (this.svgGearGroup) {
          this.canvi.remove(this.svgGearGroup); // Remove existing SVG before adding a new one
        }

        this.svgGearGroup = fabric.util.groupSVGElements(objects, options);
        (this.svgGearGroup as fabric.Object & { isSvg?: boolean }).isSvg = true;
        this.svgGearGroup.set({
          left: this.containerLeft + 200 + 8,
          top: this.containerTop + (56 - 24) / 2,
          selectable: false,
          evented: true,
        });

        this.svgGearGroup.scaleToWidth(20);
        this.svgGearGroup.scaleToHeight(20);

        this.svgGearGroup.on("mousedown", () => {
          this.showShowSettingForm();
        });

        this.canvi.add(this.svgGearGroup);
      });
    } else {
      const svgString = this.controlSVGFile.calendar;
      const updatedSvgString = updateSvgColors(
        svgString,
        hexToRgba(this.color, 0.05),
        hexToRgba(this.color, 1),
      );

      // Load SVG into Fabric.js
      fabric.loadSVGFromString(updatedSvgString, (objects, options) => {
        this.calendarIcon = fabric.util.groupSVGElements(objects, options);
        (this.calendarIcon as fabric.Object & { isSvg?: boolean }).isSvg = true;
        this.calendarIcon.set({
          left: this.containerLeft + 200 - this.leftPadding,
          top: this.containerTop + 6,
          selectable: false,
        });

        this.canvi.add(this.calendarIcon);
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
        !this.selectedDate ? this.placeholder : this.formatedDate,
        {
          left: this.containerLeft,
          top: this.containerTop,
          width: 200,
          fontSize: 24,
          textAlign: "left",
          padding: this.leftPadding,
          backgroundColor: "transparent",
          fill: !this.selectedDate ? "#6F6F6F" : "#262626",
          // borderColor: 'transparent',
          cornerStyle: "circle",
          transparentCorners: false,
          evented: true,
          editable: false,
        },
      );

      if (this.onlyMyself) {
        const svgGearString = this.controlSVGFile.gear;
        const updatedSvgGearString = updateSvgColors(
          svgGearString,
          hexToRgba(this.color, 1),
          hexToRgba(this.color, 1),
        );

        fabric.loadSVGFromString(updatedSvgGearString, (objects, options) => {
          if (this.svgGearGroup) {
            this.canvi.remove(this.svgGearGroup); // Remove existing SVG before adding a new one
          }

          this.svgGearGroup = fabric.util.groupSVGElements(objects, options);
          (this.svgGearGroup as fabric.Object & { isSvg?: boolean }).isSvg =
            true;
          this.svgGearGroup.set({
            left: this.textbox.left! + 200 + 15,
            top: this.textbox.top! + (32 - 24) / 2,
            selectable: false,
            evented: true,
          });

          this.svgGearGroup.scaleToWidth(20);
          this.svgGearGroup.scaleToHeight(20);

          this.svgGearGroup.on("mousedown", () => {
            this.showShowSettingForm();
          });

          this.canvi.add(this.svgGearGroup);
        });
      }

      this.tracktextboxGroup();

      this.canvi.add(this.border, this.textbox);
    }

    this.canvi.renderAll();
  }

  // Track scaling of the DropdownboxGroup
  private tracktextboxGroup() {
    this.textbox.on("modified", () => {
      this.border.set({
        left: this.textbox.left! - this.leftPadding,
        top: this.textbox.top! - this.leftPadding,
        width:
          (this.textbox.width! + 1) * this.textbox.scaleX! +
          2 * this.leftPadding,
        height:
          this.textbox.height! * this.textbox.scaleY! + 2 * this.leftPadding,
      });

      this.calendarIcon.set({
        left:
          this.textbox.left! +
          this.textbox.width! * this.textbox.scaleX! -
          this.leftPadding,
        top:
          this.textbox.top! +
          (this.textbox.height! / 2) * this.textbox.scaleY! -
          this.calendarIcon.height! / 2,
      });

      if (this.onlyMyself) {
        const svgGearString = this.controlSVGFile.gear;
        const updatedSvgGearString = updateSvgColors(
          svgGearString,
          hexToRgba(this.color, 1),
          hexToRgba(this.color, 1),
        );

        fabric.loadSVGFromString(updatedSvgGearString, (objects, options) => {
          if (this.svgGearGroup) {
            this.canvi.remove(this.svgGearGroup); // Remove existing SVG before adding a new one
          }

          this.svgGearGroup = fabric.util.groupSVGElements(objects, options);
          (this.svgGearGroup as fabric.Object & { isSvg?: boolean }).isSvg =
            true;
          this.svgGearGroup.set({
            left: this.textbox.left! + this.textbox.getScaledWidth() + 15,
            top: this.textbox.top! + (this.textbox.getScaledHeight() - 24) / 2,
            selectable: false,
            evented: true,
          });

          this.svgGearGroup.scaleToWidth(20);
          this.svgGearGroup.scaleToHeight(20);

          this.svgGearGroup.on("mousedown", () => {
            this.showShowSettingForm();
          });

          this.canvi.add(this.svgGearGroup);
        });
      }

      this.canvi.renderAll();
    });

    this.textbox.on("scaling", () => {
      // this.showShowSettingForm();
      this.closeShowSettingForm();

      this.border.set({
        left: this.textbox.left! - this.leftPadding,
        top: this.textbox.top! - this.leftPadding,
        width:
          (this.textbox.width! + 1) * this.textbox.scaleX! +
          2 * this.leftPadding,
        height:
          this.textbox.height! * this.textbox.scaleY! + 2 * this.leftPadding,
      });

      this.calendarIcon.set({
        left:
          this.textbox.left! +
          this.textbox.width! * this.textbox.scaleX! -
          this.leftPadding,
        top:
          this.textbox.top! +
          (this.textbox.height! / 2) * this.textbox.scaleY! -
          this.calendarIcon.height! / 2,
      });

      if (this.onlyMyself) {
        this.svgGearGroup.set({
          left: this.textbox.left! + this.textbox.getScaledWidth() + 15,
          top: this.textbox.top! + (this.textbox.getScaledHeight() - 24) / 2,
          selectable: false,
          evented: true,
        });
      }
    });
    this.textbox.on("resizing", () => {
      // this.showShowSettingForm();
      this.closeShowSettingForm();
      this.border.set({
        left: this.textbox.left! - this.leftPadding,
        top: this.textbox.top! - this.leftPadding,
        width:
          (this.textbox.width! + 1) * this.textbox.scaleX! +
          2 * this.leftPadding,
        height:
          this.textbox.height! * this.textbox.scaleY! + 2 * this.leftPadding,
      });

      this.calendarIcon.set({
        left:
          this.textbox.left! +
          this.textbox.width! * this.textbox.scaleX! -
          this.leftPadding,
        top:
          this.textbox.top! +
          (this.textbox.height! / 2) * this.textbox.scaleY! -
          this.calendarIcon.height! / 2,
      });

      if (this.onlyMyself) {
        this.svgGearGroup.set({
          left: this.textbox.left! + this.textbox.getScaledWidth() + 15,
          top: this.textbox.top! + (this.textbox.getScaledHeight() - 24) / 2,
          selectable: false,
          evented: true,
        });
      }
    });

    this.textbox.on("mouseup", () => {
      if (this.onlyMyself) this.showShowCalendarForm();
    });

    this.textbox.on("deselected", () => {
      if (this.onlyMyself) this.closeShowCalendarForm();
      else this.closeShowSettingForm();
    });

    this.textbox.on("moving", () => {
      // Get the position of the group
      this.containerLeft = this.textbox.left!;
      this.containerTop = this.textbox.top!;

      this.border.set({
        left: this.textbox.left! - this.leftPadding,
        top: this.textbox.top! - this.leftPadding,
        width:
          (this.textbox.width! + 1) * this.textbox.scaleX! +
          2 * this.leftPadding,
        height:
          this.textbox.height! * this.textbox.scaleY! + 2 * this.leftPadding,
      });

      this.calendarIcon.set({
        left:
          this.textbox.left! +
          this.textbox.width! * this.textbox.scaleX! -
          this.leftPadding,
        top:
          this.textbox.top! +
          (this.textbox.height! / 2) * this.textbox.scaleY! -
          this.calendarIcon.height! / 2,
      });

      if (this.onlyMyself) {
        this.svgGearGroup.set({
          left: this.textbox.left! + this.textbox.getScaledWidth() + 15,
          top: this.textbox.top! + (this.textbox.getScaledHeight() - 24) / 2,
          selectable: false,
          evented: true,
        });
      }

      this.closeShowSettingForm();
      this.closeShowCalendarForm();
    });

    // Catch editing event
    this.textbox.on("editing:entered", () => {
      this.textbox.set({
        fill: "#262626",
      });
      this.canvi.renderAll();
    });
  }

  // Track scaling of the DropdownboxGroup
  private trackIconGroup() {
    this.iconBorder.on("modified", () => {
      this.containerLeft = this.iconBorder.left!;
      this.containerTop = this.iconBorder.top!;

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

      const svgGearString = this.controlSVGFile.gear;
      const updatedSvgGearString = updateSvgColors(
        svgGearString,
        hexToRgba(this.color, 1),
        hexToRgba(this.color, 1),
      );

      fabric.loadSVGFromString(updatedSvgGearString, (objects, options) => {
        if (this.svgGearGroup) {
          this.canvi.remove(this.svgGearGroup); // Remove existing SVG before adding a new one
        }

        this.svgGearGroup = fabric.util.groupSVGElements(objects, options);
        (this.svgGearGroup as fabric.Object & { isSvg?: boolean }).isSvg = true;
        this.svgGearGroup.set({
          left: this.iconBorder.left! + this.iconBorder.getScaledWidth() + 8,
          top:
            this.iconBorder.top! + (this.iconBorder.getScaledHeight() - 24) / 2,
          selectable: false,
          evented: true,
        });

        this.svgGearGroup.scaleToWidth(20);
        this.svgGearGroup.scaleToHeight(20);

        this.svgGearGroup.on("mousedown", () => {
          console.log("setting clicked");
          this.showShowSettingForm();
        });

        this.canvi.add(this.svgGearGroup);
      });

      // this.iconBorder.set({
      //   rx: 10 * 56 / this.iconBorder.getScaledHeight(),
      //   ry: 10 * 200 / this.iconBorder.getScaledWidth(),
      // });

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
      this.closeShowSettingForm();
    });

    // this.iconBorder.on('deselected', () => {
    //   this.closeShowSettingForm();
    // });

    this.iconBorder.on("moving", () => {
      this.closeShowSettingForm();
      // Get the position of the group
      this.containerLeft = this.iconBorder.left!;
      this.containerTop = this.iconBorder.top!;

      this.svgGroup.set({
        left:
          this.containerLeft + (this.iconBorder.getScaledWidth() / 2 - 24 - 8),
        top: this.containerTop + (this.iconBorder.getScaledHeight() - 24) / 2,
      });

      this.iconText.set({
        left: this.containerLeft + this.iconBorder.getScaledWidth() / 2,
        top: this.containerTop + (this.iconBorder.getScaledHeight() - 24) / 2,
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
    const groupPosition =
      this.signMode || this.onlyMyself
        ? this.textbox.getBoundingRect()
        : this.iconBorder.getBoundingRect();

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
        selectedDate: this.selectedDate,
        required: this.required,
        format: this.format,
        lockedToday: this.lockedToday,
      },
    });
  }

  private closeShowSettingForm() {
    const groupPosition =
      this.signMode || this.onlyMyself
        ? this.textbox.getBoundingRect()
        : this.iconBorder.getBoundingRect();

    this.setShowSettingForm({
      uid: this.uid,
      show: false,
      position: {
        left: groupPosition.left, // Position horizontally below the group
        top: groupPosition.top + groupPosition.height + 10, // Position vertically below the group
      },
      value: {
        recipient: this.recipient,
        selectedDate: this.selectedDate,
        required: this.required,
        format: this.format,
        lockedToday: this.lockedToday,
      },
    });
  }

  private showShowCalendarForm() {
    const groupPosition =
      this.signMode || this.onlyMyself
        ? this.textbox.getBoundingRect()
        : this.iconBorder.getBoundingRect();

    this.setShowCalendarForm({
      uid: this.uid,
      show: true,
      position: {
        left: groupPosition.left, // Position horizontally below the group
        top: groupPosition.top + groupPosition.height + 5, // Position vertically below the group
      },
      width: this.border.width!,
      value: {
        recipient: this.recipient,
        selectedDate: this.selectedDate,
        required: this.required,
        format: this.format,
        lockedToday: this.lockedToday,
      },
    });
  }

  private closeShowCalendarForm() {
    const groupPosition =
      this.signMode || this.onlyMyself
        ? this.textbox.getBoundingRect()
        : this.iconBorder.getBoundingRect();

    this.setShowCalendarForm({
      uid: this.uid,
      show: false,
      position: {
        left: groupPosition.left, // Position horizontally below the group
        top: groupPosition.top + groupPosition.height + 10, // Position vertically below the group
      },
      value: {
        recipient: this.recipient,
        selectedDate: this.selectedDate,
        required: this.required,
        format: this.format,
        lockedToday: this.lockedToday,
      },
    });
  }

  public addToCanvas() {
    this.createtextboxes();
    // this.canvi.add(this.textbox);
  }

  public setValue(value: any) {
    this.recipient = value.recipient;
    this.color = generateColorForRecipient(this.recipient);
    this.required = value.required;
    this.selectedDate = value.selectedDate;
    this.format = value.format;
    this.lockedToday = value.lockedToday;

    if (this.selectedDate) {
      try {
        this.formatedDate = format(
          this.selectedDate,
          this.format.replace(/m/g, "M").replace(/d/g, "d").replace(/y/g, "y"),
        );
      } catch (error) {
        console.error("Invalid date format:", this.format);
        this.formatedDate = ""; // Fallback to empty string if formatting fails
      }
    } else {
      this.formatedDate = "";
    }

    if (!this.signMode && !this.onlyMyself) {
      this.updateSvgColor();
      this.updateIconBorder();
    } else {
      this.updateTextboxGroup();
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
    const svgString = this.controlSVGFile.date;
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

      // this.trackIconGroup();
      this.canvi.add(this.svgGroup);
      this.canvi.renderAll();
    });

    // Update SVG color and replace existing one
    const svgGearString = this.controlSVGFile.gear;
    const updatedSvgGearString = updateSvgColors(
      svgGearString,
      hexToRgba(this.color, 1),
      hexToRgba(this.color, 1),
    );

    // Store the previous position of svgGroup
    let prevGearLeft = this.svgGearGroup?.left || this.containerLeft;
    let prevGearTop = this.svgGearGroup?.top || this.containerTop;

    // Remove the old SVG before adding a new one
    if (this.svgGearGroup) {
      this.canvi.remove(this.svgGearGroup);
      this.canvi.renderAll();
    }

    fabric.loadSVGFromString(updatedSvgGearString, (objects, options) => {
      this.svgGearGroup = fabric.util.groupSVGElements(objects, options);
      (this.svgGearGroup as fabric.Object & { isSvg?: boolean }).isSvg = true;

      // Restore the position and scale of the new SVG
      this.svgGearGroup.set({
        left: prevGearLeft,
        top: prevGearTop,
        selectable: false,
        evented: true,
      });

      this.svgGearGroup.scaleToWidth(20);
      this.svgGearGroup.scaleToHeight(20);

      this.svgGearGroup.on("mouseup", () => {
        this.showShowSettingForm();
      });

      this.trackIconGroup();
      this.canvi.add(this.svgGearGroup);
      this.canvi.renderAll();
    });
  }

  public updateTextboxGroup() {
    // Update the color of each checkbox individually
    this.textbox.set({
      // backgroundColor: hexToRgba(this.color, 0.1), // Update the fill based on the state
      borderColor: this.color,
      fill: !this.selectedDate ? "#6F6F6F" : "#262626",
      text: !this.selectedDate ? this.placeholder : this.formatedDate,
    });

    this.border.set({
      stroke: hexToRgba(this.color, 1),
      backgroundColor: hexToRgba(this.color, 0.05),
    });

    this.canvi.renderAll(); // Re-render canvas
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

    console.log(activeObject);

    if (activeObject === this.textbox || activeObject === this.iconBorder) {

      this.canvi.remove(
        this.valueBorder, 
        this.textbox, 
        this.border, 
        this.calendarIcon, 
        this.svgGroup, 
        this.svgGearGroup, 
        this.iconBorder, 
        this.iconText
      );
      this.removeCanvasObject(this.uid);

      this.canvi.renderAll();
    }
  };

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
