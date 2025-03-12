export interface credential {
  email: string;
  password: string;
}

export interface UserAvatarProps {
  username?: string;
  email?: string;
}

export interface PageTitleBarProps {
  pageTitle: string;
  buttonTitle: string;
  buttonLink: string;
  description?: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  // Add other fields as per your data
}

export interface Recipient {
  name: string;
  email: string;
}

// Define InitialState type
export interface ActionInitialState {
  state: string;
  data: any;
  message: string;
  isLoading: boolean;
}

//canvas controls
export interface Position {
  left: number;
  top: number;
}

export interface CheckboxSettings {
  recipient: string;
  defaultTick: boolean;
  checkedBydefault: boolean;
  required: boolean;
}

export interface CheckboxSettingFormState {
  uid: string;
  show: boolean;
  position: Position;
  value: CheckboxSettings;
}

export interface TextboxSettings {
  recipient: string;
  customPlaceholder: boolean;
  placeholder: string;
  required: boolean;
}

export interface TextboxSettingFormState {
  uid: string;
  show: boolean;
  position: Position;
  value: TextboxSettings;
}

export interface RadioboxSettings {
  recipient: string;
  required: boolean;
}

export interface RadioboxSettingFormState {
  uid: string;
  show: boolean;
  position: Position;
  value: RadioboxSettings;
}

export interface DropdownboxSettings {
  recipient: string;
  items: string[];
  selectedItem: string;
  required: boolean;
}

export interface DropdownboxSettingFormState {
  uid: string;
  show: boolean;
  position: Position;
  width: number;
  value: DropdownboxSettings;
}

export interface DateboxSettings {
  recipient: string;
  format: string;
  required: boolean;
  lockedToday: boolean;
  selectedDate: Date | null;
}

export interface DateboxSettingFormState {
  uid: string;
  show: boolean;
  position: Position;
  width: number;
  value: DateboxSettings;
}

export interface InitialsboxSettings {
  recipient: string;
  required: boolean;
  initialImage: string;
}

export interface InitialsboxSettingFormState {
  uid: string;
  show: boolean;
  position: Position;
  width: number;
  value: InitialsboxSettings;
}

//setting form props
export interface CheckboxGroupProps {
  showCheckboxSettingForm: any;
  setShowCheckboxSettingForm: React.Dispatch<any>;
  recipients: Recipient[];
  setCheckboxSetting: (payload: any) => void;
}

export interface TextboxGroupProps {
  showTextboxSettingForm: any;
  setShowTextboxSettingForm: React.Dispatch<any>;
  recipients: Recipient[];
  setTextboxSetting: (payload: any) => void;
}

export interface RadioboxGroupProps {
  showRadioboxSettingForm: any;
  setShowRadioboxSettingForm: React.Dispatch<any>;
  recipients: Recipient[];
  setRadioboxSetting: (payload: any) => void;
}

export interface DropdownboxGroupProps {
  showDropdownboxSettingForm: DropdownboxSettingFormState;
  setShowDropdownboxSettingForm: React.Dispatch<DropdownboxSettingFormState>;
  recipients: Recipient[];
  setDropdownboxSetting: (payload: any) => void;
  signMode: boolean;
}

export interface DropdownboxListProps {
  showDropdownboxListForm: DropdownboxSettingFormState;
  setShowDropdownboxListForm: React.Dispatch<DropdownboxSettingFormState>;
  recipients: Recipient[];
  setDropdownboxList: (payload: any) => void;
  signMode: boolean;
}

export interface DateboxSettingProps {
  showDateboxSettingForm: DateboxSettingFormState;
  setShowDateboxSettingForm: React.Dispatch<
    React.SetStateAction<DateboxSettingFormState>
  >;
  recipients: Recipient[];
  setDateboxSetting: (payload: any) => void;
  signMode: boolean;
}

export interface DateboxCalendarProps {
  showDateboxCalendarForm: DateboxSettingFormState;
  setShowDateboxCalendarForm: React.Dispatch<
    React.SetStateAction<DateboxSettingFormState>
  >;
  recipients: Recipient[];
  setDateboxCalendar: (payload: any) => void;
  signMode: boolean;
}

export interface InitialsboxGroupProps {
  showInitialsboxSettingForm: InitialsboxSettingFormState;
  setShowInitialsboxSettingForm: React.Dispatch<
    React.SetStateAction<InitialsboxSettingFormState>
  >;
  recipients: Recipient[];
  setInitialsboxSetting: (payload: any) => void;
  signMode: boolean;
}

//adddoc component
export interface FileAddBoardProps {
  filename: string;
  setFile: (file: any) => void;
  setFilename: (filename: string) => void;
  title: string;
  description: string;
}

//base canvas object interface
export interface BaseCanvasObject {
  uid: string;
  controlType: string; // e.g., "textbox", "rect", "circle", "image", etc.
  containerLeft: number;
  containerTop: number;
  recipient: string;
  required: boolean;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  [key: string]: any; // Allow additional properties specific to different object types
}

export interface TextboxObject extends BaseCanvasObject {
  enteredText: string;
  customPlaceholder: boolean;
  iconBorder: fabric.IRectOptions;
  iconText: object;
  placeholder: string;
  textbox: object;
  textvalue: string;
  valueBorder: object;
  svgGroup: object;
  svgGearGroup: object;
}

export interface CheckboxPosition {
  left: number;
  top: number;
}

export interface CheckboxObject extends BaseCanvasObject {
  checkboxesState: boolean[];
  checkboxPositions: CheckboxPosition[];
  tickPattern: string;
  checkedBydefault: boolean;
}

export interface RadioboxObject extends BaseCanvasObject {
  scaleX: number;
  scaleY: number;
  checkboxesState: boolean[];
  numCheckboxes: number;
  radioboxElements: object[];
}

export interface DropDownBoxObject extends BaseCanvasObject {
  textbox: object;
  iconBorder: object;
  iconText: Object;
  border: object;
  placeholder: string;
  textValue: string;
  selectedItem: string;
  dropdownItems: string[];
  customPlaceholder: boolean;
  controlSVGFile: object;
  svgGroup: object;
  svgGearGroup: object;
  arrowBottom: object;
}

export interface DateboxObject extends BaseCanvasObject {
  border: object;
  valueBorder: object;
  textbox: object;
  svgGroup: object;
  svgGearGroup: object;
  selectedDate: string;
  placeholder: string;
  iconBorder: object;
  iconText: object;
  lockedToday: boolean;
  formatedDate: string;
}

export interface InitialboxObject extends BaseCanvasObject {
  border: object;
  textbox: object;
  svgGroup: object;
  svgGearGroup: object;
  signedboxGroup: object;
  iconBorder: object;
  iconText: object;
  signImage: object;
  initialImage: string;
}

export type CanvasObject = TextboxObject | CheckboxObject | RadioboxObject | DropDownBoxObject | DateboxObject | InitialboxObject

//document data
export interface DocData {
  uid: string,
  filename: string;
  recipients: Recipient[];
  canvas: CanvasObject[];
}

export interface ControlSVGFile {
  textbox: string;
  arrow_bottom: string;
  calendar: string;
  gear: string;
  date: string;
  dropdown: string;
  initials: string;
}

//document advanced data, cc, expired day
export interface AdvancedData {
  advanced: object;
  cc: string[];
  autoReminder: object;
  customExpDay: number;
}

export interface DocSavedState {
  draft: boolean;
  template: boolean;
  inprogress: boolean;
}