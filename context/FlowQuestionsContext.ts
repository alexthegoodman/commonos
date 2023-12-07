import React, { useState, useReducer, Dispatch } from "react";
import { v4 as uuidv4 } from "uuid";

// const initialFiles = [
//   {
//     id: uuidv4(),
//     name: "Business Plan for a Digital Cat Veterinary Clinic",
//     app: "documents",
//     questions: [
//       {
//         id: uuidv4(),
//         type: "multipleChoice",
//         question:
//           "What type of information would you prefer in a section dedicated to cat breeds?",
//         possibleAnswers: [
//           `Detailed descriptions of each breed's personality and behavior`,
//           `Comparative charts showcasing physical attributes and characteristics`,
//           `Anecdotes or stories about popular or unique cats within each breed`,
//           `Tips on choosing the right breed based on lifestyle and environment`,
//         ],
//         chosenAnswer: "",
//       },
//       {
//         id: uuidv4(),
//         type: "multipleChoice",
//         question:
//           "In a section discussing cat behavior, which aspect would interest you the most?",
//         possibleAnswers: [
//           `Insights into feline communication and body language`,
//           `Behavioral issues and solutions (e.g., scratching, litter box problems)`,
//           `Interactive elements like quizzes or puzzles to understand cat behavior`,
//           `Case studies illustrating behavior modification techniques`,
//         ],
//         chosenAnswer: "",
//       },
//     ],
//   },
//   {
//     id: uuidv4(),
//     name: "Technology Infrastructure Guide",
//     app: "documents",
//     questions: [],
//   },
//   {
//     id: uuidv4(),
//     name: "Cat-Specific Telemedicine Protocols",
//     app: "documents",
//     questions: [],
//   },
//   {
//     id: uuidv4(),
//     name: "Financial Management and Billing in Digital Veterinary Services",
//     app: "documents",
//     questions: [],
//   },
//   {
//     id: uuidv4(),
//     name: "Digital Marketing Strategy for a Cat Vet Business",
//     app: "documents",
//     questions: [],
//   },
//   {
//     id: uuidv4(),
//     name: "Client Communication and Engagement",
//     app: "documents",
//     questions: [],
//   },
//   {
//     id: uuidv4(),
//     name: "Team Training and Development",
//     app: "documents",
//     questions: [],
//   },
//   {
//     id: uuidv4(),
//     name: "Expansion and Growth Strategies",
//     app: "documents",
//     questions: [],
//   },
//   {
//     id: uuidv4(),
//     name: "Pawsitively Digital: Revolutionizing Cat Veterinary Care",
//     app: "slides",
//     questions: [],
//   },
//   {
//     id: uuidv4(),
//     name: "Feline Telemedicine: Navigating the Future of Cat Health",
//     app: "slides",
//     questions: [],
//   },
//   {
//     id: uuidv4(),
//     name: "Financial Projections: Cat Vet Clinic's Digital Services Revenue Forecast",
//     app: "sheets",
//     questions: [],
//   },
//   {
//     id: uuidv4(),
//     name: "Inventory Management: Digital Medical Supplies and Equipment for Cats",
//     app: "sheets",
//     questions: [],
//   },
//   {
//     id: uuidv4(),
//     name: "An image of a cozy, cat-friendly telemedicine setup with a veterinarian virtually consulting a cat owner",
//     app: "drawings",
//     questions: [],
//   },
//   {
//     id: uuidv4(),
//     name: "A collage showcasing before-and-after images of feline patients receiving remote care and thriving",
//     app: "drawings",
//     questions: [],
//   },
// ];

export interface FlowQuestionsContextState {
  initialQuestions: any[] | null;
  files: any[] | null;
}

export const FlowQuestionsContextState = {
  initialQuestions: [],
  files: [],
};

export const FlowQuestionsContextReducer = (
  state: FlowQuestionsContextState,
  action: any
) => {
  switch (action.type) {
    // case value:
    //   break;

    default:
      return {
        ...state,
        [action.type]: action.payload,
      };
      break;
  }
};

export const FlowQuestionsContext = React.createContext<
  [FlowQuestionsContextState, Dispatch<any>]
>([FlowQuestionsContextState, () => undefined]);

export const useFlowQuestionsContext = () =>
  React.useContext(FlowQuestionsContext) as unknown as Iterable<any>;
