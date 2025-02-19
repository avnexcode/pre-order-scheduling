import { cn } from "@/lib/utils";
import { TabNavigation } from "../elements/TabNavigation";

type DashboardProductSectionProps = {
  children: React.ReactNode;
  className?: string;
  sectionClassName?: string;
};

export const DashboardProductSection = ({
  children,
  className,
  sectionClassName,
}: DashboardProductSectionProps) => {
  return (
    <section className={cn(sectionClassName)}>
      <nav className="flex items-center gap-x-5">
        <TabNavigation label="produk" href="/dashboard/product" />
        <TabNavigation label="kategori" href="/dashboard/category" />
      </nav>
      <main className={cn("mt-5", className)}>{children}</main>
    </section>
  );
};
