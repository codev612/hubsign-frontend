export const generateColorForRecipient = (recipient: string) => {
    let hash = 0;
    for (let i = 0; i < recipient.length; i++) {
      hash = recipient.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Convert hash to a hexadecimal color
    const color = `#${((hash >> 24) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 16) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 8) & 0xFF).toString(16).padStart(2, '0')}`;
    return color.slice(0, 7); // Ensure the string is a valid HEX color
}