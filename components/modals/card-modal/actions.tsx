"use client";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { CardWithList } from "@/types";
import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";

interface ActionProps {
  card: CardWithList;
}

export const Actions = ({ card }: ActionProps) => {
  const params = useParams();
  const { onClose } = useCardModal();
  const { execute: executeCopy, isLoading: isCopyLoading } = useAction(
    copyCard,
    {
      onSuccess(data) {
        toast.success(`Card ${data.title} copied successfully`);
        onClose();
      },
      onError(error) {
        toast.error(error);
      },
    }
  );
  const { execute: executeDelete, isLoading: isDeleteLoading } = useAction(
    deleteCard,
    {
      onSuccess(data) {
        toast.success(`Card ${data.title} deleted successfully`);
        onClose();
      },
      onError(error) {
        toast.error(error);
      },
    }
  );

  const onCopyCardHandler = () => {
    const boardId = params.boardId as string;
    executeCopy({ boardId, cardId: card.id });
  };

  const onDeleteCardHandler = () => {
    const boardId = params.boardId as string;
    executeDelete({ boardId, cardId: card.id });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        variant="gray"
        size="inline"
        className="w-full justify-start"
        onClick={onCopyCardHandler}
        disabled={isCopyLoading}
      >
        <Copy className="h-4 w-4 mr-2" /> Copy
      </Button>
      <Button
        variant="gray"
        size="inline"
        className="w-full justify-start"
        onClick={onDeleteCardHandler}
        disabled={isCopyLoading}
      >
        <Trash className="h-4 w-4 mr-2" /> Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
