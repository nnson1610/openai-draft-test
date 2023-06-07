import { Configuration, OpenAIApi } from "openai";
import GPT_CONFIG from "./config";

class OpenAiInstance {
  instance: any;

  constructor() {
    if (!this.instance) {
      const configuration = new Configuration({
        apiKey: GPT_CONFIG.API_KEY,
      });
      this.instance = new OpenAIApi(configuration);
    }

    return this.instance;
  }
}

const createOpenAiInstance = (): OpenAiInstance => new OpenAiInstance();

export default createOpenAiInstance;
