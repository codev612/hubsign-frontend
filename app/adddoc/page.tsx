"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, Tab, Button } from "@heroui/react";
import { Checkbox } from "@heroui/react";
import Cookies from "js-cookie";
import { Upload } from "upload";

import { Recipient } from "@/interface/interface";
import { allowedUploadFile } from "@/constants/common";
import FileAdd from "@/components/pages/adddoc/fileadd";
import Recipients from "@/components/pages/adddoc/recipients";

interface InitialState {
  message: string;
  isLoading: boolean;
}

const initialState: InitialState = {
  message: "",
  isLoading: false,
};

const AddDoc = () => {
  const router = useRouter();

  // // email format validation
  // const [value, setEmailValue] = useState<string>("");
  // const [password, setPassword] = useState<string>("");

  // const validateEmail = (value: string) =>
  //   value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  // const isInvalid = React.useMemo(() => {
  //   if (value === "") return false;

  //   return validateEmail(value) ? false : true;
  // }, [value]);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadDone, setUploadDone] = useState<boolean>(false);
  const [uploadedFilename, setUploadedFilename] = useState<string>("");
  const [uploadedFilepath, setUploadedFilepath] = useState<string>("");

  const [selectedFile, setFile] = useState<any>(null);
  const [filename, setFilename] = useState<string>("");
  const [selectedTemplate, setTemplate] = useState<string>("");

  const [recpts, setRcpts] = useState<Recipient[]>([]);
  const [contacts, setContacts] = useState<Recipient[]>([]);
  const [user, setUser] = useState<Recipient>({
    name: "",
    email: ""
  });

  const [customSigningOrder, setCustomSigningOrder] = useState<boolean>(false);

  const [disable, setDisable] = useState<boolean>(true);
   // loading button
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<string>("document");

  useEffect(() => {
    const fetchContactsData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/contacts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("session") || ""}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();

        setContacts(result);
        // setData(result); // Set the fetched data to state
      } catch (error) {
        // setError("Failed to fetch data");
        console.error(error);
      } finally {
        // setLoading(false); // Set loading to false when fetching is done
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("session") || ""}`,
            },
          },
        );

        console.log(response.body)
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();

        setUser({
          name: `${result.firstname} ${result.lastname}`,
          email: result.email,
        });
      } catch (error) {
        // setError("Failed to fetch data");
        console.error(error);
      } finally {
        // setLoading(false); // Set loading to false when fetching is done
      }
    };

    fetchContactsData();
    fetchUserData();
  }, []);

  useEffect(()=>{
    (recpts.length && (selectedFile || selectedTemplate)) ? setDisable(false) : setDisable(true);
  },[recpts, selectedFile, selectedTemplate])

  // check if recipients has empty value
  const hasEmptyFields = () => {
    return recpts.some(
      (recipient) => !recipient.email || recipient.email === "" || !recipient.name || recipient.name === ""
    );
  };

  // check file size and type
  const fileCheck = (file:File) => {
    return ( file && file!.size > allowedUploadFile.size || !allowedUploadFile.extention.includes(file!.type) ) ?  false : true;
  }

  const handleSetFile = (file:File) => {
    if (file && fileCheck(file)) {
      setFile(file)
    } else {
      setFile(null);
      setFilename("");
    }
  }

  useEffect(() => {
    if(uploadDone){
      setUploadDone(false);
      handleAddDocument();
    }
  }, [uploadDone])

  //file upload when prepare button's clicked
  const handleFileUpload = async () => {   
    if(!selectedFile) return;

    if(hasEmptyFields()) return;

    setIsLoading(true);
    setIsUploading(true);

    try{
      const upload = new Upload({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/upload/document`,
        form: {
          file: selectedFile,
        },
        headers: {
          Authorization: `Bearer ${Cookies.get("session") || ""}`,
        },
      });
    
      upload.on('progress', progress => {
        console.log(progress);
      });
    
      const response = await upload.upload();
      const json = JSON.parse(response.data as string);

      if(response.status === 201) {
        setUploadDone(true);
        setUploadedFilename(json.filename);
        setUploadedFilepath(json.filepath);
      }
      setIsLoading(false);
    } catch(error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  // adding document the minute file upload finishs
  const handleAddDocument = async () => {
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/document/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("session") || ""}`,
        },
        body: JSON.stringify({ 
          name: filename,
          filename: uploadedFilename,
          filepath: uploadedFilepath,
          recipients: recpts,
          signingOrder: customSigningOrder,
        }),
      })

      if(!response.ok) {
        setIsLoading(false);
        return;
      }
      const json = await response.json();
      console.log(json);
      router.push(`/signdoc/draft/${json.uid}`);
    } catch (error) {
      // console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <section className="flex flex-col items-start w-full justify-center gap-4">
      <h1 className="title-medium">Add Document</h1>
      <Tabs
        aria-label="Dynamic tabs"
        classNames={{
          tabList: "bg-background",
          cursor: "w-full bg-forecolor rounded text-text",
          tab: "max-w-fit px-12",
          // tabContent: "p-0",
        }}
        size="lg"
      >
        <Tab key={"document"} title="Upload a document" onClick={()=>setActiveTab("document")}>
          <FileAdd
            filename={filename}
            setFile={handleSetFile}
            setFilename={setFilename}
            title="Add a document for signing"
            description="Click to upload a document from your device, or drag & drop it here. Supported files: PDF, Word, PowerPoint, JPG, PNG"
          />
        </Tab>
        <Tab key={"template"} title="Start with a template" onClick={()=>setActiveTab("template")}>
          <p>select a template</p>
        </Tab>
      </Tabs>
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="title-medium">Add Recipients</h1>
        <Checkbox
          className="text-white"
          isSelected={customSigningOrder}
          onValueChange={setCustomSigningOrder}
        >
          Custom singing order
        </Checkbox>
      </div>
      <Recipients
        contacts={contacts}
        customSigningOrder={customSigningOrder}
        user={user}
        recipients={recpts}
        setRecipient={setRcpts}
      />
      <Button
      fullWidth
      color="primary"
      className="text-white"
      isLoading={isLoading}
      isDisabled={disable}
      onPress={handleFileUpload}
      >
        Prepare for signing
      </Button>
    </section>
  );
};

export default AddDoc;
