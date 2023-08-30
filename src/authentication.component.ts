


import {Component, ContextTags, injectable} from '@loopback/core';
import {AuthenticationBindings} from './keys';
import {
  AuthenticateActionProvider,
  AuthenticationMiddlewareProvider,
  AuthenticationStrategyProvider,
  AuthMetadataProvider,
} from './providers';

@injectable({tags: {[ContextTags.KEY]: AuthenticationBindings.COMPONENT}})
export class AuthenticationComponent implements Component {
  providers = {
    [AuthenticationBindings.AUTH_ACTION.key]: AuthenticateActionProvider,
    [AuthenticationBindings.STRATEGY.key]: AuthenticationStrategyProvider,
    [AuthenticationBindings.METADATA.key]: AuthMetadataProvider,
    [AuthenticationBindings.AUTHENTICATION_MIDDLEWARE.key]:
      AuthenticationMiddlewareProvider,
  };
}
