import * as path from "path";
const resolvedPath = path.resolve(__dirname);
require("dotenv").config({ path: `${resolvedPath}/.env` });

const CHROMA_CONFIG = {
  PATH: process.env.CHROMA_PATH || "",
};

export default CHROMA_CONFIG;
