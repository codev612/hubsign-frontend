import Dropzone from "react-dropzone";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@heroui/button";

interface FileUploadProps {
  filename: string;
  // message: string;
  // title: string;
  // id: string[];
  setFile: (file: any) => void;
  setFilename: (filename: string) => void;
  // onOpen: () => void;
  // onOpenChange: (isOpen: boolean) => void; // Adjust if the signature for onOpenChange is different
}

const FileUplaod: React.FC<FileUploadProps> = ({
  setFile,
  filename,
  setFilename,
}) => {
  const handleFiles = (files: File[]) => {
    console.log(files);
    setFilename(files[0].name);
  };

  return (
    <>
      {filename ? (
        <div className="flex flex-row items-center justify-center gap-1">
          {filename}{" "}
          <Button
            className="bg-forecolor"
            onPress={() => {
              setFilename("");
              setFile(null);
            }}
          >
            <CloseIcon />
          </Button>
        </div>
      ) : (
        ""
      )}
      <Dropzone onDrop={(acceptedFiles) => handleFiles(acceptedFiles)}>
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="flex flex-col text-link justify-center items-center bg-background rounded-md border-1 gap-1 p-8"
          >
            <input {...getInputProps()} />
            <PostAddOutlinedIcon fontSize="large" />
            <h1 className="dropzone-title">Add a document for signing</h1>
            <p className="dropzone-summary">
              Click to upload a document from your device, or drag & drop it
              here. Supported files: PDF, Word, PowerPoint, JPG, PNG
            </p>
          </div>
        )}
      </Dropzone>
    </>
  );
};

export default FileUplaod;
