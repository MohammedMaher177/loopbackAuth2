import {Entity, model, property} from '@loopback/repository';
import jwt from "jsonwebtoken";
@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  userName: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;


  constructor(data?: Partial<User>) {
    super(data);
  }

  generateToken() {
    const token = jwt.sign({id: this._id, email: this.email, userName: this.userName}, "loopback")
    return token
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
