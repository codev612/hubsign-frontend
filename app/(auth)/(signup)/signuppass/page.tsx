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

export default function Signuppass() {
    //
    const [password, setPassword] = useState('')

    const [passState6, setPassState6] = useState(false)

    const [passStateContain, setPassStateContain] = useState(false)

    const [confirmPassword, setConfirmPassword] = useState('')

    const [match, setMatch] = useState(false)

    // Regex pattern for password validation
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[<>])(?=\S)(.{6,})$/;// At least 6 characters, one uppercase, one lowercase, and no spaces
    const invalidCharPattern = /[<>]/; // Invalid characters: < and >

    const validatePassword = (inputPassword: string) => {
        // Check password length
        if(password.length >= 6) {
            setPassState6(true)
        } else {
            setPassState6(false)
        }

        // Check for invalid characters
        console.log(setPassStateContain(!invalidCharPattern.test(inputPassword)));

        // if (passwordPattern.test(inputPassword)) {
        //     setPassStateContain(true)
        //     // setErrorMessage(''); // Clear error message on valid password
        // } else {
        //     setPassStateContain(false)
        //     // setErrorMessage('Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one of the special characters (< or >), and must not contain spaces.');
        // }
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setPassword(value);
        validatePassword(value);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setConfirmPassword(value);

        ( value === password ) ? setMatch(true) : setMatch(false) 
    };

    // visible password
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const PasswordDesc = () => (
        <div>
            <div className="flex items-center gap-1">
                <input 
                readOnly
                style={{
                    borderRadius: '50%', // Makes the input circular
                    width: '10px', // Width of the input dot
                    height: '10px', // Height of the input dot
                    backgroundColor: passState6 ? 'blue' : 'inherit'
                
                }}></input>
                <p className="text-text">at least 6  characters</p>
            </div>
            <div className="flex items-center gap-1">
                <input 
                readOnly
                style={{
                    borderRadius: '50%', // Makes the input circular
                    width: '10px', // Width of the input dot
                    height: '10px', // Height of the input dot
                    backgroundColor: passStateContain ? 'blue' : 'inherit'
                
                }}></input>
                <p className="text-text">{'1 not containing spaces and <,> case'}</p>
            </div>
        </div>
    )

    const MatchDesc = () => (
        <p className="text-text">{match ? 'Match' : 'Not match'}</p>
    )


    return (
            <form className="flex flex-col items-start justify-center bg-background gap-4 rounded-md max-w-lg w-full" style={{ width: '32rem' }}>
                <p style={{ fontSize: '2rem', fontWeight: 500 }}>New Password</p>
                <p className="text-text mb-2">Enter your credentials to access your account</p>
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
                value={password}
                onChange={handlePasswordChange}
                description={<PasswordDesc />}
                fullWidth
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
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                description={<MatchDesc />}
                />
                <Button color="primary" fullWidth className="text-white" size="md">Start using eSign</Button>
            </form>
    );
}
