import { Card } from "@prisma/client";

interface CardItemProps {
  index: number;
  card: Card;
}

export const CardItem = ({ index, card }: CardItemProps) => {
  return (
    <div
      className="truncate px-2 py-3 bg-white rounded-md border-2 border-transparent hover:border-black text-sm shadow-md"
      role="button"
    >
      {card.title}
    </div>
  );
};
