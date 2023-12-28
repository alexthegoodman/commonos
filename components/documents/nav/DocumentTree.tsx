import * as React from "react";
import useSWR, { mutate } from "swr";

import { deleteDocument, getDocumentsData } from "../../../fetchers/document";
import { useCookies } from "react-cookie";
import { getUserData, updateDocumentTree } from "../../../fetchers/user";
import graphClient from "../../../helpers/GQLClient";
import { newDocumentMutation } from "../../../gql/document";
import {
  Box,
  CircularProgress,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Typography,
  styled,
} from "@mui/material";
import { Add, ChevronRight, MoreVert } from "@mui/icons-material";
import PrimaryLoader from "@/components/core/layout/PrimaryLoader";

const TreeWrapper = styled("section")(
  ({ theme }) => `
    height: calc(100vh - 100px);
    background-color: rgba(255, 255, 255, 0.05);
    padding: 15px 25px;
  
    .documentTreeInner {
      .treeWrapper {
        margin-left: -25px; // to offset padding on ul
      }
  
      li {
        position: relative;
        list-style: none;
      }
      ul {
        display: block;
        list-style: none;
        padding: 0 0 0 25px;
        margin: 0 0 0 0;
  
        &.addDocumentMenu {
          position: absolute;
          top: 0px;
          left: 150px;
          background: white;
          box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
          padding: 15px;
          margin: 0;
          border-radius: 5px;
          width: 150px;
          z-index: 50;
  
          li {
            padding: 7px 0;
            cursor: pointer;
          }
        }
  
        li {
          position: relative;

          .documentOptions {
            position: absolute;
            top: 0px;
            right: 0px;
            display: none;
            width: 30px;
            height: 30px;
            padding: 0;
            justify-content: center;
            align-items: center;
          }

          &:hover {
            > p > .documentOptions {
              display: flex;
            }
          }           

          span, p {
            display: flex;
            flex-direction: row;
            padding: 3px 0;
  
            &.selected {
              background-color: grey;
            }
  
            .chevron {
              display: flex;
              justify-content: center;
              align-items: center;
              transform: rotate(90deg);
              cursor: pointer;
            }
            a {
              display: block;
              padding: 2px 2px;
              text-decoration: none;
              line-height: 21px;
            }
          }
  
          &.addDocument {
            // padding: 7px 0;
            cursor: pointer;
  
            span {
              // line-height: 35px;
  
              > i {
                &:hover {
                  background-color: none;
                }
              }
            }
          }
  
          &.folded {
            .chevron {
              transform: rotate(0deg);
            }
  
            ul {
              display: none;
            }
          }
          &.dragActive {
            border-bottom: 2px solid white;
          }
        }
      }
    }
`
);

const getItemFromTree = (tree, targetId) => {
  console.info("getItemFromTree", tree, targetId);

  const sourceItemTop = tree.filter((it) => it?.id === targetId)[0];
  if (sourceItemTop) {
    return sourceItemTop;
  }

  for (const obj of tree) {
    const foundChild = getSourceItem(obj, targetId);
    if (foundChild) {
      return foundChild;
    }
  }
};

const getSourceItem = (obj, targetId) => {
  if (obj?.children) {
    for (const child of obj.children) {
      if (child?.id === targetId) {
        return child;
      }
      const foundChild = getSourceItem(child, targetId);
      if (foundChild) {
        return foundChild;
      }
    }
  }
};

// add to first index of children of zone
const addToFirstIndex = (obj, newId, targetId, sourceItem) => {
  if (obj?.children) {
    obj.children.forEach((child, index) => {
      if (child?.id === targetId) {
        child.children.splice(0, 0, sourceItem);
      }
      addToFirstIndex(child, newId, targetId, sourceItem);
    });
  }
};

const addAfter = (obj, newId, targetId, sourceItem) => {
  if (obj?.children) {
    obj.children.forEach((child, index) => {
      if (child?.id === targetId) {
        obj.children.splice(index + 1, 0, sourceItem);
      }
      addAfter(child, newId, targetId, sourceItem);
    });
  }
};

const removeFromTree = (tree, targetId) => {
  console.info("removeFromTree", tree, targetId);
  tree.forEach((item) => {
    removeFromChildren(item, targetId);
  });
  return tree.filter((it) => it?.id !== targetId);
};

const removeFromChildren = (obj, targetId) => {
  if (obj?.children) {
    obj.children.forEach((child) => {
      if (child?.id === targetId) {
        console.info("removing", child);
        obj.children = obj.children.filter((item) => item?.id !== targetId);
      }
      removeFromChildren(child, targetId);
    });
  }
};

const addToChildren = (obj, newId, targetId) => {
  if (obj?.children) {
    obj.children.forEach((child) => {
      if (child?.id === targetId) {
        child.children.push({ id: newId, folded: true, children: [] });
      }
      addToChildren(child, newId, targetId);
    });
  }
};

const foldChildren = (obj, targetId) => {
  if (obj?.children) {
    obj.children.forEach((child) => {
      if (child?.id === targetId) {
        child.folded = !child.folded;
      }
      foldChildren(child, targetId);
    });
  }
};

const AddDocumentMenu = ({ id = null, addPageHandler }) => {
  // const [showMenu, setShowMenu] = React.useState(false);

  return (
    <li className="addDocument" onClick={() => addPageHandler(id)}>
      <Typography variant="body2">
        <Add /> <span>Add Document</span>
      </Typography>
      {/* {showMenu ? (
        <ul className="addDocumentMenu">
          <li onClick={() => addPageHandler(id, "book")}>Add Book</li>
          <li onClick={() => addPageHandler(id, "cover")}>Add Cover</li>
          <li onClick={() => addPageHandler(id, "part")}>Add Part</li>
          <li onClick={() => addPageHandler(id, "chapter")}>Add Chapter</li>
        </ul>
      ) : (
        <></>
      )} */}
    </li>
  );
};

const DocumentOptionsMenu = ({ treeData, userData, id = null }) => {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    let newTree = treeData;

    if (!id) return;

    newTree = newTree.filter((item) => item?.id !== id);

    newTree.forEach((item) => {
      removeFromChildren(item, id);
    });

    mutate("homeLayout", () => updateDocumentTree(token, newTree), {
      optimisticData: { ...userData, documentTree: newTree },
    });

    try {
      await deleteDocument(token, id);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <>
      <IconButton className="documentOptions" onClick={handleClick}>
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
};

const DocumentTree = ({ documentId = "" }) => {
  const [cookies, setCookie] = useCookies(["cmUserToken"]);
  const token = cookies.cmUserToken;

  graphClient.setupClient(token);

  const { data: userData } = useSWR("homeLayout", () => getUserData(token), {
    revalidateOnMount: true,
  });

  const treeData = userData ? userData.documentTree : [];

  const {
    data: documentsData,
    error,
    isLoading,
    // mutate,
  } = useSWR("browseKey", () => getDocumentsData(token));

  console.info("documents data", userData, documentsData);

  const [dragActiveId, setDragActiveId] = React.useState(null);

  console.info("dragActiveId", dragActiveId);

  const linkDragStart = (e) => {
    console.info("dragging", e.target.id);
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("text/plain", e.target.id);
  };

  const dragoverHandler = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragActiveId(e.target.id);
  };

  const dropHandler = (e) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain");
    const zoneId = e.target.id;
    console.info("dropped", treeData, sourceId, zoneId);
    setDragActiveId(null);

    if (!sourceId || !zoneId) return;

    if (sourceId === zoneId) return;

    // update doocument tree optimistically with new position
    let newTree = treeData;

    if (zoneId.includes("InnerTop")) {
      // add item to top of zone
      const sourceItem = getItemFromTree(newTree, sourceId);
      console.info("sourceItem1", sourceItem);

      newTree = removeFromTree(newTree, sourceId);

      newTree.forEach((item) => {
        addToFirstIndex(
          item,
          sourceId,
          zoneId.replace("InnerTop", ""),
          sourceItem
        );

        if (item?.id === zoneId.replace("InnerTop", "")) {
          // add to top of children
          item.children.splice(0, 0, sourceItem);
        }
      });
    } else {
      // remove item from tree then add to new position (right after zone)
      const sourceItem = getItemFromTree(newTree, sourceId);
      console.info("sourceItem2", sourceItem);

      newTree = removeFromTree(newTree, sourceId);

      newTree.forEach((item) => {
        addAfter(item, sourceId, zoneId, sourceItem);

        if (item?.id === zoneId) {
          // add after at top level
          newTree.splice(newTree.indexOf(item) + 1, 0, sourceItem);
        }
      });
    }

    mutate("homeLayout", () => updateDocumentTree(token, newTree), {
      optimisticData: { ...userData, documentTree: newTree },
    });
  };

  const addPageHandler = async (parentId = null) => {
    // create new document
    const { newDocument } =
      await graphClient.client?.request(newDocumentMutation);

    // if parentId supplied, add to its children
    let newTree = treeData;
    if (parentId) {
      newTree.forEach((item) => {
        if (item?.id === parentId) {
          item.children.push({
            id: newDocument.id,
            folded: true,
            children: [],
          });
        }
        addToChildren(item, newDocument.id, parentId);
      });
    } else {
      if (newTree === null) newTree = [];
      newTree.push({ id: newDocument.id, folded: true, children: [] });
    }

    // save new tree

    mutate("browseKey", () => getDocumentsData(token));
    mutate("homeLayout", () => updateDocumentTree(token, newTree), {
      optimisticData: { ...userData, documentTree: newTree },
    });
  };

  const toggleFold = (targetId) => {
    let newTree = treeData;

    newTree.forEach((item) => {
      if (item?.id === targetId) {
        item.folded = !item.folded;
      }
      foldChildren(item, targetId);
    });

    // save tree
    mutate("homeLayout", () => updateDocumentTree(token, newTree), {
      optimisticData: { ...userData, documentTree: newTree },
    });
  };

  const displayChildren = (obj, addPage) => {
    return obj.children ? (
      <ul>
        <li
          className={
            "topLevelSpacer" +
            (dragActiveId === `${obj.id}InnerTop` ? " dragActive" : "")
          }
          style={{
            height: "5px",
            width: "100%",
            backgroundColor: "transparent",
          }}
          id={`${obj.id}InnerTop`}
          onDrop={dropHandler}
          onDragOver={dragoverHandler}
        ></li>
        {obj.children.map((child) => {
          if (!child) return <></>;

          const childData = documentsData.filter(
            (document) => document.id === child.id
          )[0];

          const newAddPage = (
            <AddDocumentMenu id={child.id} addPageHandler={addPageHandler} />
          );

          return (
            <>
              <li
                className={
                  (child.folded ? "folded" : "") +
                  (dragActiveId === `${child.id}` ? " dragActive" : "")
                }
                id={`${child.id}Target`}
                onDrop={dropHandler}
                onDragOver={dragoverHandler}
              >
                <Typography
                  variant="body2"
                  className={documentId === child.id ? "selected" : ""}
                >
                  <ChevronRight
                    className="chevron"
                    onClick={() => toggleFold(child.id)}
                  />

                  <Link
                    id={`${child.id}`}
                    href={`/documents/${child.id}`}
                    draggable="true"
                    onDragStart={linkDragStart}
                  >
                    {childData?.title}
                  </Link>

                  <DocumentOptionsMenu
                    treeData={treeData}
                    userData={userData}
                    id={child.id}
                  />
                </Typography>

                {child.id ? displayChildren(child, newAddPage) : <></>}
              </li>
            </>
          );
        })}
        {addPage}
      </ul>
    ) : (
      <ul>{addPage}</ul>
    );
  };

  if (isLoading) return <PrimaryLoader />;
  if (error) return <>{error.message}</>;

  const newTopLevelPage = (
    <ul>
      <AddDocumentMenu id={null} addPageHandler={addPageHandler} />
    </ul>
  );

  return (
    <TreeWrapper>
      <div className="documentTreeInner">
        <Typography variant="overline">Your Documents</Typography>
        <Box className="treeWrapper">
          {treeData && typeof treeData === "object" && documentsData ? (
            treeData.map((item) => {
              if (!item) return <></>;

              const itemData = documentsData.filter(
                (document) => document.id === item.id
              )[0];

              const newAddPage = (
                <AddDocumentMenu id={item.id} addPageHandler={addPageHandler} />
              );

              return (
                <>
                  <ul>
                    <>
                      <li
                        className={
                          (item.folded ? "folded" : "") +
                          (dragActiveId === `${item.id}` ? " dragActive" : "")
                        }
                        id={`${item.id}Target`}
                        onDrop={dropHandler}
                        onDragOver={dragoverHandler}
                      >
                        <Typography
                          variant="body2"
                          className={documentId === item.id ? "selected" : ""}
                        >
                          <ChevronRight
                            className="chevron"
                            onClick={() => toggleFold(item.id)}
                          />

                          <Link
                            id={`${item.id}`}
                            href={`/documents/${item.id}`}
                            draggable="true"
                            onDragStart={linkDragStart}
                          >
                            {itemData?.title}
                          </Link>

                          <DocumentOptionsMenu
                            treeData={treeData}
                            userData={userData}
                            id={item.id}
                          />
                        </Typography>

                        {item.id ? displayChildren(item, newAddPage) : <></>}
                      </li>
                    </>
                    {/* {newAddPage} */}
                  </ul>
                </>
              );
            })
          ) : (
            <></>
          )}
          {newTopLevelPage}
        </Box>
      </div>
    </TreeWrapper>
  );
};

export default DocumentTree;
