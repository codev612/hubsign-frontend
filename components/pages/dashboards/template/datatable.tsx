"use client";

import React, { SVGProps, useEffect, useState } from "react";
import { useDisclosure } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Chip,
} from "@heroui/react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { PlusIcon, VerticalDotsIcon, SearchIcon, ChevronDownIcon, HorizontalDotsIcon } from "@/constants/table";
import Cookies from "js-cookie";
import Dot from "@/components/ui/dot";
import Avatar from "@/components/ui/avatar";
import { formatDateTime, generateColorForRecipient } from "@/utils/canvas/utils";
import { Recipient } from "@/interface/interface";
import { DOC_STATUS } from "@/constants/document";
import ConfirmModal from "../deleteconfirm";
import SaveTempModal from "../documents/savetemplate";
import { useRouter } from "next/navigation";
import ManyConfirmModal from "../deletemanyconfirm";
import EmptyItems from "../emptyitems";
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import { RenameIcon, TemplateIcon, ZoomIcon } from "@/components/icons";
import RenameModal from "./rename";
import Link from "next/link";
import { useModal } from "@/context/modal";
import CreateTempModal from "./createtemplate";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const columns = [
  { name: "Name", uid: "name", sortable: true },
  { name: "Recipients", uid: "recipients" },
  { name: "Date Created", uid: "createdAt" },
  { name: "", uid: "actions"}
];

export const statusOptions = [
  { name: "Draft", uid: "Draft" },
  { name: "In Progress", uid: "In progress" },
  { name: "Completed", uid: "Completed" },
  { name: "Declined", uid: "Declined" },
];

const INITIAL_VISIBLE_COLUMNS = ["name", "recipients", "createdAt", "actions"];

export default function DataTable() {
  const router = useRouter();

  const modalContext = useModal();

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [page, setPage] = React.useState(1);

  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [deleteManyConfirm, setDeleteManyConfirm] = useState<boolean>(false);

  // for using when deleting, saving as template, and etc
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [docData, setDocData] = useState<DocData[]>([]);
  const [fileredDoc, setFilteredDoc] = useState<DocData[]>([]);
  const [selectedItemData, setSelectedItemData] = useState<DocData>({
    uid: "",
    owner: "",
    name: "",
    filename: "",
    recipients: [],
    sendDate: "",
    status: "",
    sentAt: "",
    activity: [],
    signingOrder: false,
    createdAt: "",
    updatedAt: "",
  });
  //for copy and paste single or multiple templates
  const [copyItems, setCopyItems] = useState<string[]>([]);
  const [selectedIDs, setSelectedIDs] = useState<string[]>([]);

  //for renaming template name
  const [newName, setNewName] = useState<string>("");

  interface Activity {
    username: string;
    action: string;
    at: string;
  }

  interface DocData {
    uid: string;
    owner: string
    name: string;
    filename: string;
    recipients: Recipient[];
    sendDate: string;
    status: string;
    sentAt: string;
    activity: Activity[];
    signingOrder: boolean;
    createdAt: string;
    updatedAt: string;
  }

  const {
    isOpen: isDeleteConfirmOpen,
    onClose: closeDeleteConfirm,
    onOpen: onDeleteConfirmOpen,
    onOpenChange: onDeleteConfirmOpenChange,
  } = useDisclosure();// for delete confirm modal

  const {
    isOpen: isDeleteManyConfirmOpen,
    onClose: closeDeleteManyConfirm,
    onOpen: onDeleteManyConfirmOpen,
    onOpenChange: onDeleteManyConfirmOpenChange,
  } = useDisclosure();// for delete confirm modal

  const {
    isOpen: isSaveTempOpen,
    onClose: onSaveTempClose,
    onOpen: onSaveTempOpen,
    onOpenChange: onSaveTempChange,
  } = useDisclosure();// for save as template modal

  const {
    isOpen: isRenameOpen,
    onClose: onCloseRename,
    onOpen: onRenameOpen,
    onOpenChange: onRenameOpenChange,
  } = useDisclosure();// for delete confirm modal

  const users = docData;

  //fetch templates from database initially
  useEffect(() => {
    const fetchData = async() => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/template`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("session") || ""}`,
          },
        });

        if(!response.ok) {
          return;
        }

        const json = await response.json();
        setDocData(json);

      } catch (error) {
        console.log(error);
        return;
      }
    };

    fetchData();
  }, []);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredItems = [...docData];

    if (hasSearchFilter) {
      filteredItems = filteredItems.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredItems = filteredItems.filter((item) =>
        Array.from(statusFilter).includes(item.status),
      );
    }

    return filteredItems;
  }, [docData, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const handlePasteItems = async () => {
    console.log(copyItems);
    if(copyItems.length > 0) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/template/copy`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("session") || ""}`,
          },
          body: JSON.stringify(copyItems),
        });

        if(!response.ok) {
          return;
        }

        const json = await response.json();
        console.log(json);

         // Append new pasted items to existing docData
        setDocData((prevDocData) => [...prevDocData, ...json]);

      } catch (error) {
        console.log(error);
        return;
      }
    }
  }

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex bg-forecolor border-1">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  All Statuses
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* <Dropdown>
              <DropdownTrigger className="hidden sm:flex border-1 bg-forecolor">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
            <Button
              startContent={<ContentCopyOutlinedIcon />}
              variant="bordered"
              onPress={()=>setCopyItems(selectedIDs)}
            >
              Copy
            </Button>
            <Button
              startContent={<ContentPasteOutlinedIcon />}
              variant="bordered"
              onPress={()=>handlePasteItems()}
            >
              Paste
            </Button>
            <Button
              startContent={<DeleteForeverOutlinedIcon />}
              variant="bordered"
              // onPress={()=>handleMayDelete()}
              onPress={()=>onDeleteManyConfirmOpen()}
            >
              Delete
            </Button>
          </div>
          <Input
            isClearable
            className="w-full sm:max-w-[24%] border-1 rounded-md"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {users.length} items
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    users.length,
    hasSearchFilter,
    copyItems,
    selectedIDs,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        {/* <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span> */}
        <Pagination
          // isCompact
          classNames={{
            cursor: "bg-link text-background",
          }}
          page={page}
          total={pages}
          onChange={setPage}
          showControls
          // showShadow
          color="primary"
        />
        {/* <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div> */}
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: [
        "min-h-[100px]",
        "max-w-full",
        "bg-forecolor",
        "p-0",
        "flex-grow",
      ],
      th: ["bg-transparent", "text-default-500", "border-b"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]/tr:first:before:rounded-none",
        "group-data-[first=true]/tr:last:before:rounded-none",
        // middle
        "group-data-[middle=true]/tr:before:rounded-none",
        // last
        "group-data-[last=true]/tr:first:before:rounded-none",
        "group-data-[last=true]/tr:last:before:rounded-none",
        "border-b",
      ],
    }),
    [],
  );

  // delete one document
  const handleDelete = async () => {
    try {
      if(deleteConfirm && selectedItem) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/template/${selectedItem}`, {
          method:"DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("session") || ""}`,
          },
        });

        setDeleteConfirm(false);
  
        if(!response.ok) {
          return;
        };

        let newDocData = docData;
        newDocData = docData.filter( item => item.uid !== selectedItem);
        setDocData(newDocData);
        setSelectedItem("");

        closeDeleteConfirm();
      }
    } catch (error) {
      console.log(error);
      setDeleteConfirm(false);
      setSelectedItem("");
      return;
    }
  };

  const handleManyDelete = async () => {
    console.log('many delete')
    if(selectedIDs.length > 0) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/template/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("session") || ""}`,
          },
          body: JSON.stringify(selectedIDs),
        });

        setDeleteManyConfirm(false);

        if(!response.ok) {
          return;
        }

        const json = await response.json();
        console.log(json);
        // Update state: Remove deleted items from docData
        setDocData((prevDocData) => prevDocData.filter((item) => !selectedIDs.includes(item.uid)));
        // clear selection after deletion
        setSelectedIDs([]);
        closeDeleteManyConfirm();

      } catch (error) {
        console.log(error);
        return;
      }
    }
  }

  const handleSelectItem = (id:string) => {
    setSelectedItem(id);
    setSelectedItemData(docData.filter(item=>item.uid === id)[0]);
  }

  const handleSaveTemp = async (recipients: Recipient[], name:string, signingOrder: boolean = false) => {
    if(recipients.length > 0) {
      console.log(signingOrder)
      // const filtered = recipients.filter( item => item.name !== "");
      const filtered = recipients.filter(item => item.name !== "");
      console.log(filtered)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/template/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("session") || ""}`,
          },
          body: JSON.stringify({
            name,
            recipients: filtered,
            filename: selectedItemData.filename,
            signingOrder: signingOrder,
          }),
        });

        if(!response.ok) {
          return;
        };
        onSaveTempClose();
        const json = await response.json();
        console.log(json);
      } catch (error) {
        console.log(error);
        return;
      }
    }
  }

  useEffect(() => {
    if(deleteConfirm) {
      handleDelete();
    }
  },[deleteConfirm])

  useEffect(() => {
    console.log(deleteManyConfirm)
    if(deleteManyConfirm) {
      handleManyDelete();
    }
  },[deleteManyConfirm])

  //display category
  useEffect(() => {
    if (selectedKeys === "all") {
      const selectedIds = docData.map((item) => item.uid);
      setSelectedIDs(selectedIds);
    } else {
      const selectedIds = Array.from(selectedKeys)
        .map((key) => {
          const item = docData.find((d) => d.uid === key);

          return item ? item.uid : null; // This could still yield null
        })
        .filter(Boolean) as string[]; // Ensure the filter returns only strings

      setSelectedIDs(selectedIds);
    }
  }, [selectedKeys, docData])

  //handle rename template
  const handleRename = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/template/rename`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("session") || ""}`,
            },
            body: JSON.stringify({
                uid: selectedItem,
                name: newName
            })
        })

        if(!response.ok) {
            return;
        }

        setDocData((prevDocData) =>
            prevDocData.map((item) =>
                item.uid === selectedItem ? { ...item, name: newName } : item
            )
        );

        setNewName("");
        onCloseRename();
    } catch (error) {
        console.log(error);
        return;
    }
  }

  useEffect(() => {
    if(newName && selectedItemData.name !== newName) {
        handleRename();
    }
  }, [newName])

  const handleCreateTemplate = async (recipients: Recipient[], name: string, signingOrder:boolean=false) => {
    
    if(name !== "" && recipients.length > 0) {
      console.log(recipients, name, signingOrder)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/template/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("session") || ""}`,
          },
          body: JSON.stringify({
            name,
            recipients,
            signingOrder
          })
        })

        if(!response.ok) {
          return;
        }

        const newTemplate = await response.json();
        setDocData((prevDocData) => [...prevDocData, newTemplate]);
        
        modalContext.closeCreateTemplate();
        
      } catch (error) {
        console.log(error);
        return;
      }
    }
  }

  return (
    <>
      <ConfirmModal 
      isOpen={isDeleteConfirmOpen}
      onOpenChange={onDeleteConfirmOpenChange}
      action={setDeleteConfirm}
      title="Template"
      description={`This action will delete the template “${selectedItemData.name}”. The template record will be permanently removed. Do you wish to proceed?`}
      />
      <ManyConfirmModal 
      isOpen={isDeleteManyConfirmOpen}
      onOpenChange={onDeleteManyConfirmOpenChange}
      action={setDeleteManyConfirm}
      title="Templates"
      description={`This action will delete ${selectedIDs.length} templates. The template record will be permanently removed. Do you wish to proceed?`}
      />
      <SaveTempModal 
      isOpen={isSaveTempOpen}
      onOpenChange={onSaveTempChange}
      action={handleSaveTemp}
      selectedItemData={selectedItemData}
      />
      <RenameModal
      isOpen={isRenameOpen}
      onOpenChange={onRenameOpenChange}
      action={setNewName}
      title="Rename Template"
      description=""
      currentName={selectedItemData.name}
      />
      <CreateTempModal
      isOpen={modalContext.isCreateTemplateOpen}
      onOpenChange={modalContext.onCreateTemplateOpenChange}
      action={handleCreateTemplate}

      />
      <Table
        // isHeaderSticky
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper: "after:bg-link after:text-background text-white",
          },
        }}
        classNames={classNames}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        shadow="none"
        // sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        hideHeader={docData.length > 0 ? false : true}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
              className="text-text"
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody 
        emptyContent={
        filterValue==="" ? <EmptyItems 
          icon={<TemplateIcon />} 
          title="Start here - sign your first template" 
          description="Create your first template" 
          button={<Button color="primary" className="text-forecolor" startContent={<AddOutlinedIcon />} onPress={()=>modalContext.onCreateTemplateOpenChange()}>New Template</Button>} 
          />:
          <EmptyItems 
          icon={<ZoomIcon />} 
          title="No templates found" 
          description="Try editing your search term or filters" 
          button={<Button color="primary" className="text-forecolor" onPress={()=>onClear()}>Rest filters</Button>} 
          />
        }
        items={items}
        >
          {(item) => (
            <TableRow key={item.uid}>
              <TableCell>
                <div className="flex flex-col">
                  <p className="text-text text-medium">{item.name}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row">
                  {item.recipients.length > 0 && item.recipients.map((r,i) => 
                  <Avatar 
                  key={i} 
                  color={`${generateColorForRecipient(r.email)}`} 
                  name={r.name} 
                  size={28} 
                  signed={item.status===DOC_STATUS.completed ? true : false} 
                  />)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <p className="text-text text-medium">{formatDateTime(item.createdAt).formattedDate}</p>
                  <p className="text-placeholder">{formatDateTime(item.createdAt).formattedTime}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="relative flex justify-end items-center text-text gap-2">
                  <Dropdown>
                    <DropdownTrigger>
                      <button  
                      className="border-1 rounded-md"
                      onClick={()=>handleSelectItem(item.uid)}>
                        {/* <VerticalDotsIcon className="text-default-300" /> */}
                        <HorizontalDotsIcon className="text-default-300"/>
                      </button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem 
                        key="copy" 
                        startContent={<ContentCopyOutlinedIcon />}
                        onPress={()=>setCopyItems([item.uid])}
                        >
                            Copy
                      </DropdownItem>
                      <DropdownItem 
                        key="rename" 
                        startContent={<RenameIcon />} 
                        onPress={()=>{
                            onRenameOpen();
                        }}
                        >
                            Rename
                      </DropdownItem>
                      <DropdownItem 
                        key="delete" 
                        startContent={<DeleteForeverOutlinedIcon />} 
                        onPress={()=>{
                            onDeleteConfirmOpen();
                        }}
                        color="danger"
                        >
                            Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
