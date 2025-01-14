"use client";

import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

import { ShapesMenuProps } from "@/types/canvas";

const ShapesMenu = ({
  item,
  activeElement,
  handleActiveElement,
  // handleImageUpload,
  imageInputRef,
}: ShapesMenuProps) => {
  const isDropdownElem = item.value.some(
    (elem) => elem?.value === activeElement.value,
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="no-ring">
          <Button
            className="relative h-5 w-5 object-contain"
            onClick={() => handleActiveElement(item)}
          >
            <Image
              fill
              alt={item.name}
              className={isDropdownElem ? "invert" : ""}
              src={isDropdownElem ? activeElement.icon : item.icon}
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mt-5 flex flex-col gap-y-1 border-none bg-primary-black py-4 text-white">
          {item.value.map((elem) => (
            <Button
              key={elem?.name}
              className={`flex h-fit justify-between gap-10 rounded-none px-5 py-3 focus:border-none ${
                activeElement.value === elem?.value
                  ? "bg-primary-green"
                  : "hover:bg-primary-grey-200"
              }`}
              onClick={() => {
                handleActiveElement(elem);
              }}
            >
              <div className="group flex items-center gap-2">
                <Image
                  alt={elem?.name as string}
                  className={
                    activeElement.value === elem?.value ? "invert" : ""
                  }
                  height={20}
                  src={elem?.icon as string}
                  width={20}
                />
                <p
                  className={`text-sm  ${
                    activeElement.value === elem?.value
                      ? "text-primary-black"
                      : "text-white"
                  }`}
                >
                  {elem?.name}
                </p>
              </div>
            </Button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        ref={imageInputRef}
        accept="image/*"
        className="hidden"
        type="file"
        // onChange={handleImageUpload}
      />
    </>
  );
};

export default ShapesMenu;
