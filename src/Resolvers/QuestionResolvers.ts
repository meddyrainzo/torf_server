import { TorfContext } from '../context/TorfContext';
import { Question } from '../entities/Question';
import { User } from '../entities/User';
import { CreateQuestionInput } from '../input/CreateQuestionInput';
import { authMiddleware } from '../middleware/authMiddleware';
import { getConnection } from 'typeorm';
import {
  Query,
  UseMiddleware,
  Resolver,
  Arg,
  Int,
  Ctx,
  Mutation,
} from 'type-graphql';

@Resolver()
export class QuestionResolver {
  @Query(() => [Question])
  @UseMiddleware(authMiddleware)
  async getQuestions(@Ctx() context: TorfContext) {
    const repository = getConnection().getRepository(Question);
    const questions = await repository.find({
      relations: ['askedBy', 'answeredBy'],
    });
    return questions.map((q) => {
      var answeredByYou = q.answeredBy.find(
        (u) => u.username === context.username!
      );
      q.answeredByYou = answeredByYou ? true : false;
      return q;
    });
  }

  @Mutation(() => Question)
  @UseMiddleware(authMiddleware)
  async createQuestion(
    @Arg('question') input: CreateQuestionInput,
    @Ctx() context: TorfContext
  ) {
    const askedBy = await User.findOne({ username: context.username! });
    const { question, answer } = input;
    const createdQuestion = Question.create({ question, answer, askedBy });
    try {
      return await createdQuestion.save();
    } catch (err) {
      const errorMessage = 'Failed to create the question ';
      console.error(`${errorMessage}:: ${err}`);
      throw new Error(errorMessage);
    }
  }

  @Mutation(() => Question)
  @UseMiddleware(authMiddleware)
  async answerQuestion(
    @Arg('questionId', () => Int) id: number,
    @Arg('answer') answer: boolean,
    @Ctx() context: TorfContext
  ) {
    const question = await Question.findOne(
      { id },
      { relations: ['answeredBy'] }
    );
    if (!question) {
      throw new Error('Question does not exist');
    }
    const answeredBy = await User.findOne({ username: context.username! });
    question.answeredBy.push(answeredBy!);

    // Check if answer was correct
    if (question.answer === answer) {
      answeredBy!.answeredCorrectly++;
    }

    try {
      await answeredBy!.save();
      const answeredQuestion = await question.save();
      answeredQuestion.answeredByYou = true;
      return answeredQuestion;
    } catch (err) {
      const errorMessage =
        'An error occured while trying to answer the  question';
      console.error(`${errorMessage}:: ${err}`);
      throw new Error(errorMessage);
    }
  }
}
