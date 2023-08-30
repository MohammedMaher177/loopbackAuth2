import {inject} from '@loopback/context';
import {
  Request,
  RestBindings,
  get,
  response,
  ResponseObject,
} from '@loopback/rest';
import {AuthenticationBindings, authenticate} from '@loopback/authentication'
import {UserProfile} from "@loopback/security"
/**
 * OpenAPI response for ping()
 */


const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER, {optional: true}) private user: UserProfile,
    @inject(RestBindings.Http.REQUEST) private req: Request
  ) { }

  // Map to `GET /ping`
  @authenticate("BasicStrategy")
  @get('/ping')
  @response(200, PING_RESPONSE)
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }
}
