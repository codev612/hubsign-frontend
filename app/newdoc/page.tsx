"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
// import { signin } from "./action";
import { Tabs, Tab } from "@nextui-org/react";
import { Input} from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";
import { signin } from "../(auth)/signin/action";
import FileUpload from "@/components/common/fileupload";
import Recipients from "@/components/pages/newdoc/recipients";

interface InitialState {
  message: string;
  isLoading: boolean;
}

const initialState: InitialState = {
  message: "",
  isLoading: false,
};

export default function NewDoc() {
  const router = useRouter();
  const [state, formAction] = useFormState(signin, initialState);
  // visible password
  const [isVisible, setIsVisible] = useState<boolean>(false);
  // loading button
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  // email format validation
  const [value, setEmailValue] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = React.useMemo(() => {
    if (value === "") return false;

    return validateEmail(value) ? false : true;
  }, [value]);

  const [isUpLoading, setIsUpLoading] = useState<boolean>(false);
  const [selectedFile, setFile] = useState<any>(null);
  const [filename, setFilename] = useState<string>("");

  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);

  const [customSigningOrder, setCustomSigningOrder] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(false);
  }, [state]);

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
        <Tab key={"document"} title="Upload a document">
          <FileUpload setFile={setFile} filename={filename} setFilename={setFilename} />
        </Tab>
        <Tab key={"template"} title="Start with a template">
          <p>select a template</p>
        </Tab>
      </Tabs>
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="title-medium">Add Recipients</h1>
        <Checkbox isSelected={customSigningOrder} onValueChange={setCustomSigningOrder}>Custom singing order</Checkbox>
      </div>
      <Recipients customSigningOrder={customSigningOrder} />
    </section>
  );
}
