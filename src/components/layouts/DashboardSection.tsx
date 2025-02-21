import { cn } from "@/lib/utils";
import { Heading } from "../ui/heading";

type DashboardSectionProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
  sectionClassName?: string;
};

export const DashboardSection = ({
  children,
  className,
  sectionClassName,
  ...props
}: DashboardSectionProps) => {
  return (
    <section className={cn(sectionClassName)}>
      <header className="mb-20">
        <Heading size={"h3"}>{props.title}</Heading>
        {props.description && <p>{props.description}</p>}
      </header>
      <main className={cn("flex flex-col", className)}>{children}</main>
    </section>
  );
};
