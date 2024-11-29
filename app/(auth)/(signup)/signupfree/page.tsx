'use client'

import React, { useState } from "react";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Input } from "@nextui-org/input";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Button } from "@nextui-org/button";

export default function Signupfree() {
    // visible password
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    // email format validation
    const [value, setEmailValue] = useState("");

    const validateEmail = (value: string) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

    const isInvalid = React.useMemo(() => {
        if (value === "") return false;
    
        return validateEmail(value) ? false : true;
      }, [value]);


    return (
        // <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <form className="flex flex-col items-start justify-center bg-background gap-4 rounded-md max-w-lg">
                <p style={{ fontSize: '2rem', fontWeight: 500 }}>Signup to eSign and try for free for 30 days</p>
                <p className="text-text mb-2">Enter your email to get started. No credit card required</p>
                <Input 
                type="email" 
                label="Email" 
                variant={'bordered'} 
                labelPlacement={'outside'} 
                placeholder="Enter your email" 
                size="md"
                isInvalid={isInvalid}
                errorMessage="Please enter a valid email"
                onValueChange={setEmailValue}
                required
                />
                <Button color="primary" fullWidth className="text-white" size="md">Get Started</Button>
                <div className="flex flex-col items-center justify-center">
                    <div>By clicking the Get Started above, you agree to the <Link href="/"><p>Terms & Conditions</p></Link> and <Link href="/"><p>Privacy Policy</p></Link></div>
                </div>
            </form>
        // </section>
    );
}
