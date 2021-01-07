import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  question: string;

  @Column('boolean')
  answer: boolean;

  @ManyToOne(() => User, (user) => user.asked)
  askedBy: User;

  @ManyToMany(() => User, (user) => user.answered)
  answeredBy: User[];
}
