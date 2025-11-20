"use client"
import React from 'react';
import {usePathname} from "next/navigation";

export interface SitePage {
    label: string;
    href: string;
}

interface SiteHeaderProps {
    pages: SitePage[]
}

export default function SiteHeader({pages} : SiteHeaderProps) {
    const curr_href = usePathname()

    return (
        <div className={"flex flex-row w-full items-center justify-between p-4"}>
            <h1 className={"text-3xl font-semibold"}>
                Type Tetris
            </h1>
            <div className={"flex flex-row items-center gap-5"}>
                {pages.map((page) => (
                    <a
                        key={page.href} href={page.href}
                        style={{
                            letterSpacing: "1px",
                            textUnderlineOffset: "4px"
                        }}
                        className={`text-md hover:underline ${
                            curr_href === page.href ? "underline" : ""
                        }`}>
                        {page.label.toUpperCase()}
                    </a>
                ))}
            </div>
        </div>
    )
}
