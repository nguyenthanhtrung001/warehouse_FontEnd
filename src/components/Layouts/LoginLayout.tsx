"use client";

import React, { useState, ReactNode } from "react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <>
     
      <div className="flex w-full justify-center">
        <main className="w-[100%]">
          <div className="">
            {children}
          </div>
        </main>
      </div>

        
    </>
  );
}
