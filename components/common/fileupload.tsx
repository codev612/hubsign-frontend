import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Dropzone from 'react-dropzone';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from "@nextui-org/button";

const FileUplaod = () => {
    const [isUpLoading, setIsUpLoading] = useState(false);
    const [selectedFile, setFile] = useState(null);
    const [filename, setFilename] = useState("");

    const handleFiles = (files: File[]) => {
        console.log(files);
        setFilename(files[0].name);
    }

    return (
        <>
            {filename?<div 
            className="flex flex-row items-center justify-center gap-1"
            >{filename} <Button className="bg-forecolor" onClick={()=>{ setFilename(""); setFile(null);}}><CloseIcon /></Button></div>:""}
            <Dropzone onDrop={acceptedFiles => handleFiles(acceptedFiles)}>
            {({getRootProps, getInputProps}) => (
                <div {...getRootProps()} className="flex flex-col text-link justify-center items-center bg-background rounded-md border-1 gap-1">
                    <input {...getInputProps()} />
                    <PostAddOutlinedIcon fontSize="large" />
                    <h1 className="dropzone-title">Add a document for signing</h1>
                    <p className="dropzone-summary">Click to upload a document from your device, or drag & drop it here. Supported files: PDF, Word, PowerPoint, JPG, PNG</p>
                </div>
            )}
            </Dropzone>
        </>
    )
}

export default FileUplaod;