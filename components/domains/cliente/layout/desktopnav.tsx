"use client"

import Image from "next/image"
import Link from "next/link"
import { ClipboardList, Wrench, Users, CarFront, Settings } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../tooltip"
import { NavItem } from "@/components/domains/cliente/layout/nav-item"

export const DesktopNav = () => (
  <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
    <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
      <NavItem href="/cliente" label="Dashboard">
        <Image src="/Logo.png" alt="MechStand Logo" width={100} height={100} className="h-4 w-4" />
      </NavItem>
      <NavItem href="/cliente/sidebar/stand" label="Stand">
        <CarFront className="h-5 w-5" />
      </NavItem>
      <NavItem href="/cliente/sidebar/mecanicos" label="Mecânicos">
        <Wrench className="h-5 w-5" />
      </NavItem>
      <NavItem href="/cliente/sidebar/users" label="Usuários">
        <Users className="h-5 w-5" />
      </NavItem>
      <NavItem href="/cliente/sidebar/stock" label="Stock">
        <ClipboardList className="h-5 w-5" />
      </NavItem>
    </nav>
    <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="#"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">Settings</TooltipContent>
      </Tooltip>
    </nav>
  </aside>
)
