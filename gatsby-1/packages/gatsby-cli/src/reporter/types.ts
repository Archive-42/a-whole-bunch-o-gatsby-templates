import * as ActionCreators from "./redux/actions"
// TODO: This needs to be implemented when redux/acitons is converted to TS
export type CreateLogAction = any

export type ErrorMeta =
  | {
      id: string
      error?: Error
      context: Record<string, any>
      [id: string]: any
    }
  | string
  | Error
  | Array<ErrorMeta>

export interface ILogIntent {
  type: "LOG_INTENT"
  payload:
    | {
        name: "createLog"
        args: Parameters<typeof ActionCreators["createLog"]>
      }
    | {
        name: "createPendingActivity"
        args: Parameters<typeof ActionCreators["createPendingActivity"]>
      }
    | {
        name: "setStatus"
        args: Parameters<typeof ActionCreators["setStatus"]>
      }
    | {
        name: "startActivity"
        args: Parameters<typeof ActionCreators["startActivity"]>
      }
    | {
        name: "endActivity"
        args: Parameters<typeof ActionCreators["endActivity"]>
      }
    | {
        name: "updateActivity"
        args: Parameters<typeof ActionCreators["updateActivity"]>
      }
    | {
        name: "setActivityErrored"
        args: Parameters<typeof ActionCreators["setActivityErrored"]>
      }
    | {
        name: "setActivityStatusText"
        args: Parameters<typeof ActionCreators["setActivityStatusText"]>
      }
    | {
        name: "setActivityTotal"
        args: Parameters<typeof ActionCreators["setActivityTotal"]>
      }
    | {
        name: "activityTick"
        args: Parameters<typeof ActionCreators["activityTick"]>
      }
}

export type ReporterMessagesFromChild = ILogIntent

export { ActionCreators }
