export { Router, METHODS } from './__src__'
import { Router } from './__src__'
export default Router

export type {
  TypeHandler,
  TypeHandlerError,
  TypeError,
  TypeIncomingMessage,
  TypeServerResponse
} from './__src__'

export const createRouter = (
  ...a: ConstructorParameters<typeof Router>
): Router => new Router(...a)
