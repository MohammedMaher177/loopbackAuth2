


import {BindingScope, extensionPoint, extensions, Getter, inject, Provider, } from '@loopback/core';
import {repository} from "@loopback/repository";
import jwt from "jsonwebtoken";
import {BasicStrategy} from 'passport-http';
import {Strategy as BearerStrategy} from "passport-http-bearer";
import {AuthenticationBindings} from '../keys';
import {UserRepository} from '../repositories';
import {AUTHENTICATION_STRATEGY_NOT_FOUND, AuthenticationMetadata, AuthenticationStrategy, } from '../types';
/**
 * An authentication strategy provider responsible for
 * resolving an authentication strategy by name.
 *
 * It declares an extension point to which all authentication strategy
 * implementations must register themselves as extensions.
 *
 * @example `context.bind('authentication.strategy').toProvider(AuthenticationStrategyProvider)`
 */
@extensionPoint(
  AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME,
  {scope: BindingScope.TRANSIENT},
) //this needs to be transient, e.g. for request level context.
export class AuthenticationStrategyProvider
  implements Provider<AuthenticationStrategy[] | undefined>
{
  constructor(
    @extensions()
    protected authenticationStrategies: Getter<AuthenticationStrategy[]>,
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(AuthenticationBindings.METADATA) protected metadata?: AuthenticationMetadata[],
  ) { }
  async value(): Promise<AuthenticationStrategy[] | undefined> {
    if (!this.metadata?.length) {
      return undefined;
    }

    // const name = this.metadata.
    return this.findAuthenticationStrategies(this.metadata);
  }

  private async findAuthenticationStrategies(
    metadata: AuthenticationMetadata[],
  ): Promise<AuthenticationStrategy[]> {
    const strategies: AuthenticationStrategy[] = [];

    const existingStrategies = await this.authenticationStrategies();

    const findStrategy = (name: string) => {
      const strategy = existingStrategies.find(a => a.name === name);

      if (name === "BearerStrategy") {
        return new BearerStrategy(this.authenticate.bind(this))
      }
      // const name : string = "BasicStrategy";
      else if (name === "BasicStrategy") {
        return new BasicStrategy(this.verify.bind(this))
      } else if (!strategy) {
        const error = new Error(`The strategy '${name}' is not available.`);
        Object.assign(error, {
          code: AUTHENTICATION_STRATEGY_NOT_FOUND,
        });
        throw error;
      }
      else {
        throw strategy;
      }
      return strategy;
    };

    for (const data of metadata) {
      const strategy = findStrategy(data.strategy);
      console.log(strategy);

      // strategies.push(strategy);
    }

    return strategies;
  }


  async verify(email: string, password: string, cb: (err: Error | null, user?: object | false) => void) {
    const user = await this.userRepository.findOne({where: {email, password}});
    if (user) {
      cb(null, user)
    } else {
      cb(null, false)
    }
  }
  verifyBearer(token: string, cb: (err: Error | null, user?: object | false) => void) {
    try {
      const user = {token: jwt.verify(token, "loopback")}

      cb(null, user)
      return user
    } catch (error) {
      cb(null, false)
      return undefined
    }
  }

  authenticate(token: string, cb: (err: Error | null, user?: object | false) => void,) {
    try {
      const user = {token: jwt.verify(token, "loopback")}
      cb(null, user)
      // return {user}
    } catch (error) {
      cb(null, false)
      // return undefined
    }
  }
}
