'use client'

import React, { ChangeEvent, KeyboardEvent, ClipboardEvent, useState } from "react";
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

export default function Checkinbox() {

    const [code, setCode] = useState<string[]>(Array(6).fill("")); // Create an array with 6 empty strings

    const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        // Allow only one digit
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            // Focus next input field
            if (value && index < 5) {
                document.getElementById(`digit-${index + 1}`)?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && !code[index] && index > 0) {
            // Focus previous input if backspace is pressed on empty input
            document.getElementById(`digit-${index - 1}`)?.focus();
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>, index: number) => {
        const pastedData = event.clipboardData.getData('text');

        // Check if pasted data is exactly 6 digits
        if (/^\d{6}$/.test(pastedData)) {
            const newCode = pastedData.split("").map(digit => digit);
            setCode(newCode);
            document.getElementById(`digit-5`)?.focus(); // Focus last input
            event.preventDefault(); // Prevent default paste behavior
        } else {
            event.preventDefault(); // Prevent invalid paste
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const verificationCode = code.join(""); // Join the array to submit as a string
        console.log("Verification code submitted:", verificationCode);
        // Submit code for verification
    };

    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <form onSubmit={handleSubmit} className="flex flex-col justify-center bg-forecolor p-10 gap-4 rounded-md" style={{ width: '382px' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 500 }}>Check your inbox</p>
                <p className="text-text mb-2">Please enter 6-digit code. Then create and confirm your new password.</p>
                <div className="flex justify-around">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            id={`digit-${index}`}
                            type="text"
                            value={digit}
                            onChange={(event) => handleChange(index, event)}
                            onKeyDown={(event) => handleKeyDown(index, event)}
                            onPaste={(event) => handlePaste(event, index)}
                            maxLength={1}
                            className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md"
                            required
                        />
                    ))}
                </div>
                <div className="flex">
                    <p>Didn't get the code?</p>
                    <Link>Resend the code</Link>
                </div>
                <Button type="submit" color="primary" fullWidth className="text-white" size="md">Verify</Button>
            </form>
        {/* <div className="inline-block max-w-xl text-center justify-center bg-forecolor">
            <span className={title()}>Make&nbsp;</span>
            <span className={title({ color: "violet" })}>Signin&nbsp;</span>
            <br />
            <span className={title()}>
            websites regardless of your design experience.
            </span>
            <div className={subtitle({ class: "mt-4" })}>
            Beautiful, fast and modern React UI library.
            </div>
        </div>

        <div className="flex gap-3">
            <Link
            isExternal
            className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
            })}
            href={siteConfig.links.docs}
            >
            Documentation
            </Link>
            <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
            >
            <GithubIcon size={20} />
            GitHub
            </Link>
        </div>

        <div className="mt-8">
            <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
                Get started by editing <Code color="primary">app/page.tsx</Code>
            </span>
            </Snippet>
        </div> */}
        </section>
    );
}
