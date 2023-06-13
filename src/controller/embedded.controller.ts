import * as express from "express";
import * as socketio from "socket.io";
import GPT_CONFIG from "../../gpt-module/config";
import completionService from "../../gpt-module/completion-service";
import { dirname } from "path";

export class EmbeddedController {
  private router: express.Router = express.Router();
  private socketIO: socketio.Server;

  public setSocketIo(socketIo: socketio.Server) {
    this.socketIO = socketIo;
  }

  public getRouter(): express.Router {
    this.router.post(
      "",
      async (req: express.Request, res: express.Response) => {
        const rootDir = dirname(require?.main?.filename || "");
        try {
          // const response = await completionService.generateCompletion(
          //   req.body.message,
          //   `${rootDir}${GPT_CONFIG.EMBEDDED_FILE_PATH}`
          // );
          const response = await completionService.generateChromaCompletion(
            req.body.message
          );
          this.socketIO.emit("message", response);
          res.sendStatus(200);
        } catch (error) {
          console.log("error", error);
          res.sendStatus(500);
        } finally {
          console.log("Message Posted");
        }
      }
    );
    return this.router;
  }
}
