import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateQuestionInput {
  @Field()
  question: string;

  @Field({ defaultValue: false })
  answer: boolean;
}
