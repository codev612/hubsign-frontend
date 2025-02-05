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
}
