import React from "react";
import Link from "next/link";

interface MenuItem {
  label: string;
  link: string;
}

interface PageMenuProps {
  items: MenuItem[]; // Define items as an array of MenuItem
  currentPath: string;
}

const PageMenu: React.FC<PageMenuProps> = ({ items, currentPath }) => {
  return (
    <div className="flex flex-row gap-2 border-b-2">
      {items.map((item) => (
        <Link
          key={item.link} // Use item.path as a unique key
          className={`px-4 py-3 ${currentPath === item.link ? "text-blue-500 border-b-4 border-blue-500" : ""}`} // Add active styles or classes
          href={item.link}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default PageMenu;
