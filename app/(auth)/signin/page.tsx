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

export default function Signin() {

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <form className="flex flex-col items-center justify-center bg-forecolor p-10 gap-4 rounded-md">
                <p style={{ fontSize: '2rem', fontWeight: 500 }}>Log in to eSign</p>
                <p className="text-text mb-2">Enter your credentials to access your account</p>
                <Input 
                type="email" 
                label="Email" 
                variant={'bordered'} 
                labelPlacement={'outside'} 
                placeholder="Enter your email" 
                size="md"
                />
                <Input
                label="Password"
                variant="bordered"
                placeholder="Enter your password"
                labelPlacement={'outside'}
                size="md"
                endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                    {isVisible ? (
                        <VisibilityOffOutlinedIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                        <VisibilityOutlinedIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                    </button>
                }
                type={isVisible ? "text" : "password"}
                description={<Link href="/"><p className="text-text">Forgot your password?</p></Link>}
                />
                <Button color="primary" fullWidth className="text-white" size="md">Log in</Button>
                <div className="flex flex-col items-center justify-center">
                    <Link href="/"><p className="text-text">Don't have an account?</p></Link>
                    <Link href="/"><p>Signup for 30 days free trial</p></Link>
                </div>
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
