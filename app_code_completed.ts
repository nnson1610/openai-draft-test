import { CodeCompletedController } from "./src/controller/code_completed.controller";
import * as socketio from "socket.io";
import * as express from "express";
import * as path from "path";

export class App {
  private app: express.Application;
  private server: any;
  private messageController;

  constructor() {
    this.app = express();
    this.messageController = new CodeCompletedController();
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
        res.sendFile(
          path.join(__dirname, "/src/view/index_code_completed.html")
        );
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

  public start(): void {
    const port = process.env.PORT || 3000;
    this.server = this.app.listen(port, () => {
      console.log("Application started on port 3000!");
    });
    this.initSocketIo();
  }
}

const app = new App();
app.start();
