import { For } from "solid-js"
import { Link } from "@tanstack/solid-router" 
 
import { IconCalendar, IconHome, IconMail, IconSearch, IconSettings } from "~/components/icons"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/components/ui/sidebar"
 
const items = [
  {
    title: "Home",
    url: "#",
    icon: IconHome
  },
  {
    title: "Inbox",
    url: "#",
    icon: IconMail
  },
  {
    title: "Calendar",
    url: "#",
    icon: IconCalendar
  },
  {
    title: "Search",
    url: "#",
    icon: IconSearch
  },
  {
    title: "Settings",
    url: "#",
    icon: IconSettings
  }
]
 
export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <For each={items}>
                {(item) => (
                  <SidebarMenuItem>
                    <SidebarMenuButton as={Link} to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </For>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}