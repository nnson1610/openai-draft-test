import { ChromaClient, Collection, OpenAIEmbeddingFunction } from "chromadb";
import CHROMA_CONFIG from "./config";
import GPT_CONFIG from "../gpt-module/config";
import { Metadata, Metadatas } from "chromadb/dist/main/types";

const chromaClient = new ChromaClient({ path: CHROMA_CONFIG.PATH });

const embedder = new OpenAIEmbeddingFunction({
  openai_api_key: GPT_CONFIG.API_KEY,
});

const getCollection = async (
  collectionName: string,
  embedded: OpenAIEmbeddingFunction
) => {
  return chromaClient.getCollection({
    name: collectionName,
    embeddingFunction: embedded,
  });
};

const createCollection = async (
  collectionName = "my_collection",
  embedded: OpenAIEmbeddingFunction
) => {
  return chromaClient.createCollection({
    name: collectionName,
    embeddingFunction: embedded,
  });
};

const addData = async (
  collection: Collection,
  ids: string[],
  metadatas: Metadata | Metadatas,
  documents: string[]
) => {
  return await collection.add({
    ids,
    metadatas,
    documents,
  });
};

const getData = async (
  collection: Collection,
  queryString: string[],
  nResults: number
) => {
  return await collection.query({
    nResults,
    queryTexts: queryString,
  });
};

export {
  chromaClient,
  embedder,
  getCollection,
  createCollection,
  addData,
  getData,
};
