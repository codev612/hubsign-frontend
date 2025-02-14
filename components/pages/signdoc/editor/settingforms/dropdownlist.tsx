import { useEffect, useState } from "react";
import { Listbox, ListboxItem } from "@heroui/react";
import { DropdownboxListProps } from "@/interface/interface";

const DropdownboxList: React.FC<DropdownboxListProps> = ({ showDropdownboxListForm, setShowDropdownboxListForm, recipients, setDropdownboxList, signMode }) => {
  useEffect(() => {
    setSelectRecipient(showDropdownboxListForm.value.recipient);
    setCheckRequired(showDropdownboxListForm.value.required);
  }, [showDropdownboxListForm]);

  const testItems = ['1', '2', '3']

  const [selectRecipient, setSelectRecipient] = useState<string>(showDropdownboxListForm.value.recipient);
  const [checkRequired, setCheckRequired] = useState<boolean>(showDropdownboxListForm.value.required);
  const [items, setItems] = useState<string[]>(showDropdownboxListForm.value.items);
  const [addItem, setAddItem] = useState<string>("");

  return (
    items.length > 0 && <div
        style={{
            left: showDropdownboxListForm.position.left,
            top: showDropdownboxListForm.position.top,
            width: showDropdownboxListForm.width,
        }}
        className="absolute bg-white p-1 rounded-lg shadow-lg flex flex-col w-[300] gap-2 text-text"
    >
        <Listbox 
            aria-label="Actions" 
            onAction={(key) => {
                setDropdownboxList({
                    uid: showDropdownboxListForm.uid,
                    value: {
                        recipient: selectRecipient,
                        items: items,
                        selectedItem: key,
                        required: checkRequired,
                    }

                });
                setShowDropdownboxListForm({...showDropdownboxListForm, show:false});
            }}
            >
            {items.map((item) => <ListboxItem key={item}>{`[${item}]`}</ListboxItem>)}
        </Listbox>
    </div>
  );
};


export default DropdownboxList;
