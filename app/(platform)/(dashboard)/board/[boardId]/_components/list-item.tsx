import { ListWithCards } from "@/types";
import { ListHeader } from "./list-header";
import { ElementRef, useRef, useState } from "react";
import { CardForm } from "./card-form";
import { cn } from "@/lib/utils";
import { CardItem } from "./card-item";

interface ListItemProps {
  index: number;
  list: ListWithCards;
}
export const ListItem = ({ index, list }: ListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const textAreaRef = useRef<ElementRef<"textarea">>(null);

  const disableEditing = () => {
    setIsEditing(false);
  };
  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    });
  };

  return (
    <li className="w-[272px] h-full shrink-0 select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
        <ListHeader data={list} onAddCard={enableEditing} />
        <ol
          className={cn(
            "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
            list.cards.length > 0 ? "mt-2" : "mt-0"
          )}
        >
          {list.cards.map((card, index) => (
            <CardItem index={index} key={card.id} card={card} />
          ))}
        </ol>
        <CardForm
          ref={textAreaRef}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
          listId={list.id}
        />
      </div>
    </li>
  );
};
