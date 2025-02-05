import React from 'react'

export const RadioBoxIcon = ({fill, stroke}:{fill: string, stroke: string}) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" fill={fill} />
        <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" stroke={stroke} />
        <rect x="6.18164" y="6.18164" width="11.6364" height="11.6364" rx="5.81818" stroke={stroke} />
        <ellipse cx="11.9999" cy="11.9989" rx="2.90909" ry="2.90909" fill={stroke} />
        </svg>
    )
}