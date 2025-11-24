"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Inbox,
  Calendar,
  Zap,
  Menu,
  X,
  FileText,
  CheckCircle2,
  Clock,
  Users2,
  MapPin,
  DollarSign,
  BookOpen,
} from "lucide-react"

interface NavSection {
  title: string
  items: Array<{
    href: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    badge?: number
  }>
}

const navSections: NavSection[] = [
  {
    title: "INVOICE PROCESSING",
    items: [
      { href: "/", label: "Invoices", icon: Inbox, badge: 12 },
      { href: "/upload", label: "Documents", icon: FileText },
    ],
  },
  {
    title: "SYSTEM & AUDIT",
    items: [
      { href: "/ap-queue", label: "Approvals", icon: CheckCircle2 },
      { href: "/benchmarks", label: "Audit Logs", icon: Clock },
    ],
  },
  {
    title: "CORE ENTITIES",
    items: [
      { href: "/", label: "Dashboard", icon: Zap },
      { href: "/vendor-performance", label: "Parties", icon: Users2, badge: 2 },
      { href: "/facility-view", label: "Locations", icon: MapPin },
    ],
  },
  {
    title: "CONTRACT ENGINE",
    items: [
      { href: "/contracts-management", label: "Contracts", icon: Calendar, badge: 142 },
      { href: "/savings-recovery", label: "Pricing Models", icon: DollarSign },
      { href: "/benchmarks", label: "Service Catalog", icon: BookOpen },
    ],
  },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        <div className="flex h-16 items-center border-b border-border px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-foreground">SpendRule</span>
          </div>
        </div>

        <nav className="space-y-8 px-4 py-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="px-3 text-xs font-semibold text-muted-foreground/70 tracking-widest uppercase">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary/8 text-primary"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="ml-auto flex-shrink-0 rounded-full bg-primary/12 px-2 py-1 text-xs font-semibold text-primary/80">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center border-b border-border bg-card px-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-4 rounded-lg p-2 hover:bg-muted lg:hidden">
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground">SpendRule Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
              AP
            </div>
          </div>
        </header>

        {/* Overlay when sidebar is open */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background">{children}</main>
      </div>
    </div>
  )
}
