import { Question } from '../entities/Question';
import { Connection, Repository } from 'typeorm';

export default class QuestionRepository {
  private static connection: Connection;

  static addConnection(connection: Connection) {
    if (this.connection == null) {
      this.connection = connection;
    }
  }

  static getRepository(): Repository<Question> {
    return this.connection.getRepository(Question);
  }
}
