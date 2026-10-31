import { BackToDashboard } from "@/components/layout/BackToDashboard";
import { AccountSidebar } from "@/components/layout/AccountSidebar";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
      <div className="flex flex-col md:flex-row md:gap-6">
        <div className="hidden md:block md:w-[260px] md:flex-shrink-0">
          <div
            style={{
              position: "sticky",
              top: "148px",
              maxHeight: "calc(100vh - 164px)",
              overflowY: "auto",
            }}
          >
            <AccountSidebar />
          </div>
        </div>
        <div className="md:flex-1 min-w-0">
          <BackToDashboard />
          {children}
        </div>
      </div>
    </div>
  );
}