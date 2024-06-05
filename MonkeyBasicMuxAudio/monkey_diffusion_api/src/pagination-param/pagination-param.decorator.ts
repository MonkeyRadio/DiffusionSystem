import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface Pagination {
    page: number;
    limit: number;
}

export const PaginationParams = createParamDecorator((data, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();
    const page = parseInt(req.query.page as string || '0');
    const limit = parseInt(req.query.limit as string || '10');

    if (isNaN(page) || page < 0 || isNaN(limit) || limit < 0) {
        throw new BadRequestException('Invalid pagination params');
    }

    if (limit > 100) {
        throw new BadRequestException('Limit should be less than 100');
    }

    return { 
      page,
      limit,
    };
});
