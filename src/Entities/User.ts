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

  @Field(() => [Question])
  @OneToMany(() => Question, (question) => question.askedBy)
  asked: Question[];

  @Field(() => Int, { defaultValue: 0 })
  @Column({ default: 0 })
  answeredCorrectly: number;

  @Field(() => Int, { defaultValue: 0 })
  @ManyToMany(() => Question, (question) => question.answeredBy)
  answered: Question[];
}
