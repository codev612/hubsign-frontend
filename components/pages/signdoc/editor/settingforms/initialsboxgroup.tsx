import { useEffect, useState } from "react";
import { Checkbox, Button, useDisclosure } from "@heroui/react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PostAddIcon from "@mui/icons-material/PostAdd";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";

import SignatureEditModal from "../../signatureedit";

import { InitialsboxGroupProps } from "@/interface/interface";
import { useCanvas } from "@/context/canvas";

const InitialsboxGroup: React.FC<InitialsboxGroupProps> = ({
  showInitialsboxSettingForm,
  setShowInitialsboxSettingForm,
  recipients,
  setInitialsboxSetting,
}) => {
  useEffect(() => {
    setSelectRecipient(showInitialsboxSettingForm.value.recipient);
    setCheckRequired(showInitialsboxSettingForm.value.required);
  }, [showInitialsboxSettingForm]);

  const [selectRecipient, setSelectRecipient] = useState<string>(
    showInitialsboxSettingForm.value.recipient,
  );
  const [checkRequired, setCheckRequired] = useState<boolean>(
    showInitialsboxSettingForm.value.required,
  );
  const [initialImage, setInitialImage] = useState<string>(
    showInitialsboxSettingForm.value.initialImage,
  );
  //modal for edit initials and signature
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();

  const contextValue = useCanvas();
  const signMode = contextValue.signMode;

  const handleInitialImageSet = (dataUrl: string) => {
    setInitialImage(dataUrl);
    setInitialsboxSetting({
      uid: showInitialsboxSettingForm.uid,
      value: {
        recipient: selectRecipient,
        required: checkRequired,
        initialImage: dataUrl,
      },
    });
    setShowInitialsboxSettingForm({
      ...showInitialsboxSettingForm,
      show: false,
    });
  };

  // Ensure `isEditOpen` follows `signMode`
  useEffect(() => {
    if (signMode) {
      onEditOpen(); // Open the modal if signMode is true
    }
  }, [signMode, onEditOpen]);

  return (
    <>
      <SignatureEditModal
        isOpen={isEditOpen}
        setInitialImage={handleInitialImageSet}
        title="Initials"
        onOpenChange={onEditOpenChange}
      />
      {!signMode && (
        <div
          className="absolute bg-white p-5 rounded-lg shadow-lg flex flex-col w-[300] gap-2 text-text"
          style={{
            left: showInitialsboxSettingForm.position.left,
            top: showInitialsboxSettingForm.position.top,
          }}
        >
          <select
            className="border-1 rounded-md p-2"
            value={selectRecipient}
            onChange={(e) => setSelectRecipient(e.target.value)}
          >
            {recipients.map((item) => (
              <option key={item.email} value={item.email}>
                {item.name}
              </option>
            ))}
          </select>
          <button
            className="border-1 rounded-md p-1 hover:bg-gray-100 gap-1 flex flex-row items-center justify-center"
            onClick={() => onEditOpen()}
          >
            <BorderColorOutlinedIcon fontSize="small" />
            Edit initials
          </button>
          <div className="flex flex-row items-center justify-between">
            <Checkbox
              className="text-white"
              isSelected={checkRequired}
              onValueChange={() => setCheckRequired(!checkRequired)}
            >
              Required
            </Checkbox>
            <div className="flex flex-row">
              <Button
                isIconOnly
                className="bg-white"
                size="sm"
                startContent={<ContentCopyIcon />}
              />
              <Button
                isIconOnly
                className="bg-white"
                size="sm"
                startContent={<PostAddIcon />}
              />
              <Button
                isIconOnly
                className="bg-white"
                size="sm"
                startContent={<DeleteForeverOutlinedIcon />}
              />
            </div>
          </div>
          <div className="flex flex-row gap-1">
            <Button
              className="text-white rounded-md"
              color="primary"
              size="sm"
              onPress={() => {
                setInitialsboxSetting({
                  uid: showInitialsboxSettingForm.uid,
                  value: {
                    recipient: selectRecipient,
                    required: checkRequired,
                    initialImage: initialImage,
                  },
                });
                setShowInitialsboxSettingForm({
                  ...showInitialsboxSettingForm,
                  show: false,
                });
              }}
            >
              Apply
            </Button>
            <Button
              className="rounded-md"
              size="sm"
              onPress={() =>
                setShowInitialsboxSettingForm({
                  ...showInitialsboxSettingForm,
                  show: false,
                })
              }
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default InitialsboxGroup;
