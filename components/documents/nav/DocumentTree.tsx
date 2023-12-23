import * as React from "react";
import useSWR, { mutate } from "swr";

import { getDocumentsData } from "../../../fetchers/document";
import { useCookies } from "react-cookie";
import { getUserData, updateDocumentTree } from "../../../fetchers/user";
import graphClient from "../../../helpers/GQLClient";
import { newDocumentMutation } from "../../../gql/document";
import { Box, CircularProgress, Link, Typography, styled } from "@mui/material";
import { Add, ChevronRight } from "@mui/icons-material";

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
          span, p {
            display: flex;
            flex-direction: row;
            padding: 3px 0;
  
            &.selected {
              background-color: grey;
            }
  
            svg {
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
            svg {
              transform: rotate(0deg);
            }
  
            ul {
              display: none;
            }
          }
        }
      }
    }
`
);

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

  // console.info("documents data", userData, documentsData);

  const addToChildren = (obj, newId, targetId) => {
    if (obj.children) {
      obj.children.forEach((child) => {
        if (child.id === targetId) {
          child.children.push({ id: newId, folded: true, children: [] });
        }
        addToChildren(child, newId, targetId);
      });
    }
  };

  const foldChildren = (obj, targetId) => {
    if (obj.children) {
      obj.children.forEach((child) => {
        if (child.id === targetId) {
          child.folded = !child.folded;
        }
        foldChildren(child, targetId);
      });
    }
  };

  const addPageHandler = async (parentId = null) => {
    // create new document
    const { newDocument } =
      await graphClient.client?.request(newDocumentMutation);

    // if parentId supplied, add to its children
    let newTree = treeData;
    if (parentId) {
      newTree.forEach((item) => {
        if (item.id === parentId) {
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
      if (item.id === targetId) {
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
        {obj.children.map((child) => {
          const childData = documentsData.filter(
            (document) => document.id === child.id
          )[0];

          const newAddPage = (
            <AddDocumentMenu id={child.id} addPageHandler={addPageHandler} />
          );

          return (
            <>
              <li className={child.folded ? "folded" : ""}>
                <Typography
                  variant="body2"
                  className={documentId === child.id ? "selected" : ""}
                >
                  <ChevronRight onClick={() => toggleFold(child.id)} />

                  <Link href={`/documents/${child.id}`} draggable="true">
                    {childData?.title}
                  </Link>
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

  if (isLoading) return <CircularProgress />;
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
                      <li className={item.folded ? "folded" : ""}>
                        <Typography
                          variant="body2"
                          className={documentId === item.id ? "selected" : ""}
                        >
                          <ChevronRight onClick={() => toggleFold(item.id)} />

                          <Link href={`/documents/${item.id}`} draggable="true">
                            {itemData?.title}
                          </Link>
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
