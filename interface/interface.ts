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
