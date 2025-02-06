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
  state: string,
  data: any,
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
  uid: string,
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
  uid: string,
  show: boolean;
  position: Position;
  value: TextboxSettings;
}

export interface RadioboxSettings {
  recipient: string;
  required: boolean;
}

export interface RadioboxSettingFormState {
  uid: string,
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
  uid: string,
  show: boolean;
  position: Position;
  width: number;
  value: DropdownboxSettings;
}

export interface DateboxSettings {
  recipient: string;
  format: string;
  required: boolean;
  lockedToday:boolean;
}

export interface DateboxSettingFormState {
  uid: string,
  show: boolean;
  position: Position;
  width: number;
  value: DateboxSettings;
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
  showDropdownboxSettingForm: any;
  setShowDropdownboxSettingForm: React.Dispatch<any>;
  recipients: Recipient[];
  setDropdownboxSetting: (payload: any) => void;
  signMode: boolean;
}

export interface DateboxGroupProps {
  showDateboxSettingForm: DateboxSettingFormState;
  setShowDateboxSettingForm: React.Dispatch<React.SetStateAction<DateboxSettingFormState>>;
  recipients: Recipient[];
  setDateboxSetting: (payload: any) => void;
  signMode: boolean;
}

//adddoc component
export interface FileAddBoardProps {
  filename: string;
  setFile: (file: any) => void;
  setFilename: (filename: string) => void;
}

//document data
export interface DocData {
  filename: string,
  recipients: Recipient[],
}

//canvas control icon file
export interface ControlSVGFile {
  textbox: string,
  textbox_edit: string,
  radiobox_empty: string,
  radiobox_filled: string,
  radiobox_edit: string,
  radio_add_button: string,
  dropdownbox: string,
  arrow_bottom: string,
  datebox: string,
  calendar: string,
}
