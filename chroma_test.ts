import * as chroma from "./chroma-module/instance";
import GPT_CONFIG from "./gpt-module/config";

const init = async () => {
  const embedder = chroma.getOpenAiEmbedder(GPT_CONFIG.API_KEY);
  const collectioName = "test_col";
  let collection;

  // get an existing collection
  collection = await chroma.getCollection(collectioName, embedder);
  if (!collection) {
    collection = await chroma.createCollection(collectioName, embedder);
  }
  console.log(`get/create collection: ${JSON.stringify(collection)}`);

  const response = await chroma.addData(
    collection,
    ["id1", "id2"],
    // [{ source: "my_source" }, { source: "my_source" }],
    ["This is a document", "This is another document"]
  );
  console.log(`add data: ${response}`);

  const data = await chroma.getData({
    collection,
    queryTexts: ["This is a query document"],
  });
  console.log(`query data: ${JSON.stringify(data)}`);
};

init();
