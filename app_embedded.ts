import * as socketio from "socket.io";
import * as express from "express";
import * as path from "path";
import { EmbeddedController } from "./src/controller/embedded.controller";
import GPT_CONFIG from "./gpt-module/config";
import embeddingService from "./gpt-module/embedding-service";

export class App {
  private app: express.Application;
  private server: any;
  private messageController;

  constructor() {
    this.app = express();
    this.messageController = new EmbeddedController();
    this.config();
    this.routes();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    this.app.use(
      "/dashboard",
      (_req: express.Request, res: express.Response) => {
        res.sendFile(path.join(__dirname, "/src/view/index_embedded.html"));
      }
    );
    this.app.use("/messages", this.messageController.getRouter());
  }

  public initSocketIo() {
    const socketIo = new socketio.Server(this.server);

    socketIo.on("connection", () => {
      console.log("SocketIO connection created");
    });
    this.messageController.setSocketIo(socketIo);
  }

  public async generateEmbedding() {
    await embeddingService.generateEmbedding(
      `${__dirname}${GPT_CONFIG.EMBEDDING_SOURCE_FILE_PATH}`,
      `${__dirname}${GPT_CONFIG.EMBEDDED_FILE_PATH}`
    );
  }

  public async start(): Promise<void> {
    const port = process.env.PORT || 3000;
    this.server = this.app.listen(port, async () => {
      console.log("Application started on port 3000!");
      await this.generateEmbedding();
    });
    this.initSocketIo();
  }
}

const app = new App();
app.start();
