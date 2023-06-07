import * as path from "path";
const resolvedPath = path.resolve(__dirname);
require("dotenv").config({ path: `${resolvedPath}/.env` });

const GPT_CONFIG = {
  MAX_TOKENS: Number(process.env.MAX_TOKENS || 100),
  API_KEY: process.env.OPENAI_KEY,
  MODEL: process.env.FINE_TUNE_MODEL || "",
  EMBEDDED_FILE_PATH: process.env.EMBEDDED_FILE_PATH,
  EMBEDDING_SOURCE_FILE_PATH: process.env.EMBEDDING_SOURCE_FILE_PATH,
  EMBEDDING_MODEL: process.env.EMBEDDING_MODEL || "",
  COMPLETION_MODEL: process.env.COMPLETION_MODEL || "",
  CODE_COMPLETION_MODEL: process.env.CODE_COMPLETION_MODEL || "",
};

export default GPT_CONFIG;
