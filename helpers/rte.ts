const getInsertSpotInner = (preText, insertSpot) => {
  const numPreNewlines = (preText.match(/\n/g) || []).length;
  const numPreDashes = (preText.match(/\n- /g) || []).length;
  const numBolds = (preText.match(/\*\*(.*?)\*\*/gm) || []).length;
  const adjustedInsertSpot =
    insertSpot + numPreNewlines + numPreDashes * 2 + numBolds * 4;
  return adjustedInsertSpot;
};

export const getPreTextInner = (completeMarkdown, insertSpot, preText1) => {
  const adjustedInsertSpot = getInsertSpotInner(preText1, insertSpot);
  const preText = completeMarkdown.slice(0, adjustedInsertSpot);

  // let numPreDashes2 = (preText2.match(/\n- /g) || []).length;
  // let numPreNewlines2 = (preText2.match(/\n/g) || []).length;
  // const adjustedInsertSpot2 =
  //   numPreNewlines2 + numPreDashes2 * 2 + insertSpot;
  // const preText = completeMarkdown.slice(0, adjustedInsertSpot2);

  return preText;
};

export const getPreText = (completeMarkdown, insertSpot) => {
  const preText1 = completeMarkdown.slice(0, insertSpot);
  // each getPreTextInner call can adjust the preText to include more markdown syntax
  // so runs multiple times to ensure all syntax is included
  let preText = getPreTextInner(completeMarkdown, insertSpot, preText1);
  preText = getPreTextInner(completeMarkdown, insertSpot, preText);
  preText = getPreTextInner(completeMarkdown, insertSpot, preText);
  return preText;
};

export const getAdjustedInsertSpot = (completeMarkdown, insertSpot) => {
  const preText = getPreText(completeMarkdown, insertSpot);
  const adjustedInsertSpot = getInsertSpotInner(preText, insertSpot);
  return adjustedInsertSpot;
};

export const tranformMarkdownToJSON = (markdown) => {
  const paragraphs = markdown.split("\n");
  const json = paragraphs.map((paragraph) => {
    return { text: paragraph };
  });
  return json;
};

export const transformJSONToMarkdown = (json) => {
  const markdown = json.map((paragraph) => {
    return paragraph.text;
  });
  return markdown.join("\n");
};
