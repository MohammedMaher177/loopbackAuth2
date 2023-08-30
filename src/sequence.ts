// import {MiddlewareSequence} from '@loopback/rest';
import {AuthenticationBindings, AuthenticateFn} from "@loopback/authentication"
import {inject} from '@loopback/context';
import {SequenceHandler, RequestContext, FindRoute, SequenceActions, ParseParams, InvokeMethod, Send, Reject} from "@loopback/rest"
// export class MySequence extends MiddlewareSequence {
//   constructor(
//     @inject(AuthenticationBindings.AUTH_ACTION) protected authenticateReques :AuthenticateFn
//   ){
//     super()
//   }
// }


export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) protected send: Send,
    @inject(SequenceActions.REJECT) protected reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION) protected authenticateRequest: AuthenticateFn,
    // ... other sequence action injections
  ) { }

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;
      const route = this.findRoute(request);

      // Authenticate
      await this.authenticateRequest(request);

      // Authentication successful, proceed to invoke controller
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}
