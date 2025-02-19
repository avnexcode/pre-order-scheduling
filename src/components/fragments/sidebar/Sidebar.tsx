import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { renderElements } from "@/utils/render-elements";
import { LogOut } from "lucide-react";
import { sidebarMenu } from "./sidebar-menu";
import { SidebarGroup } from "./SidebarGroup";

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
      </SidebarContent>
      <SidebarContent className="absolute bottom-5 w-full">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOut />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </SidebarComponent>
  );
}
