import * as express from "express";
import codeCompletionService from "../../gpt-module/code-completion-service";
import * as socketio from "socket.io";

export class CodeCompletedController {
  private router: express.Router = express.Router();
  private socketIO: socketio.Server;

  public setSocketIo(socketIo: socketio.Server) {
    this.socketIO = socketIo;
  }
  public getRouter(): express.Router {
    this.router.post(
      "",
      async (req: express.Request, res: express.Response) => {
        try {
          const response = await codeCompletionService.generateCompletion(
            req.body.context,
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
