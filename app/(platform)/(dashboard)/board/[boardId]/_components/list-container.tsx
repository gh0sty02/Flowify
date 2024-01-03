"use client";

import { ListWithCards } from "@/types";
import { List } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { UpdateCardOrder } from "@/actions/update-card-order ";

interface ListContainerProps {
  boardId: string;
  lists: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ boardId, lists }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(lists);
  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess() {
      toast.success("List Reorderd");
    },
    onError(error) {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(UpdateCardOrder, {
    onSuccess() {
      toast.success("Card Reorderd");
    },
    onError(error) {
      toast.error(error);
    },
  });

  useEffect(() => {
    setOrderedData(lists);
  }, [lists]);

  function onDragEnd(result: DropResult) {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // user moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );

      console.log(items, orderedData);

      setOrderedData(items);

      executeUpdateListOrder({ boardId, items });
    }

    // user moves a card
    if (type === "card") {
      let newOrderedData = [...orderedData];

      // get source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destinationList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destinationList) {
        return;
      }

      // check if cards exist on the source list
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // check if cards exist on destination list
      if (!destinationList.cards) {
        destinationList.cards = [];
      }

      // Moving the card in the same list

      if (source.droppableId === destination.droppableId) {
        // get the new order of the cards
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        // change the index so that the lists keep their position
        // eg: the default order of items is 1,2,3. suppose if 3 is dragged to 1, the new
        // order becomes 3,2,1. to persist this and get the order as per the default state, we
        // map over the list, get the index of the current item and map the index to the order.
        reorderedCards.forEach((card, index) => {
          card.order = index;
        });

        // setting the cards and updating
        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);

        executeUpdateCardOrder({ boardId, items: reorderedCards });
      } else {
        // Moving the card into another list

        // remove card from source list;

        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        // add the card to the destination list

        destinationList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        // update the oder for each card in the destination list
        destinationList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderedData(newOrderedData);

        executeUpdateCardOrder({ boardId, items: destinationList.cards });
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            className="flex gap-x-2 h-full"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {orderedData.map((list, index) => (
              <ListItem key={list.id} index={index} list={list} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
