import Dropzone from "react-dropzone";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { Button } from "@heroui/button";
import { FileAddBoardProps } from "@/interface/interface";

const FileAdd: React.FC<FileAddBoardProps> = ({
  setFile,
  filename,
  setFilename,
  title,
  description
}) => {
  const handleFiles = (files: File[]) => {
    console.log(files);
    setFilename(files[0].name);
    setFile(files[0])
  };

  return (
    <>
      <Dropzone onDrop={(acceptedFiles) => handleFiles(acceptedFiles)}>
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="flex flex-col text-link justify-center w-full h-full items-center bg-background rounded-md border-1 gap-1 p-8"
          >
            <input {...getInputProps()} />
            {filename ? <CheckCircleOutlineOutlinedIcon fontSize="large" /> : <PostAddOutlinedIcon fontSize="large" />}
            <h1 className="dropzone-title">{filename ? `${filename} selected` : `${title}` }</h1>
            <p className="dropzone-summary">
              {description}
            </p>
            {filename ? <Button
              className="bg-forecolor rounded-md"
              onPress={() => {
                setFilename("");
                setFile(null);
              }}
              size="sm"
              startContent={<DeleteForeverOutlinedIcon />}
            >
              Delete
            </Button>:""}
          </div>
        )}
      </Dropzone>
    </>
  );
};

export default FileAdd;
