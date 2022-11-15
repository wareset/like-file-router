export { Router, METHODS } from './_includes'
import { Router } from './_includes'
export default Router

export type {
  TypeHandler,
  TypeHandlerError,
  TypeError,
  TypeIncomingMessage,
  TypeServerResponse
} from './_includes'

export function createRouter(
  ...a: ConstructorParameters<typeof Router>
): Router { return new Router(...a) }
