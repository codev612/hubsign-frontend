import { useMemo, useRef } from "react";

import Color from "./settings/Color";
import Dimensions from "./settings/Dimensions";
import Export from "./settings/Export";
import Text from "./settings/Text";

import { RightSidebarProps } from "@/types/canvas";
import { modifyShape } from "@/lib/canvas/shapes";

const RightSidebar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
  // syncShapeInStorage,
}: RightSidebarProps) => {
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);

  const handleInputChange = (property: string, value: string) => {
    if (!isEditingRef.current) isEditingRef.current = true;

    setElementAttributes((prev) => ({ ...prev, [property]: value }));

    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      property,
      value,
      activeObjectRef,
      // syncShapeInStorage,
    });
  };

  // memoize the content of the right sidebar to avoid re-rendering on every mouse actions
  const memoizedContent = useMemo(
    () => (
      <section className=" h-full right-0 pb-20 flex flex-col select-none overflow-y-auto border-t border-primary-grey-200 bg-primary-black text-primary-grey-300 max-sm:hidden min-w-[227px]">
        <h2 className="border border-primary-grey-200 px-5 py-4 text-xs uppercase">
          Design
        </h2>
        <span className="text-xs text-primary-grey-300 px-5 py-4 border-b border-primary-grey-200">
          Make changes to the canvas size
        </span>

        <Dimensions
          handleInputChange={handleInputChange}
          height={elementAttributes.height}
          isEditingRef={isEditingRef}
          width={elementAttributes.width}
        />
        <Text
          fontFamily={elementAttributes.fontFamily}
          fontSize={elementAttributes.fontSize}
          fontWeight={elementAttributes.fontWeight}
          handleInputChange={handleInputChange}
        />
        <Color
          attribute={elementAttributes.fill}
          attributeType="fill"
          handleInputChange={handleInputChange}
          inputRef={colorInputRef}
          placeholder="color ( fill )"
        />
        <Color
          attribute={elementAttributes.stroke}
          attributeType="stroke"
          handleInputChange={handleInputChange}
          inputRef={strokeInputRef}
          placeholder="stroke"
        />
        <Export />
      </section>
    ),
    [elementAttributes],
  );

  return memoizedContent;
};

export default RightSidebar;
