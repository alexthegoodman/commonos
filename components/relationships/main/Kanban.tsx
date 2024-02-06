"use client";

import React from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { useRelationshipsFunnelsContext } from "@/context/RelationshipsFunnelsContext";
import { Box, Button, TextField, styled } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

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

export default function Kanban({ zoneLabel = "Step" }) {
  const [state, dispatch] = useRelationshipsFunnelsContext();

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
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  dispatch({
                    type: "cards",
                    payload: state.zones.map((z) => {
                      if (z.id === zone.id) {
                        z.cards.push({ id: uuidv4(), content: "Test" });
                      }
                      return z;
                    }),
                  });
                }}
                style={{ height: "57px", width: "100%" }}
              >
                Add Card
              </Button>
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
