import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { renderElements } from "@/utils/render-elements";
import { LogOut } from "lucide-react";
import { sidebarMenu } from "./sidebar-menu";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarGroup as SidebarGroupComponent } from "@/components/ui/sidebar";

export function Sidebar() {
  return (
    <SidebarComponent collapsible="icon">
      <SidebarContent>
        {renderElements({
          of: sidebarMenu,
          keyExtractor: (sidebar) => sidebar.label,
          render: (sidebar) => (
            <SidebarGroup label={sidebar.label} menu={sidebar.menu} />
          ),
        })}
        <SidebarGroupComponent className="absolute bottom-5 w-full">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="py-5">
                  <LogOut />
                  Logout
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroupComponent>
      </SidebarContent>
    </SidebarComponent>
  );
}
