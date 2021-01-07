import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['token', 'username'])
export class RefreshToken extends BaseEntity {
  // id, token, userId, expiryDate, isRevoked
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  @Index()
  token: string;

  @Column()
  username: string;

  @Column('timestamptz')
  expiryDate: Date;

  @Column('boolean', { default: false })
  isRevoked: boolean;
}
