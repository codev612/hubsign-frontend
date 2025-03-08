"use client";

import React, { SVGProps, useEffect, useState } from "react";
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
import { PlusIcon, VerticalDotsIcon, SearchIcon, ChevronDownIcon, HorizontalDotsIcon } from "@/constants/table";


// import { users } from "@/constants/common";
import Cookies from "js-cookie";
import Dot from "@/components/ui/dot";
import Avatar from "@/components/ui/avatar";
import { formatDateTime, generateColorForRecipient } from "@/utils/canvas/utils";
import { Recipient } from "@/interface/interface";
import { DOC_STATUS } from "@/constants/document";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const columns = [
  { name: "Name", uid: "name", sortable: true },
  { name: "Status", uid: "status"},
  { name: "Recipients", uid: "recipients" },
  { name: "Send Date", uid: "sendDate"},
  { name: "Last Action", uid: "lastaction" },
  { name: "", uid: "actions"}
];

export const statusOptions = [
  { name: "Draft", uid: "draft" },
  { name: "In Progress", uid: "inprogress" },
  { name: "Completed", uid: "completed" },
];

const INITIAL_VISIBLE_COLUMNS = ["name", "status", "recipients", "sendDate", "lastaction", "actions"];

const statusColorMap = (status: string) => {
  switch (status) {
    case DOC_STATUS.inprogress:
      return "#1A92F9";
    case DOC_STATUS.draft:
      return "#525252"; // Changed from "info" to "warning" (since "info" is not in the allowed list)
    case DOC_STATUS.completed:
      return "#23A15D";
    case DOC_STATUS.declined:
      return "#DA1E27";
    default:
      return "#1A92F9"; // Ensure a valid fallback
  }
};

export default function DataTable() {
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

  interface Activity {
    name: string;
    action: string;
  }

  interface DocData {
    uid: string;
    name: string;
    recipients: Recipient[];
    sendDate: string;
    status: string;
    sentAt: string;
    activity: Activity[];
  }

  const [docData, setDocData] = useState<DocData[]>([]);

  type User = (typeof docData)[0];
  const users = docData;

  useEffect(() => {
    const fetchData = async() => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/document/pending`, {
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
        console.log(json);

      } catch (error) {
        console.log(error);
        return;
      }
    };

    fetchData();
  }, [])

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter]);

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

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex gap-3">
            {/* <Dropdown>
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
            </Dropdown> */}
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
            >
              Copy
            </Button>
            <Button
              startContent={<ContentPasteOutlinedIcon />}
              variant="bordered"
            >
              Paste
            </Button>
            <Button
              startContent={<DeleteForeverOutlinedIcon />}
              variant="bordered"
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

  return (
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
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No items found"} items={docData}>
        {(item) => (
          <TableRow key={item.uid}>
            <TableCell>{item.name}</TableCell>
            <TableCell>
              <div className="flex flex-row gap-1">
                <Dot color={`${statusColorMap(item.status)}`} size="7px" />
                <span style={{color:`${statusColorMap(item.status)}`}}>{item.status}</span>
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
                signed={true} 
                />)}
              </div>
            </TableCell>
            <TableCell>
              <p className="text-text text-medium">{formatDateTime(item.sentAt).formattedDate}</p>
              <p className="text-placeholder">{formatDateTime(item.sentAt).formattedTime}</p>
            </TableCell>
            <TableCell>
              {item.activity.length > 0 && `${item.activity[0].action!} by ${item.activity[0].name!}`}
            </TableCell>
            <TableCell>
              <div className="relative flex justify-end items-center text-text gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      {/* <VerticalDotsIcon className="text-default-300" /> */}
                      <HorizontalDotsIcon className="text-default-300"/>
                    </Button>
                  </DropdownTrigger>
                  {item.status===DOC_STATUS.draft && <DropdownMenu>
                    <DropdownItem key="edit">Edit</DropdownItem>
                    <DropdownItem key="copy">Copy</DropdownItem>
                    <DropdownItem key="save">Save as Template</DropdownItem>
                    <DropdownItem key="delete">Delete</DropdownItem>
                  </DropdownMenu>}
                  {item.status!==DOC_STATUS.draft && <DropdownMenu>
                    <DropdownItem key="reminder">Send Reminder</DropdownItem>
                    <DropdownItem key="history">Actions history</DropdownItem>
                    <DropdownItem key="copy">Copy</DropdownItem>
                    <DropdownItem key="save">Save as Template</DropdownItem>
                    <DropdownItem key="delete">Delete</DropdownItem>
                  </DropdownMenu>}
                </Dropdown>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
