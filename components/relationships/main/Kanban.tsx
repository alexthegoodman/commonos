"use client";

import React, { useEffect, useMemo } from "react";
import {
  useDroppable,
  useDraggable,
  DndContext,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { useRelationshipsFunnelsContext } from "@/context/RelationshipsFunnelsContext";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  TextField,
  styled,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useDebounce } from "@/hooks/useDebounce";
import {
  getContactsByIds,
  getFunnelData,
  searchContacts,
} from "@/fetchers/relationship";
import { useCookies } from "react-cookie";
import { Autocomplete } from "@/components/core/fields/Autocomplete";

import { getAlgoliaResults } from "@algolia/autocomplete-js";
import algoliasearch from "algoliasearch";
import useSWR, { mutate } from "swr";
import { getUserData } from "@/fetchers/user";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const ZoneWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "350px",
}));

const ZoneBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[300],
  padding: "0",
  margin: "0 8px",
  width: "100%",
  height: "calc(100vh - 200px)",
}));

const CardBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: "8px",
  margin: "8px",
  width: "calc(100% - 32px)",
  height: "100px",
  boxShadow: "0 0 5px 0 rgba(0,0,0,0.2)",
}));

export function Item({ hit, components, onItemClick, state }) {
  // console.info("hit", hit);
  // console.info("item state", state);
  return (
    <a
      // href={hit.url}
      href="#!"
      className="aa-ItemLink"
      style={{ width: "200px", background: "red" }}
      onClick={() => onItemClick(hit.objectID, state)}
    >
      <div className="aa-ItemContent">
        <div className="aa-ItemTitle">
          <components.Highlight hit={hit} attribute="title" />
        </div>
      </div>
    </a>
  );
}

export function KanbanCard(props) {
  // const { attributes, listeners, setNodeRef, transform } = useDraggable({
  //   id: props.card.id,
  // });
  // const style = transform
  //   ? {
  //       transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  //     }
  //   : undefined;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.card.itemId });

  const style = {
    transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
    transition,
  };

  const title = props.cardData?.fields?.name || props.cardData?.fields?.title;

  return (
    <CardBox ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {title || "Loading..."}
    </CardBox>
  );
}

export function OverlayCard(props) {
  const title = props.cardData?.fields?.name || props.cardData?.fields?.title;

  return <CardBox>{title || "Loading..."}</CardBox>;
}

export function KanbanZone(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.droppableId,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <ZoneBox ref={setNodeRef} style={style}>
      {props.children}
    </ZoneBox>
  );
}

const AddItemButton = ({
  zoneId,
  setItemDestinationZone,
  userData,
  label = "Item",
  onItemClick,
  state,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setItemDestinationZone(zoneId);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const appId = process.env.NEXT_PUBLIC_ALOGLIA_APP_ID;
  const apiKey = userData?.algoliaApiKey;
  const searchClient = useMemo(
    () => algoliasearch(appId, apiKey),
    [appId, apiKey]
  );
  // const contactsIndex = useMemo(
  //   () => searchClient.initIndex("contacts"),
  //   [searchClient]
  // );

  // console.info("searchClient", searchClient);

  const handleItemClick = (id, state) => {
    onItemClick(id, state);
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        onClick={handleClickOpen}
        style={{ height: "57px", width: "100%" }}
      >
        Add {label}
      </Button>

      <Dialog open={open} keepMounted onClose={handleClose}>
        <DialogTitle>{"Select " + label}</DialogTitle>
        <DialogContent>
          <InputLabel sx={{ marginBottom: 2 }}>
            Search for {label} by name
          </InputLabel>
          <Autocomplete
            openOnFocus={true}
            getSources={async ({ query }) => {
              return [
                {
                  sourceId: "query",
                  getItems() {
                    return getAlgoliaResults({
                      searchClient,
                      queries: [
                        {
                          indexName: "contacts",
                          query,
                        },
                      ],
                    });
                  },
                  templates: {
                    item({ item, components }) {
                      return (
                        <Item
                          hit={item}
                          components={components}
                          onItemClick={handleItemClick}
                          state={state}
                        />
                      );
                    },
                  },
                },
              ];
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Go Back</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default function Kanban({
  kanbanId = null,
  zoneLabel = "Step",
  cardLabel = "Contact",
}) {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [state, dispatch] = useRelationshipsFunnelsContext();

  const [itemDestinationZone, setItemDestinationZone] = React.useState(null);
  const [activeId, setActiveId] = React.useState(null);

  const allCardIds = state.zones.reduce((acc, zone) => {
    return acc.concat(zone.cards.map((card) => card.itemId));
  }, []);

  const { data: kanbanData } = useSWR(
    "kanban" + kanbanId,
    () => getContactsByIds(token, allCardIds),
    {
      revalidateOnMount: true,
    }
  );

  const { data: userData } = useSWR("homeLayout", () => getUserData(token), {
    revalidateOnMount: true,
  });

  const handleItemClick = (id, propState) => {
    console.info("id", propState.zones, id);
    dispatch({
      type: "zones",
      payload: propState.zones.map((zone) => {
        if (zone.id === itemDestinationZone) {
          return {
            ...zone,
            cards: [...zone.cards, { id: uuidv4(), itemId: id }],
          };
        } else {
          return zone;
        }
      }),
    });

    mutate("kanban" + kanbanId, () =>
      getContactsByIds(token, [...allCardIds, id])
    );
  };

  const handleDragStart = (event) => {
    console.info("drag start", event);

    const { active } = event;

    setActiveId(active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, collisions } = event;

    console.info("active", active, "over", over, "collisions", collisions);

    if (active.id === over.id) {
      return;
    }

    const overIsZone = state.zones.find((zone) => zone.id === over.id);

    if (overIsZone) {
      // this is for an empty kanban zone
      // put active card in over zone
      const overZone = overIsZone;
      const activeZone = state.zones.find((zone) => {
        return zone.cards.find((card) => card.itemId === active.id);
      });

      const activeCard = activeZone.cards.find(
        (card) => card.itemId === active.id
      );

      const newActiveCards = activeZone.cards.filter(
        (card) => card.itemId !== active.id
      );

      const newOverCards = overZone.cards.concat(activeCard);

      const newActiveZone = {
        ...activeZone,
        cards: newActiveCards,
      };

      const newOverZone = {
        ...overZone,
        cards: newOverCards,
      };

      const newZones = state.zones.map((zone) => {
        if (zone.id === activeZone.id) {
          return newActiveZone;
        }

        if (zone.id === overZone.id) {
          return newOverZone;
        }

        return zone;
      });

      dispatch({
        type: "zones",
        payload: newZones,
      });
    } else {
      // this for a non-empty kanban zone, hovering over a card
      const activeZone = state.zones.find((zone) => {
        return zone.cards.find((card) => card.itemId === active.id);
      });
      const overZone = state.zones.find((zone) => {
        return zone.cards.find((card) => card.itemId === over.id);
      });

      const activeCard = activeZone.cards.find(
        (card) => card.itemId === active.id
      );
      const overCard = overZone.cards.find((card) => card.itemId === over.id);

      const activeIndex = activeZone.cards.indexOf(activeCard);
      const overIndex = overZone.cards.indexOf(overCard);

      if (activeZone?.id === overZone?.id) {
        console.info("same zone");
        // dropping card on zone it came from

        const newActiveCards = arrayMove(
          activeZone.cards,
          activeIndex,
          overIndex
        );

        const newActiveZone = {
          ...activeZone,
          cards: newActiveCards,
        };

        const newZones = state.zones.map((zone) => {
          if (zone.id === activeZone.id) {
            return newActiveZone;
          }

          return zone;
        });

        dispatch({
          type: "zones",
          payload: newZones,
        });
      } else {
        // drop card on different zone

        const newActiveCards = activeZone.cards.filter(
          (card) => card.itemId !== active.id
        );
        const newOverCards = overZone.cards.toSpliced(overIndex, 0, activeCard);

        const newActiveZone = {
          ...activeZone,
          cards: newActiveCards,
        };

        const newOverZone = {
          ...overZone,
          cards: newOverCards,
          // overIndex === -1
          //   ? newOverCards
          //   : newOverCards.splice(overIndex, 0, activeCard),
        };

        const newZones = state.zones.map((zone) => {
          if (zone.id === activeZone.id) {
            return newActiveZone;
          }

          if (zone.id === overZone.id) {
            return newOverZone;
          }

          return zone;
        });

        dispatch({
          type: "zones",
          payload: newZones,
        });
      }
    }

    setActiveId(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box display="flex" flexDirection="row" gap={2}>
        {state.zones.map((zone) => {
          return (
            <ZoneWrapper key={zone.id}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={zone.name}
                style={{ marginBottom: 5 }}
              />
              <SortableContext items={zone.cards.map((card) => card.id)}>
                <KanbanZone droppableId={zone.id}>
                  {zone.cards.map((card) => {
                    const cardData = kanbanData?.find((contact) => {
                      return contact.id === card.itemId;
                    });

                    // console.info("card", card);

                    return (
                      <KanbanCard
                        key={card.id}
                        card={card}
                        cardData={cardData}
                      />
                    );
                  })}
                  <AddItemButton
                    userData={userData}
                    label={cardLabel}
                    onItemClick={handleItemClick}
                    zoneId={zone.id}
                    setItemDestinationZone={setItemDestinationZone}
                    state={state}
                  />
                </KanbanZone>
              </SortableContext>
            </ZoneWrapper>
          );
        })}
        <DragOverlay>
          {activeId ? (
            <OverlayCard
              cardData={kanbanData?.find((contact) => {
                return contact.id === activeId;
              })}
            />
          ) : null}
        </DragOverlay>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            dispatch({
              type: "zones",
              payload: state.zones.concat({
                id: uuidv4(),
                name: "New " + zoneLabel,
                cards: [],
              }),
            });
          }}
          style={{ height: "57px", width: "200px" }}
        >
          Add {zoneLabel}
        </Button>
      </Box>
    </DndContext>
  );
}
