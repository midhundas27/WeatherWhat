/** @format */
"use client";

import { cn } from "@/utils/cn";
import React from "react";
import { IoSearch } from "react-icons/io5";

type Props = {
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};

const SearchBox = (props: Props) => {
  return (
    <form
      onSubmit={props.onSubmit}
      className={cn(
        "flex relative items-center justify-center h-10",
        props.className
      )}
    >
      <input
        type="text"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search location.."
        className="px-4 py-2 w-[230px] border border-gray-300 rounded-l-md focus:outline-none  focus:border-green-400 h-full"
      />
      <button type="submit" className="px-4 py-[9px] bg-green-400 text-white rounded-r-md focus:outline-none hover:bg-green-500  h-full">
        <IoSearch />
      </button>
    </form>
  );
};

export default SearchBox;
