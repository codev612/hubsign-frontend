import { hexToRgba } from "@/utils/canvas/utils";
import React, { useEffect } from "react";

interface AvatarProps {
    name: string;
    color: string;
    size?: number;
}

const getInitials = (name: string): string => {
    return name
        .split(" ")
        .map((n) => n[0]?.toUpperCase())
        .join("")
        .slice(0, 2); // Get first two initials
};


const Avatar: React.FC<AvatarProps> = ({ name, color, size = 50 }) => {
    const initials = getInitials(name);

    useEffect(() => {
        console.log(color)
    }, [])
        
    return (
        <div
        className={`flex items-center justify-center text-white font-bold rounded-full`}
        style={{ 
            width: size, 
            height: size, 
            fontSize: size * 0.4,
            backgroundColor: hexToRgba(color, 0.1), 
            // opacity: 0.1,
            color: color
        }}
        >
            {initials}
        </div>
    );
};

export default Avatar;