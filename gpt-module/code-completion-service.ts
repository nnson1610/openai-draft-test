import { CreateCompletionResponse, OpenAIApi } from "openai";
import OpenAiInstance from "./instance";
import { AxiosResponse } from "axios";
import GPT_CONFIG from "./config";

const openai = OpenAiInstance() as unknown as OpenAIApi;

const createPrompt = (context: string, text: string): string => {
  return (
    '"""\n\nCreate a form input with suitable field base on your own knowledge about the context:\n\n' +
    '"""\n\nUsing HTML skeleton and Boostrap for styling:\n\n' +
    "Context :\n" +
    context +
    "\n\nQuestion :\n" +
    text +
    '.\n" +Does not include the prompt.\n"""\n' +
    '"""\n'
  );
};

const generateCompletion = async (
  context: string,
  text: string
): Promise<string | undefined> => {
  const prompt = createPrompt(context, text);
  console.log(`Called code completion function with prompt : ${prompt}`);
  const response: AxiosResponse<CreateCompletionResponse, any> =
    await openai.createCompletion({
      model: GPT_CONFIG.CODE_COMPLETION_MODEL,
      prompt,
      temperature: 0,
      max_tokens: GPT_CONFIG.MAX_TOKENS,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ['"""'],
    });
  return response.data.choices[0].text;
};

export default {
  generateCompletion,
};
