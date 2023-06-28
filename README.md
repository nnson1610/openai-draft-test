- ENVIRONMENT

  node: >= 18

  chroma: git clone https://github.com/chroma-core/chroma.git

- COMMAND

```
npm run start:ft (fine-tune model)
npm run start:eb (embedded model)
npm run start:cc (code complete model)
npm run start:chroma (test chroma)
```

- Dashboard page

```
localhost:3000/dashboard
```

- Create **.env** inside **./gpt-module** folder

```
OPENAI_KEY=<api-key>
FINE_TUNE_MODEL=<model-id>
MAX_TOKENS=1000
EMBEDDING_MODEL=text-embedding-ada-002
COMPLETION_MODEL=gpt-3.5-turbo
EMBEDDING_SOURCE_FILE_PATH=/sourceData/sourceFile.txt
EMBEDDED_FILE_PATH=/embeddedData/embeddedFile.txt
```

- Create **.env** inside **./chroma-module** folder

```
CHROMA_PATH=http://localhost:8000
```
