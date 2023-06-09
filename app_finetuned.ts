import * as socketio from "socket.io";
import * as express from "express";
import * as path from "path";
import GPT_CONFIG from "./gpt-module/config";
import finetuneService from "./gpt-module/fine-tune-service";
import { FineTunedController } from "./src/controller/finetuned.controller";

export class App {
  private app: express.Application;
  private server: any;
  private messageController;

  constructor() {
    this.app = express();
    this.messageController = new FineTunedController();
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
        res.sendFile(path.join(__dirname, "/src/view/index_finetuned.html"));
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

  public async start(): Promise<void> {
    const port = process.env.PORT || 3000;
    this.server = this.app.listen(port, async () => {
      console.log("Application started on port 3000!");

      // step 1
      // get file upload by API https://api.openai.com/v1/files
      // console.log("Upload fine-tune...");
      // await finetuneService.upload(
      //   `${__dirname}/sourceData/fineTuneData.jsonl`
      // );

      // step 2
      // get fine-tune model by API https://api.openai.com/v1/fine-tunes
      // console.log("Create fine-tune...");
      // await finetuneService.createFineTune("file-Zpw7NMJ53zEY8f7AJSnCYD7E");
    });
    this.initSocketIo();
  }
}

const app = new App();
app.start();
