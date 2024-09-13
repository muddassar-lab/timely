"use client";

import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { BarChart, HelpCircle, Home, Menu, Settings, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: BarChart, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help", href: "/help" },
];

export default function Sidebar() {
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed right-4 top-4 z-50 md:hidden"
          onClick={toggleSidebar}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col justify-between border-r bg-background p-4 shadow-sm transition-all duration-300 ease-in-out",
          isMobile && !isOpen && "-translate-x-full",
          isMobile && isOpen && "translate-x-0",
          !isMobile && "md:w-72",
        )}
      >
        <div className="flex flex-col space-y-6">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
              <line x1="21.17" x2="12" y1="8" y2="8" />
              <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
              <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
            </svg>
            <span className="text-2xl font-bold text-primary">CODEBRISK</span>
          </Link>
          <nav className="flex flex-col space-y-1">
            {navItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-secondary"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-2 rounded-lg bg-secondary px-2 py-4">
          <SignedIn>
            <Link href={"/user-profile"}>
              <Avatar>
                <AvatarImage src={user?.imageUrl} alt="User avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Link>
          </SignedIn>
          <SignedIn>
            <div>
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
          </SignedIn>
          <SignedOut>
            <Button className="w-full"><SignInButton /></Button>
          </SignedOut>
        </div>
      </aside>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
