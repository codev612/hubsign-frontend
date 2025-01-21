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
  useDisclosure,
} from "@heroui/react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";
import { useRouter } from "next/navigation";
import ConfirmModal from "./confirmmodal";
import EditModal from "./editmodal";
import { Contact } from "@/interface/interface"

type Data = Contact

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const PlusIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <path d="M6 12h12" />
        <path d="M12 18V6" />
      </g>
    </svg>
  );
};

export const VerticalDotsIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  );
};

export const SearchIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const ChevronDownIcon = ({
  strokeWidth = 1.5,
  ...otherProps
}: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...otherProps}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const columns = [
  // { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  // { name: "AGE", uid: "age", sortable: true },
  // { name: "ROLE", uid: "role", sortable: true },
  // { name: "TEAM", uid: "team" },
  { name: "EMAIL", uid: "email" },
  // { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

// export const statusOptions = [
//   { name: "Draft", uid: "draft" },
//   { name: "InProgress", uid: "inprogress" },
//   { name: "Completed", uid: "Completed" },
// ];

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "email", "actions"];

export default function DataTable({ initialData }: { initialData: Data[] }) {
  const router = useRouter();
  const [data, setData] = useState<Data[]>(initialData);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [selectedIDs, setSelectedIDs] = useState<string[]>([]);

  useEffect(() => {
    // Convert selectedKeys to an array of _id values

    if (selectedKeys === "all") {
      const selectedIds = data.map((item) => item._id);

      setSelectedIDs(selectedIds);
    } else {
      const selectedIds = Array.from(selectedKeys)
        .map((key) => {
          const item = data.find((d) => d._id === key);

          return item ? item._id : null; // This could still yield null
        })
        .filter(Boolean) as string[]; // Ensure the filter returns only strings

      setSelectedIDs(selectedIds);
    }
  }, [selectedKeys, data]);

  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredData = [...data];

    // if (hasSearchFilter) {
    //   filteredUsers = filteredUsers.filter((user) =>
    //     user.name.toLowerCase().includes(filterValue.toLowerCase()),
    //   );
    // }
    // if (
    //   statusFilter !== "all" &&
    //   Array.from(statusFilter).length !== statusOptions.length
    // ) {
    //   filteredUsers = filteredUsers.filter((user) =>
    //     Array.from(statusFilter).includes(user.status),
    //   );
    // }

    return filteredData;
  }, [data, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Data, b: Data) => {
      const first = a[sortDescriptor.column as keyof Data] as unknown as number;
      const second = b[
        sortDescriptor.column as keyof Data
      ] as unknown as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  //for removing confirm modal
  const { isOpen:isDeleteConfirmOpen, onOpen: onDeleteConfirmOpen, onOpenChange: onDeleteConfirmOpenChange } = useDisclosure();
  const [deleteItem, setDeleteItem] = useState<string[]>([]);
  const [actionState, setActionState] = useState(false);

  const handleConfirmOpen = (id: string) => {
    setDeleteItem([id]);
    onDeleteConfirmOpen();
  };

  const handleBatchDeleteOpen = () => {
    onDeleteConfirmOpen();
  };

  //for removing confirm modal
  const { isOpen:isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const [editItem, setEditItem] = useState({
    id:"",
    name:"",
    email:""
  });
  const [editActionState, setEditActionState] = useState({state: false, data:{
    _id:"",
    email:"",
    name:"",
  }});

  const handleEditOpen = ({id, name, email}:{id:string, name:string, email:string}) => {
    setEditItem({id, name, email});
    onEditOpen();
  };
 
  //showing contacts after remove
  useEffect(() => {
    if ( actionState ) {
      setData(data.filter((item) => !deleteItem.includes(item._id)));
      setActionState(false);
      setDeleteItem([]);
      setSelectedKeys(new Set([]));
    }
  }, [actionState]);

  //showing contacts after add or edit
  useEffect(() => {
    if ( editActionState.state ) {
      console.log(editActionState)
      // setData(data.filter((item) => !deleteItem.includes(item._id)));
      const newData = data.map( item => item._id === editActionState.data._id ? {...item, name: editActionState.data.name} : item );
      setData(newData);
      setEditActionState({
        state: false,
        data: {
          _id:"",
          email:"",
          name:"",
        }
      });
    }
  }, [editActionState]);

  useEffect(() => {
    setDeleteItem(selectedIDs);
  }, [selectedIDs]);

  const renderCell = React.useCallback((data: Data, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof Data];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: data.avatar }}
            description={data.email}
            name={cellValue}
          >
            {data.email}
          </User>
        );
      // case "role":
      //   return (
      //     <div className="flex flex-col">
      //       <p className="text-bold text-small capitalize">{cellValue}</p>
      //       <p className="text-bold text-tiny capitalize text-default-400">
      //         {user.team}
      //       </p>
      //     </div>
      //   );
      // case "status":
      //   return (
      //     <Chip
      //       className="capitalize"
      //       color={statusColorMap[user.status]}
      //       size="sm"
      //       variant="flat"
      //     >
      //       {cellValue}
      //     </Chip>
      //   );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="edit"
                  // onPress={() => router.push(`/dashboard/contacts/${data._id}`)}
                  onPress={()=>handleEditOpen({id: data._id, name: data.name, email: data.email})}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  onPress={() => handleConfirmOpen(data._id)}
                  // onClick={()=>setModalVisible(true)}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  // const onNextPage = React.useCallback(() => {
  //   if (page < pages) {
  //     setPage(page + 1);
  //   }
  // }, [page, pages]);

  // const onPreviousPage = React.useCallback(() => {
  //   if (page > 1) {
  //     setPage(page - 1);
  //   }
  // }, [page]);

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
              onPress={() => {
                handleBatchDeleteOpen();
              }}
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
            Total {data.length} items
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
    data.length,
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
    <>
      <ConfirmModal
        actionState={setActionState}
        id={deleteItem}
        isOpen={isDeleteConfirmOpen}
        message={`This action will delete the ${deleteItem.length} contact[s]. The contact record will be permanently removed, and all associated signing links will be deactivated. Do you wish to proceed?`}
        title="Delete Contact"
        onOpenChange={onDeleteConfirmOpenChange}
      />
      <EditModal
        actionState={setEditActionState}
        item={editItem}
        isOpen={isEditOpen}
        title={`${editItem.id===""?"New":"Edit"} Contact`}
        onOpenChange={onEditOpenChange}
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
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
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
        <TableBody emptyContent={"No items found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
