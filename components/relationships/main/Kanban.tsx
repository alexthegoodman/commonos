"use client";

import React, { useEffect, useMemo } from "react";
import { useDroppable, useDraggable, DndContext } from "@dnd-kit/core";
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

export function Item({ hit, components, onItemClick }) {
  console.info("hit", hit);
  return (
    <a
      // href={hit.url}
      href="#!"
      className="aa-ItemLink"
      style={{ width: "200px", background: "red" }}
      onClick={() => onItemClick(hit.objectID)}
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
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.card.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const title = props.cardData?.fields?.name || props.cardData?.fields?.title;

  return (
    <CardBox ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {title || "Loading..."}
    </CardBox>
  );
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

const AddItemButton = ({ userData, label = "Item", onItemClick }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);

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

  const handleItemClick = (id) => {
    onItemClick(id);
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

  console.info("kanban data", allCardIds, kanbanData);

  const handleItemClick = (id) => {
    console.info("id", id);
    dispatch({
      type: "zones",
      payload: state.zones.map((zone) => {
        return {
          ...zone,
          cards: zone.cards.concat({
            id: uuidv4(),
            itemId: id,
          }),
        };
      }),
    });

    mutate("kanban" + kanbanId, () =>
      getContactsByIds(token, [...allCardIds, id])
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    console.info("active", active, "over", over);

    if (active.id === over.id) {
      return;
    }

    const activeZone = state.zones.find((zone) => {
      return zone.cards.find((card) => card.id === active.id);
    });

    const overZone = state.zones.find((zone) => zone.id === over.id);

    const activeCard = activeZone.cards.find((card) => card.id === active.id);
    // const overCard = overZone.cards.find((card) => card.id === over.id);

    const activeIndex = activeZone.cards.indexOf(activeCard);
    // const overIndex = overZone.cards.indexOf(overCard);

    const newActiveCards = activeZone.cards.filter(
      (card) => card.id !== active.id
    );
    const newOverCards = [...overZone.cards, activeCard];

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
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
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
              <KanbanZone droppableId={zone.id}>
                {zone.cards.map((card) => {
                  const cardData = kanbanData?.find((contact) => {
                    return contact.id === card.itemId;
                  });

                  return (
                    <KanbanCard key={card.id} card={card} cardData={cardData} />
                  );
                })}
                <AddItemButton
                  userData={userData}
                  label={cardLabel}
                  onItemClick={handleItemClick}
                />
              </KanbanZone>
            </ZoneWrapper>
          );
        })}
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
