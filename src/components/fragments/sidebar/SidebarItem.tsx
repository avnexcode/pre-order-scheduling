import { Icon } from "@/components/ui/icon";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { type icons } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarItemProps = {
  url: string;
  title: string;
  icon: string;
};

export const SidebarItem = (props: SidebarItemProps) => {
  const pathName = usePathname();
  const activeLink = pathName === props.url;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={activeLink}>
        <Link href={props.url}>
          <Icon
            name={props.icon as keyof typeof icons}
            size={40}
            className="mr-1"
          />
          <span>{props.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
