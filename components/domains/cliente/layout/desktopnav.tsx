"use client"

import Image from "next/image"
import Link from "next/link"
import { ClipboardList, Wrench, Users, CarFront, Settings, House, CalendarDays } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../tooltip"
import { NavItem } from "@/components/domains/cliente/layout/nav-item"

export const DesktopNav = () => (
  <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
    <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
      <NavItem href="/cliente" label="Home">
        <House className="h-5 w-5" />
      </NavItem>
      <NavItem href="/cliente/sidebar/stand" label="Stand">
        <CarFront className="h-5 w-5" />
      </NavItem>
      <NavItem href="/cliente/sidebar/veiculos" label="Veiculos">
        <Wrench className="h-5 w-5" />
      </NavItem>
      <NavItem href="/cliente/sidebar/agendar" label="Agendar">
        <CalendarDays className="h-5 w-5" />
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
