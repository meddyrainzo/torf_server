import { Field, Int, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Question } from './Question';

@ObjectType()
@Entity('users')
@Unique(['username'])
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column('text')
  username: string;

  @Column('text')
  password: string;

  @OneToMany(() => Question, (question) => question.askedBy)
  asked: Question[];

  @ManyToMany(() => Question, (question) => question.answeredBy)
  answered: Question[];
}
