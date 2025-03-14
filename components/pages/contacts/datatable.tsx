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
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useRouter } from "next/navigation";

import ConfirmModal from "./deleteconfirm";
import EditModal from "./editmodal";

import { Contact } from "@/interface/interface";
import { formatDateTime } from "@/utils/canvas/utils";
import { HorizontalDotsIcon, SearchIcon } from "@/constants/table";
import { useModal } from "@/context/modal";
import EmptyItems from "../dashboards/emptyitems";
import { ContactUserIcon, ZoomIcon } from "@/components/icons";

type Data = Contact;

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const columns = [
  { name: "Name", uid: "name", sortable: true },
  { name: "Email", uid: "email" },
  { name: "Date Added", uid: "createdAt", sortable: true },
  { name: "", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = ["name", "email", "createdAt", "actions"];

export default function DataTable({ initialData }: { initialData: Data[] }) {
  const router = useRouter();

  const modalContext = useModal();

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
    column: "name",
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

    if (hasSearchFilter) {
      filteredData = filteredData.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

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
  const {
    isOpen: isDeleteConfirmOpen,
    onOpen: onDeleteConfirmOpen,
    onOpenChange: onDeleteConfirmOpenChange,
  } = useDisclosure();
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
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();
  const [editItem, setEditItem] = useState({
    id: "",
    name: "",
    email: "",
  });
  const [editActionState, setEditActionState] = useState({
    state: false,
    data: {
      _id: "",
      email: "",
      name: "",
    },
  });

  const handleEditOpen = ({
    id,
    name,
    email,
  }: {
    id: string;
    name: string;
    email: string;
  }) => {
    setEditItem({ id, name, email });
    onEditOpen();
  };

  //showing contacts after remove
  useEffect(() => {
    if (actionState) {
      setData(data.filter((item) => !deleteItem.includes(item._id)));
      setActionState(false);
      setDeleteItem([]);
      setSelectedKeys(new Set([]));
    }
  }, [actionState]);

  //showing contacts after add or edit
  useEffect(() => {
    if (editActionState.state) {
      setData((prevData) => {
        const existingIndex = prevData.findIndex((item) => item._id === editActionState.data._id);
  
        if (existingIndex !== -1) {
          // ✅ Edit existing item
          return prevData.map((item) =>
            item._id === editActionState.data._id
              ? { ...item, name: editActionState.data.name }
              : item
          );
        } else {
          // ✅ Add new item (ensure it matches `Contact` type)
          return [
            ...prevData,
            {
              ...editActionState.data,
              createdAt: new Date().toISOString(), // Default timestamps
              updatedAt: new Date().toISOString(),
            },
          ];
        }
      });
  
      // ✅ Reset `editActionState`
      setEditActionState({
        state: false,
        data: {
          _id: "",
          email: "",
          name: "",
        },
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
        return <p className="text-text text-medium">{data.name}</p>
      case "email":
        return <p className="text-text text-medium">{data.email}</p>
      case "createdAt":
        return(
          <div className="flex flex-col">
            <p className="text-text text-medium">{formatDateTime(data.createdAt).formattedDate}</p>
            <p className="text-placeholder">{formatDateTime(data.createdAt).formattedTime}</p>
          </div>
        )
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <HorizontalDotsIcon className="text-default-300"/>
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="edit"
                  // onPress={() => router.push(`/dashboard/contacts/${data._id}`)}
                  onPress={() =>
                    handleEditOpen({
                      id: data._id,
                      name: data.name,
                      email: data.email,
                    })
                  }
                  startContent={<EditOutlinedIcon />}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  onPress={() => handleConfirmOpen(data._id)}
                  // onClick={()=>setModalVisible(true)}
                  color="danger"
                  startContent={<DeleteForeverOutlinedIcon />} 
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
        <Pagination
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
        isOpen={isEditOpen}
        item={editItem}
        title={`${editItem.id === "" ? "New" : "Edit"} Contact`}
        onOpenChange={onEditOpenChange}
      />
      <EditModal
        actionState={setEditActionState}
        isOpen={modalContext.isCreateContactOpen}
        item={editItem}
        title={`${editItem.id === "" ? "New" : "Edit"} Contact`}
        onOpenChange={modalContext.onCreateContactOpenChange}
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
        onSortChange={setSortDescriptor}
        hideHeader={initialData.length > 0 ? false : true}
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
        <TableBody 
        emptyContent={
          filterValue==="" ? <EmptyItems 
          icon={<ContactUserIcon />} 
          title="Start here - add your first contact" 
          description="Create your first document" 
          button={<Button color="primary" className="text-forecolor" startContent={<AddOutlinedIcon />} onPress={()=>modalContext.openCreateContact()}>New Contact</Button>} 
          />:
          <EmptyItems 
          icon={<ZoomIcon />} 
          title="No contacts found" 
          description="Try editing your search term or filters" 
          button={<Button color="primary" className="text-forecolor" onPress={()=>onClear()}>Rest filters</Button>} 
          />
        }
        items={sortedItems}>
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
