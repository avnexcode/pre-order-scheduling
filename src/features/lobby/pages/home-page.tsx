import { PageContainer, SectionContainer } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { renderElements } from "@/utils/render-elements";
import Link from "next/link";
import { toast as sooner } from "sonner";

export const HomePage = () => {
  const { toast } = useToast();

  return (
    <PageContainer>
      <SectionContainer>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <Link
              href={"/dashboard"}
              className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]"
            >
              Open{" "}
              <span className="text-[hsl(280,100%,70%)]">UD. WIJAYAKUSUMA</span>{" "}
              App
            </Link>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
              <Button
                onClick={() => sooner.success("Sooner testing successfully")}
                className="flex min-h-min flex-col items-center justify-center gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              >
                <h3 className="text-2xl font-bold">Test Sooner →</h3>
                <div className="text-lg">Click Me! And See What Happen</div>
              </Button>
              <Button
                onClick={() =>
                  toast({
                    title: "Success",
                    description: "Toaster testing successfully",
                  })
                }
                className="flex min-h-min flex-col items-center justify-center gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              >
                <h3 className="text-2xl font-bold">Test Toaster →</h3>
                <div className="text-lg">Click Me! And See What Happen</div>
              </Button>
              <Link
                href={"/test-404"}
                className="flex min-h-min flex-col items-center justify-center gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              >
                <h3 className="text-2xl font-bold">Test 404 →</h3>
                <div className="text-lg">Click Me! And See What Happen</div>
              </Link>
              <Button
                onClick={() => {
                  throw new Error("Test error 500");
                }}
                className="flex min-h-min flex-col items-center justify-center gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              >
                <h3 className="text-2xl font-bold">Test 500 →</h3>
                <div className="text-lg">Click Me! And See What Happen</div>
              </Button>
            </div>
            <div>
              {renderElements({
                of: [...new Array<undefined>(10)],
                render: (_, index) => (
                  <p key={index} className="text-2xl text-white">
                    Hello World {index + 1}
                  </p>
                ),
              })}
            </div>
          </div>
        </main>
      </SectionContainer>
    </PageContainer>
  );
};
