'use client'

import React, { useState } from "react";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

import InputMask from 'react-input-mask';

export default function Signupstarted() {

    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [phoneError, setPhoneError] = useState<string>("");

    // Validate phone number format (XXX) XXX-XXXX
    const validatePhoneNumber = (number: string): boolean => {
        const phoneRegex = /^$\d{3}$ \d{3}-\d{4}$/;
        return phoneRegex.test(number);
    };

    // Handle phone number change input
    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setPhoneNumber(input);
        
        // Validate phone number and set errors if needed
        if (!validatePhoneNumber(input)) {
            setPhoneError("Please enter a valid phone number format: (XXX) XXX-XXXX");
        } else {
            setPhoneError("");
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!validatePhoneNumber(phoneNumber)) {
            alert("Please fix the errors before submitting.");
            return;
        }

        // Handle form submission logic here
        console.log("Form submitted with:", { phoneNumber });
    };


    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-start justify-center bg-background gap-4 rounded-md max-w-lg" style={{ width: '24rem' }}>
            <p style={{ fontSize: '2rem', fontWeight: 500 }}>Let's get started</p>
            <p className="text-text mb-2">Add your info to make collaboration easy</p>
            <div className="flex justify-between gap-1 w-full">
                <Input 
                type="text" 
                label="First Name" 
                variant='bordered' 
                labelPlacement='outside' 
                placeholder="Your first name" 
                // size="md"
                fullWidth
                required
                />
                <Input 
                type="text" 
                label="Last Name" 
                variant='bordered'
                labelPlacement='outside'
                placeholder="Your last name" 
                // size="md"
                fullWidth
                />
            </div>
            {/* <Input 
            type="text" 
            label="Phone Number" 
            variant='bordered'
            labelPlacement='outside'
            placeholder="+1 (999) 999 9999" 
            // size="md"
            fullWidth
            required
            /> */}
            <InputMask
                mask="(999) 999-9999"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
            >
                {() => (
                    <Input
                        type="text"
                        label="Phone Number(+1)"
                        variant='bordered'
                        labelPlacement='outside'
                        placeholder="(123) 456-7890"
                        fullWidth
                        required
                        // helperText={phoneError} // Show error message if exists
                        // color={phoneError ? "error" : "default"} // Change color if there's an error
                    />
                )}
            </InputMask>            
            <Button type="submit" color="primary" fullWidth className="text-white" size="md">Get Started</Button>
        </form>
    );
}
