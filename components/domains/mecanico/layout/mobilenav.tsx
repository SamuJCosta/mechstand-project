"use client"

import Link from "next/link"
import { PanelLeft, CarFront, Wrench, Users, ClipboardList, Settings } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "../../../sheet"
import { Button } from "../../shared/ui/button"
import Image from "next/image"

export const MobileNav = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button size="icon" variant="outline" className="sm:hidden">
        <PanelLeft className="h-5 w-5" />
        <span className="sr-only">Menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="sm:max-w-xs">
      <nav className="grid gap-6 text-lg font-medium">
        {/* Logo / Dashboard */}
        <Link
          href="/admin"
          className="flex items-center gap-4 px-2.5 text-foreground"
        >
          <Image src="/Logo.png" alt="MechStand Logo" width={20} height={20} />
          Dashboard
        </Link>

        {/* Stand */}
        <Link href="/admin/sidebar/stand" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
          <CarFront className="h-5 w-5" /> Stand
        </Link>

        {/* Mecânicos */}
        <Link href="/admin/sidebar/mecanicos" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
          <Wrench className="h-5 w-5" /> Mecânicos
        </Link>

        {/* Usuários */}
        <Link href="/admin/sidebar/users" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
          <Users className="h-5 w-5" /> Usuários
        </Link>

        {/* Stock */}
        <Link href="/admin/sidebar/stock" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
          <ClipboardList className="h-5 w-5" /> Stock
        </Link>

        {/* Settings */}
        <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
          <Settings className="h-5 w-5" /> Settings
        </Link>
      </nav>
    </SheetContent>
  </Sheet>
)
