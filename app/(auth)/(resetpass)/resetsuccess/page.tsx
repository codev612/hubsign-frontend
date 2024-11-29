'use client'

import React, { ChangeEvent, KeyboardEvent, useState } from "react";
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
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';

export default function Resetsuccess() {

   return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <form className="flex flex-col justify-center bg-forecolor p-10 gap-4 rounded-md" style={{ width: '382px' }}>
                <VerifiedOutlinedIcon />
                <p style={{ fontSize: '1.25rem', fontWeight: 500 }}>Password successfully reset</p>
                <p className="text-text mb-2">Your password has been successfully reset. Click below to log in. </p>
                
                <Link href="/signin"><Button color="primary" fullWidth className="text-white" size="md">Back to log in</Button></Link>
            </form>
        </section>
    );
}
