"use client";

import type { Table } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";

import { Button } from "../button";
import { Input } from "../form";
import { DataTableFilter } from "./DataTableFilter";

export type FilterableItems = {
  title: string;
  tableAccessor: string;
  options: {
    label: string;
    value: string;
    icon?: LucideIcon;
  }[];
}[];

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableItems?: FilterableItems;
  searchKey?: string;
}

export function DataTableToolbar<TData>({ table, filterableItems, searchKey }: DataTableToolbarProps<TData>) {
  // TODO: Is there a better way to check if the table is filtered?
  // If you select ALL filters for a column, the table is not filtered and we dont get a reset button
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchKey && (
          <Input
            className="mb-0"
            placeholder="Search"
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
          />
        )}
        {filterableItems &&
          filterableItems?.map((item) => {
            const foundColumn = table.getColumn(item.tableAccessor);
            console.log(foundColumn?.getCanFilter());
            if (foundColumn?.getCanFilter()) {
              return (
                <DataTableFilter
                  column={foundColumn}
                  title={item.title}
                  options={item.options}
                  key={item.title}
                />
              );
            }
          })}
        {isFiltered && (
          <Button
            color="minimal"
            EndIcon={X}
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3">
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}