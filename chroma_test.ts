import * as chroma from "./chroma-module/instance";

const init = async () => {
  const collectioName = "test_col";
  let collection;

  // get an existing collection
  collection = await chroma.getCollection(collectioName, chroma.embedder);
  if (!collection) {
    collection = await chroma.createCollection(collectioName, chroma.embedder);
  }
  console.log(`get/create collection: ${JSON.stringify(collection)}`);

  const response = await chroma.addData(
    collection,
    ["id1", "id2"],
    [{ source: "my_source" }, { source: "my_source" }],
    ["This is a document", "This is another document"]
  );
  console.log(`add data: ${response}`);

  const data = await chroma.getData(
    collection,
    ["This is a query document"],
    2
  );
  console.log(`query data: ${JSON.stringify(data)}`);
};

init();
