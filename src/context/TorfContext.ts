import { Request, Response } from 'express';

export interface TorfContext {
  request: Request;
  response: Response;
  username?: string;
}
