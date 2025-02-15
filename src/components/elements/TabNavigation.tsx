import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type TabNavigationProps = {
  href: string;
  label: string;
  className?: string;
};

export const TabNavigation = ({ className, ...props }: TabNavigationProps) => {
  const pathname = usePathname();
  const activeTab = pathname === props.href;

  return (
    <Link href={props.href}>
      <Button
        variant={"outline"}
        size={"sm"}
        className={cn(
          "px-20 capitalize",
          activeTab && "border-b-2 border-b-primary bg-secondary/80",
          className,
        )}
      >
        {props.label}
      </Button>
    </Link>
  );
};
