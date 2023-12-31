import { ListWithCards } from "@/types";
import { ListHeader } from "./list-header";

interface ListItemProps {
  index: number;
  list: ListWithCards;
}
export const ListItem = ({ index, list }: ListItemProps) => {
  return (
    <li className="w-[272px] h-full shrink-0 select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
        <ListHeader data={list} />
      </div>
    </li>
  );
};
