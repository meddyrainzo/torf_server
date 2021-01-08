import { User } from '../entities/User';
import { Connection, Repository } from 'typeorm';

export default class UserRepository {
  private static connection: Connection;

  static addConnection(connection: Connection) {
    if (this.connection == null) {
      this.connection = connection;
    }
  }

  static getRepository(): Repository<User> {
    return this.connection.getRepository(User);
  }
}
