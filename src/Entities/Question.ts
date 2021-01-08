import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class Question extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text')
  question: string;

  @Field()
  @Column('boolean')
  answer: boolean;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.asked)
  askedBy: User;

  @ManyToMany(() => User, (user) => user.answered, { cascade: true })
  @JoinTable()
  answeredBy: User[];

  @Field({ defaultValue: false })
  answeredByYou: boolean;
}
