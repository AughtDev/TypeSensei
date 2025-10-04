import React from 'react';
import SiteHeader, {SitePage} from "@/components/layout/SiteHeader";

interface SiteLayoutProps {
    children: React.ReactNode
}

const SITE_PAGES: SitePage[] = [
    {label: "Let's Go", href: "/"},
    {label: "Settings", href: "/settings"},
]

export default function SiteLayout({children}: SiteLayoutProps) {
    return (
        <>
            <SiteHeader pages={SITE_PAGES}/>
            <div className={"w-full"}>
                {children}
            </div>
        </>
    )
}
