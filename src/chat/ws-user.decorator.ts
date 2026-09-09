import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedSocket } from './ws.guard';

export const WsUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient<AuthenticatedSocket>();
    return client.user.sub;
  },
);
