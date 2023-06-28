import OpenAiInstance from "./instance";
import { FineTune, ListFineTunesResponse, OpenAIApi } from "openai";
import GPT_CONFIG from "./config";
import * as fs from "fs";
import { AxiosResponse } from "axios";
const openai = OpenAiInstance() as unknown as OpenAIApi;
const END = " \n\n###\n\n";

// const createPrompt = (prompt: string): string => {
//   return (
//     '"""\n\nYou are a helpful assistant to answer what technology is used in my company:\n\n' +
//     "Does the technology :\n" +
//     prompt +
//     "is used? :\n" +
//     +END
//   );
// };

async function createCompletion(
  prompt: string,
  model = GPT_CONFIG.MODEL
): Promise<string> {
  try {
    const response = await openai.createCompletion({
      model,
      prompt: prompt + END,
      max_tokens: 20 || GPT_CONFIG.MAX_TOKENS,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      top_p: 1.0,
      temperature: 0,
      logprobs: 2,
      stop: [" \n\n###\n\n"],
    });
    if (response.data?.choices[0]?.text) {
      return response.data?.choices[0]?.text;
    }
    return "Nothing";
  } catch (err) {
    throw new Error(`Err: ${err})`);
  }
}

async function createFineTune(
  fileName: string,
  model = "davinci"
): Promise<AxiosResponse<FineTune, any>> {
  try {
    return openai.createFineTune({
      training_file: fileName,
      model: model,
    });
  } catch (err) {
    throw new Error(`Err: ${err})`);
  }
}

async function listFineTunes(): Promise<
  AxiosResponse<ListFineTunesResponse, any>
> {
  try {
    const response = await openai.listFineTunes();
    return response;
  } catch (err) {
    throw new Error(`Err: ${err})`);
  }
}

async function upload(path: string): Promise<string> {
  try {
    await openai.createFile(fs.createReadStream(path), "fine-tune");
    return "Success";
  } catch (err) {
    throw new Error(`Err: ${err})`);
  }
}

export default {
  createFineTune,
  listFineTunes,
  upload,
  createCompletion,
};
