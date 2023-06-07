import OpenAiInstance from "./instance";
import { FineTune, ListFineTunesResponse, OpenAIApi } from "openai";
import GPT_CONFIG from "./config";
import * as fs from "fs";
import { AxiosResponse } from "axios";
const openai = OpenAiInstance() as unknown as OpenAIApi;

async function createCompletion(
  prompt: string,
  model = GPT_CONFIG.MODEL
): Promise<string> {
  try {
    const response = await openai.createCompletion({
      model,
      prompt,
      max_tokens: GPT_CONFIG.MAX_TOKENS,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      top_p: 1.0,
      temperature: 0,
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
