export const generateColorForRecipient = (recipient: string) => {
    let hash = 0;
    for (let i = 0; i < recipient.length; i++) {
      hash = recipient.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Convert hash to a hexadecimal color
    const color = `#${((hash >> 24) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 16) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 8) & 0xFF).toString(16).padStart(2, '0')}`;
    return color.slice(0, 7); // Ensure the string is a valid HEX color
}

export const hexToRgba = (hex: string, opacity: number) => {
  // Remove the '#' if present
  hex = hex.replace(/^#/, '');

  // Convert hex to RGB
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Return the rgba string with the specified opacity
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}