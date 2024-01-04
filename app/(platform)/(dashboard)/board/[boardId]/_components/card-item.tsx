import { useCardModal } from "@/hooks/use-card-modal";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";

interface CardItemProps {
  index: number;
  card: Card;
}

export const CardItem = ({ index, card }: CardItemProps) => {
  const { onOpen } = useCardModal();
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          onClick={() => onOpen(card.id)}
          className="truncate px-2 py-3 bg-white rounded-md border-2 border-transparent hover:border-black text-sm shadow-md"
          role="button"
        >
          {card.title}
        </div>
      )}
    </Draggable>
  );
};
