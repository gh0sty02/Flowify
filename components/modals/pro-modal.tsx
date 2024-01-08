"use client";
import Image from "next/image";

import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { toast } from "sonner";

export const ProModal = () => {
  const { isOpen, onClose, onOpen } = useProModal();
  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess(data) {
      window.location.href = data;
    },
    onError(error) {
      toast.error(error);
    },
  });

  const onSubmitHandler = () => {
    execute({});
  };
  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        <div className="relative flex items-center justify-center aspect-video">
          <Image src="/hero.svg" alt="hero" fill className="object-cover" />
        </div>
        <div className="text-neutral-700 space-y-6 p-6 mx-auto">
          <h2 className="font-semibold text-xl">
            Upgrade to Flowify Pro Today !
          </h2>
          <p className="text-neutral-600 text-xs font-semibold">
            Explore the best of Flowify
          </p>
          <div className="pl-3">
            <ol className="text-sm list-disc">
              <li>Unlimited Boards</li>
              <li>Advanced Checklists</li>
              <li>Admin and Security Features</li>
              <li>and More !!</li>
            </ol>
          </div>
          <Button
            className="w-full"
            variant="primary"
            onClick={onSubmitHandler}
            disabled={isLoading}
          >
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
