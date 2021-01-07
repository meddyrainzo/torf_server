import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, BaseEntity } from 'typeorm';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field()
  @Column('text')
  name: String;

  @Field()
  @Column('text')
  username: String;

  @Column('text')
  password: String;
}
