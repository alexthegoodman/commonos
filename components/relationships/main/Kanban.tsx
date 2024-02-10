"use client";

import React, { useEffect, useMemo } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
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
import { searchContacts } from "@/fetchers/relationship";
import { useCookies } from "react-cookie";
import { Autocomplete } from "@/components/core/fields/Autocomplete";

import { getAlgoliaResults } from "@algolia/autocomplete-js";
import algoliasearch from "algoliasearch";
import useSWR from "swr";
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

  return (
    <CardBox ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.card.content}
    </CardBox>
  );
}

export function KanbanZone(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
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

const AddItemButton = ({ label = "Item", onItemClick }) => {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const { data: userData } = useSWR("homeLayout", () => getUserData(token), {
    revalidateOnMount: true,
  });

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

export default function Kanban({ zoneLabel = "Step", cardLabel = "Contact" }) {
  const [state, dispatch] = useRelationshipsFunnelsContext();

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
  };

  return (
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
            <KanbanZone>
              {zone.cards.map((card) => {
                return <KanbanCard key={card.id} card={card} />;
              })}
              <AddItemButton label={cardLabel} onItemClick={handleItemClick} />
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
  );
}
