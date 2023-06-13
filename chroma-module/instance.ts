import { ChromaClient, Collection, OpenAIEmbeddingFunction } from "chromadb";
import CHROMA_CONFIG from "./config";
import {
  Embedding,
  Embeddings,
  Metadata,
  Metadatas,
} from "chromadb/dist/main/types";

const chromaClient = new ChromaClient({ path: CHROMA_CONFIG.PATH });

const getOpenAiEmbedder = (apiKey: string) => {
  return new OpenAIEmbeddingFunction({
    openai_api_key: apiKey,
  });
};

const getCollection = async (
  collectionName: string,
  embedded: OpenAIEmbeddingFunction
) => {
  return chromaClient.getCollection({
    name: collectionName,
    embeddingFunction: embedded,
  });
};

const deleteCollection = async (collectionName: string) => {
  return chromaClient.deleteCollection({
    name: collectionName,
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
  documents: string[]
) => {
  return await collection.add({
    ids,
    documents,
  });
};

const getData = async ({
  collection,
  queryTexts,
  queryEmbeddings,
  nResults = 5,
}: {
  collection: Collection;
  queryTexts?: string[];
  queryEmbeddings?: Embedding | Embeddings;
  nResults?: number;
}) => {
  return await collection.query({
    nResults,
    queryTexts,
    queryEmbeddings,
  });
};

export {
  chromaClient,
  getOpenAiEmbedder,
  getCollection,
  deleteCollection,
  createCollection,
  addData,
  getData,
};
