"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";

export const CardModal = () => {
  const { isOpen, onClose, id } = useCardModal();

  // queryKey for caching the data, queryFn(any fn that returns a promise) returned data is set as the data for that queryKey
  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/cards/${id}`),
  });
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? (
                <Description.Skeleton />
              ) : (
                <Description card={cardData} />
              )}
            </div>
          </div>
          {!cardData ? <Actions.Skeleton /> : <Actions card={cardData} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};
