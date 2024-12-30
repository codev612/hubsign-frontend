"use client"

import React, { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";

// import { signin } from "./action";
import { updateContact } from "../action";

import LoadingButton from "@/components/common/loadingbutton";
import StateBoard from "@/components/common/stateboard";
import { Button } from "@nextui-org/button";
import { siteConfig } from "@/config/site";
import Cookies from "js-cookie";

interface InitialState {
    message: string;
    isLoading: boolean;
  }
  
const initialState: InitialState = {
    message: "",
    isLoading: false,
};

const EditContact = ({params}:{
    params: {
        id: string | number | readonly string[] | undefined; slug: string 
}
  }) => {
    // const path = usePathname();
    const router = useRouter();
   
    const [state, formAction] = useFormState(updateContact, initialState);
    // visible password
    const [isVisible, setIsVisible] = useState(false);
    // loading button
    const [isLoading, setIsLoading] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    // email format validation
    const [value, setEmailValue] = useState<string>("");
    const [name, setName] = useState<string>("");

    const validateEmail = (value: string) =>
        value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

    const isInvalid = React.useMemo(() => {
        if (value === "") return false;

        return validateEmail(value) ? false : true;
    }, [value]);

    useEffect(() => {
        setIsLoading(state.isLoding || false);
    }, [state]);

    useEffect(()=>{
        if(params.id!=="new") {
            const fetchData = async () => {
                try {
                    const res = await fetch(`${siteConfig.links.server}/contacts/${params.id}`,{
                        method:"GET",
                        headers: {
                            Authorization: `Bearer ${Cookies.get('session') || ""}`
                        }
                    });
                    if (!res.ok) throw new Error("Failed to fetch data");
                    const result = await res.json();
                    setName(result.name);
                    setEmailValue(result.email);
                } catch (error) {
                    state.message="Server error";
                    state.isLoading=false;
                } finally {
                    state.isLoading=false;
                }
            };
        
            fetchData();
        }
    }, [])

    return (
        <section className="flex flex-col justify-center items-center w-full">
            <form
                action={formAction}
                className="flex flex-col justify-center bg-forecolor p-10 gap-4 rounded-md"
                // style={{ width: "382px" }}
                onSubmit={() => setIsLoading(true)}
            >
                <p className="title-large">Contacts Information</p>
                <p className="text-text mb-2">Enter contacts information below</p>
                <Input
                required
                errorMessage="Please enter a valid email"
                isInvalid={isInvalid}
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
                // isInvalid={isInvalid}
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
                <input hidden readOnly value={params.id} name="id" />
                {state.message !== "" ? (
                <StateBoard state="text-error" text={state.message} />
                ) : (
                ""
                )}
                <LoadingButton disable={isInvalid} isLoading={isLoading} title="Save" />
                <Button 
                variant="bordered"
                onClick={()=>router.back()}
                >Back</Button>
            </form>
        </section>
    )
}

export default EditContact;