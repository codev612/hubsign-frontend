"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";
import Cookies from "js-cookie";
import { signin } from "../(auth)/signin/action";
import FileUpload from "@/components/common/fileupload";
import Recipients from "@/components/pages/adddoc/recipients";
import { siteConfig } from "@/config/site";

interface InitialState {
  message: string;
  isLoading: boolean;
}

const initialState: InitialState = {
  message: "",
  isLoading: false,
};

interface Recipient {
  name: string;
  email: string;
}

interface ChildComponentProps {
  contacts: Recipient[]; // Define the type of contacts properly
  user: Recipient; // Define the type of user properly
}

const AddDoc = () => {
  const router = useRouter();
  const [state, formAction] = useActionState(signin, initialState);
  // visible password
  const [isVisible, setIsVisible] = useState<boolean>(false);
  // loading button
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  // // email format validation
  // const [value, setEmailValue] = useState<string>("");
  // const [password, setPassword] = useState<string>("");

  // const validateEmail = (value: string) =>
  //   value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  // const isInvalid = React.useMemo(() => {
  //   if (value === "") return false;

  //   return validateEmail(value) ? false : true;
  // }, [value]);

  const [isUpLoading, setIsUpLoading] = useState<boolean>(false);
  const [selectedFile, setFile] = useState<any>(null);
  const [filename, setFilename] = useState<string>("");

  const [contacts, setContacts] = useState<any[]>([]);
  const [user, setUser] = useState<any>({});
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);

  const [customSigningOrder, setCustomSigningOrder] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(false);
  }, [state]);

  useEffect(() => {
    const fetchContactsData = async () => {
      try {
        const response = await fetch(`${siteConfig.links.server}/contacts`, {
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
          `${siteConfig.links.server}/auth/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("session") || ""}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();

        setUser({
          name: `${result.firstname} ${result.lastname}`,
          email: result.email,
        });
        // setData(result); // Set the fetched data to state
      } catch (error) {
        // setError("Failed to fetch data");
        console.error(error);
      } finally {
        // setLoading(false); // Set loading to false when fetching is done
      }
    };

    fetchContactsData();
    fetchUserData();
  }, []); // Empty dependency array ensures this runs only once on mount

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
          <FileUpload
            filename={filename}
            setFile={setFile}
            setFilename={setFilename}
          />
        </Tab>
        <Tab key={"template"} title="Start with a template">
          <p>select a template</p>
        </Tab>
      </Tabs>
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="title-medium">Add Recipients</h1>
        <Checkbox
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
      />
    </section>
  );
};

export default AddDoc;
