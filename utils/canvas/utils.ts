export const generateColorForRecipient = (recipient: string) => {
  let hash = 0;

  for (let i = 0; i < recipient.length; i++) {
    hash = recipient.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Convert hash to a hexadecimal color
  const color = `#${((hash >> 24) & 0xff).toString(16).padStart(2, "0")}${((hash >> 16) & 0xff).toString(16).padStart(2, "0")}${((hash >> 8) & 0xff).toString(16).padStart(2, "0")}`;

  return color.slice(0, 7); // Ensure the string is a valid HEX color
};

export const hexToRgba = (hex: string, opacity: number) => {
  // Remove the '#' if present
  hex = hex.replace(/^#/, "");

  // Convert hex to RGB
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Return the rgba string with the specified opacity
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Function to replace fill and stroke colors dynamically
export const updateSvgColors = (
  svg: string,
  newFill: string,
  newStroke: string,
) => {
  return svg
    .replace(/fill="[^"]*"/g, `fill="${newFill}"`) // Replace fill color
    .replace(/stroke="[^"]*"/g, `stroke="${newStroke}"`); // Replace stroke color
};

export const getFutureDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);

  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${mm}/${dd}/${yyyy}`;
};

export const formatDateTime = (dateString:string) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
  }

  // Format date as mm/dd/yyyy
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  const formattedDate = `${month}/${day}/${year}`;

  // Format time as hh:mm
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  return { formattedDate, formattedTime };
};