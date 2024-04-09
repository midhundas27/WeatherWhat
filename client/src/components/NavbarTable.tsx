/** @format */
"use client";

import React from "react";
import { MdWbSunny } from "react-icons/md";

type Props = { location?: string };

export default function NavbarTable({ location }: Props) {
  
  return (
    <>
      <nav className="shadow-sm  sticky top-0 left-0 z-50 bg-white">
        <div className="h-[80px]     w-full    flex   justify-between items-center  max-w-7x px-3 mx-auto">
          <p className="flex items-center justify-center gap-2 mx-auto">
            <h2 className="text-gray-500 text-3xl ">Weather Today</h2>
            <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
          </p>
        </div>
      </nav>
    </>
  );
}
