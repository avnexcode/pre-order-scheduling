import {
  SidebarGroup as SidebarGroupComponent,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { renderElements } from "@/utils/render-elements";
import { SidebarItem } from "./SidebarItem";

type SidebarGroupProps = {
  label: string;
  menu: {
    title: string;
    url: string;
    icon: string;
  }[];
};

export const SidebarGroup = (props: SidebarGroupProps) => {
  return (
    <SidebarGroupComponent>
      <SidebarGroupLabel>{props.label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {renderElements({
            of: props.menu,
            keyExtractor: (menu) => menu.title,
            render: (menu) => (
              <SidebarItem icon={menu.icon} title={menu.title} url={menu.url} />
            ),
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroupComponent>
  );
};
