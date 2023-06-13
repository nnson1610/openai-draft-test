const fs = require("fs");
import OpenAiInstance from "./instance";
import GPT_CONFIG from "./config";
import { OpenAIApi } from "openai";

const openai = OpenAiInstance() as unknown as OpenAIApi;

const maxTokens = GPT_CONFIG.MAX_TOKENS;
const embeddingModel = GPT_CONFIG.EMBEDDING_MODEL;
const completionModel = GPT_CONFIG.COMPLETION_MODEL;

// Config Variables
let embeddingStore: { [key: string]: string } = {};
const embeds_storage_prefix = "embeds:";
let embeddedQuestion: number[];

const createPrompt = (question: string, paragraph: string[]) => {
  return (
    "Answer the following question, also use your own knowledge when necessary :\n\n" +
    "Context :\n" +
    paragraph.join("\n\n") +
    "\n\nQuestion :\n" +
    question +
    "?" +
    "\n\nAnswer :"
  );
};

// Removes the prefix from paragraph
const keyExtractParagraph = (key: string) => {
  return key.substring(embeds_storage_prefix.length);
};

// Calculates the similarity score of question and context paragraphs
const compareEmbeddings = (embedding1: number[], embedding2: number[]) => {
  var length = Math.min(embedding1.length, embedding2.length);
  var dotprod = 0;

  for (var i = 0; i < length; i++) {
    dotprod += embedding1[i] * embedding2[i];
  }

  return dotprod;
};

// Loop through each context paragraph, calculates the score, sort using score and return top count(int) paragraphs
const findClosestParagraphs = (questionEmbedding: number[], count: number) => {
  var items: { paragraph: string; score: number }[] = [];

  for (const key in embeddingStore) {
    let paragraph = keyExtractParagraph(key);

    let currentEmbedding = JSON.parse(embeddingStore[key]).embedding;

    items.push({
      paragraph: paragraph,
      score: compareEmbeddings(questionEmbedding, currentEmbedding),
    });
  }

  items.sort(function (a, b) {
    return b.score - a.score;
  });

  return items.slice(0, count).map((item) => item.paragraph);
};

const generateCompletion = async (
  prompt: string,
  embeddedPath: string
): Promise<string> => {
  console.log(`Called completion function with prompt : ${prompt}`);

  try {
    // Retrieve embedding store and parse it
    let embeddingStoreJSON = fs.readFileSync(embeddedPath, {
      encoding: "utf-8",
      flag: "r",
    });

    embeddingStore = JSON.parse(embeddingStoreJSON);

    // Embed the prompt using embedding model

    let embeddedQuestionResponse = await openai.createEmbedding({
      input: prompt,
      model: embeddingModel,
    });
    console.log("embeddedQuestionResponse: ");
    console.log(embeddedQuestionResponse);
    // Some error handling
    if (embeddedQuestionResponse.data.data.length) {
      embeddedQuestion = embeddedQuestionResponse.data.data[0].embedding;
    } else {
      throw Error("Question not embedded properly");
    }

    console.log("embeddedQuestion: ");
    console.log(embeddedQuestion);

    // Find the closest count(int) paragraphs
    let closestParagraphs = findClosestParagraphs(embeddedQuestion, 5); // Tweak this value for selecting paragraphs number

    console.log("closestParagraphs: ");
    console.log(closestParagraphs);

    let completionData = await openai.createChatCompletion({
      model: completionModel,
      messages: [
        {
          role: "user",
          content: createPrompt(prompt, closestParagraphs),
        },
      ],
      max_tokens: maxTokens,
      temperature: 0, // Tweak for more random answers
    });

    if (!completionData.data.choices) {
      throw new Error("No answer gotten");
    }
    return completionData?.data?.choices[0]?.message?.content.trim() || "";
  } catch (error) {
    console.log(error);
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
    throw new Error("Error");
  }
};

export default {
  generateCompletion,
};
