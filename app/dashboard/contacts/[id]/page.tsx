"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Button } from "@nextui-org/button";
import Cookies from "js-cookie";
import { updateContact } from "../action";
import LoadingButton from "@/components/common/loadingbutton";
import StateBoard from "@/components/common/stateboard";
import { siteConfig } from "@/config/site";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";

// Define InitialState type
interface InitialState {
  message: string;
  isLoading: boolean;
}

const initialState: InitialState = {
  message: "",
  isLoading: false,
};

// Define Params type
interface Params {
  id: string | number | readonly string[] | undefined;
  slug: string;
}

const EditContact = () => {
  const params = useParams()
  const router = useRouter();

  const [state, formAction] = useActionState(updateContact, initialState);
  const [isVisible, setIsVisible] = useState(false); // visible password
  const [isLoading, setIsLoading] = useState(false); // loading button
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [value, setEmailValue] = useState<string>(""); // email format validation
  const [name, setName] = useState<string>("");
  const [ contactId, setContactId ] = useState<any>("");

  // const validateEmail = (value: string) =>
  //   value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  useEffect(() => {
    console.log(params)
    setContactId(params.id);
  }, [])

  const isInvalid = React.useMemo(() => {
    return (value==="") ? false : true;
    // return validateEmail(value) ? false : true;

  }, [value]);

  useEffect(() => {
    setIsLoading(state.isLoading || false);
  }, [state]);

  useEffect(() => {
    if (contactId !== "new") {
      const fetchData = async () => {
        try {
          const res = await fetch(
            `${siteConfig.links.server}/contacts/${contactId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${Cookies.get("session") || ""}`,
              },
            }
          );

          if (!res.ok) throw new Error("Failed to fetch data");
          const result = await res.json();

          setName(result.name);
          setEmailValue(result.email);
        } catch (error) {
          state.message = "Server error";
          state.isLoading = false;
        } finally {
          state.isLoading = false;
        }
      };

      fetchData();
    }
  }, [contactId]);

  return (
    <section className="flex flex-col justify-center items-center w-full">
      <form
        action={formAction}
        className="flex flex-col justify-center bg-forecolor p-10 gap-4 rounded-md"
        onSubmit={() => setIsLoading(true)}
      >
        <p className="title-large">Contacts Information</p>
        <p className="text-text mb-2">Enter contacts information below</p>
        <Input
          required
          errorMessage="Please enter a valid email"
          // isInvalid={isInvalid}
          label="Email"
          labelPlacement={"outside"}
          name="email"
          placeholder="contact's email"
          size="md"
          type="email"
          value={value}
          variant="bordered"
          onValueChange={setEmailValue}
        />
        <Input
          required
          errorMessage="Please enter contact's name"
          label="Name"
          labelPlacement={"outside"}
          name="name"
          placeholder="contact's name"
          size="md"
          type="text"
          value={name}
          variant="bordered"
          onValueChange={setName}
        />
        <input hidden readOnly name="id" value={contactId} />
        {state.message !== "" ? (
          <StateBoard state="text-error" text={state.message} />
        ) : (
          ""
        )}
        <LoadingButton 
        // disable={isInvalid} 
        isLoading={isLoading} title="Save" 
        />
        <Button variant="bordered" onPress={() => router.back()}>
          Back
        </Button>
      </form>
    </section>
  );
};

export default EditContact;
