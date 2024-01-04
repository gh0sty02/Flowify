import { Toaster } from "sonner";

import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ClerkProvider } from "@clerk/nextjs";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <QueryProvider>
        <Toaster />
        <ModalProvider />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
};
export default PlatformLayout;
