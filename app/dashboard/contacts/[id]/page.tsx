"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@heroui/input";
import { redirect, useRouter } from "next/navigation";
import { useActionState } from "react";
import { Button } from "@heroui/button";
import { updateContact } from "../action";
import LoadingButton from "@/components/ui/loadingbutton";
import StateBoard from "@/components/ui/stateboard";
import { useParams } from "next/navigation";
import { ActionInitialState } from "@/interface/interface";

const initialState: ActionInitialState = {
  state:"",
  data: {},
  message: "",
  isLoading: false,
};

const EditContact = () => {
  const params = useParams()
  const router = useRouter();

  const [state, formAction] = useActionState(updateContact, initialState);
  const [isVisible, setIsVisible] = useState<boolean>(false); // visible password
  const [isLoading, setIsLoading] = useState<boolean>(false); // loading button
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [value, setEmailValue] = useState<string>(""); // email format validation
  const [name, setName] = useState<string>("");
  const [ contactId, setContactId ] = useState<any>("");

  // const validateEmail = (value: string) =>
  //   value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  useEffect(() => {
    setContactId(params.id);
  }, [])

  const isInvalid = React.useMemo(() => {
    return (value==="") ? false : true;
    // return validateEmail(value) ? false : true;

  }, [value]);

  useEffect(() => {
    setIsLoading(state.isLoading || false);
    if(state.state==="success") redirect("/dashboard/contacts");
  }, [state]);

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
        isLoading={isLoading} 
        title="Save" 
        />
        <Button variant="bordered" onPress={() => router.back()}>
          Back
        </Button>
      </form>
    </section>
  );
};

export default EditContact;
