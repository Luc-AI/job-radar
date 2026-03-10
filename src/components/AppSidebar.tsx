"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  User,
  Bell,
  LogOut,
  MoreVertical,
  ChevronRight,
} from "react-feather";
import { logout } from "@/app/(auth)/actions";
import { useDashboardNav } from "@/contexts/DashboardNavContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

const jobsSubItems = [
  { title: "Saved", anchor: "saved", filterHref: "/dashboard?status=saved" },
  { title: "Last 24h", anchor: "last-24h" },
  { title: "Last 7 Days", anchor: "last-7d" },
  { title: "Last 30 Days", anchor: "last-30d" },
  { title: "Older", anchor: "older" },
];

const profileSubItems = [
  { title: "Rolle & Standort", anchor: "rolle-standort" },
  { title: "Branche & Unternehmen", anchor: "branche-unternehmen" },
  { title: "Erweitert", anchor: "erweitert" },
];

function NavMain() {
  const pathname = usePathname();
  const { sections } = useDashboardNav();
  const isJobsActive = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isProfileActive = pathname === "/profile" || pathname.startsWith("/profile/");

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {/* Jobs with collapsible sub-items */}
          <Collapsible asChild defaultOpen={isJobsActive} className="group/collapsible">
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Jobs" isActive={isJobsActive}>
                <Link href="/dashboard">
                  <Briefcase />
                  <span>Jobs</span>
                </Link>
              </SidebarMenuButton>
              <CollapsibleTrigger asChild>
                <SidebarMenuAction showOnHover={false}>
                  <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuAction>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {jobsSubItems.map((item) => {
                    const hasContent =
                      item.filterHref ||
                      sections === null ||
                      sections[item.anchor as keyof typeof sections];
                    return (
                      <SidebarMenuSubItem key={item.anchor}>
                        <SidebarMenuSubButton
                          asChild
                          className={!hasContent ? "opacity-40 pointer-events-none" : undefined}
                        >
                          <a
                            href={item.filterHref ?? `/dashboard#${item.anchor}`}
                            onClick={(e) => {
                              if (!item.filterHref && pathname === "/dashboard") {
                                e.preventDefault();
                                document
                                  .getElementById(item.anchor)
                                  ?.scrollIntoView({ behavior: "smooth" });
                              }
                            }}
                          >
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          {/* Profile with collapsible sub-items */}
          <Collapsible asChild defaultOpen={isProfileActive} className="group/collapsible">
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Profile" isActive={isProfileActive}>
                <Link href="/profile">
                  <User />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
              <CollapsibleTrigger asChild>
                <SidebarMenuAction showOnHover={false}>
                  <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuAction>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {profileSubItems.map((item) => (
                    <SidebarMenuSubItem key={item.anchor}>
                      <SidebarMenuSubButton asChild>
                        <a
                          href={`/profile#${item.anchor}`}
                          onClick={(e) => {
                            if (pathname === "/profile") {
                              e.preventDefault();
                              document
                                .getElementById(item.anchor)
                                ?.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                        >
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          {/* Benachrichtigungen */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Benachrichtigungen"
              isActive={pathname === "/settings" || pathname.startsWith("/settings/")}
            >
              <Link href="/settings">
                <Bell />
                <span>Benachrichtigungen</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Account */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Account"
              isActive={pathname === "/account" || pathname.startsWith("/account/")}
            >
              <Link href="/account">
                <User />
                <span>Account</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function NavUser() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Account</span>
              </div>
              <MoreVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <form action={logout}>
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <span className="font-semibold tracking-tight text-foreground text-lg">
                  Jobfishing
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
