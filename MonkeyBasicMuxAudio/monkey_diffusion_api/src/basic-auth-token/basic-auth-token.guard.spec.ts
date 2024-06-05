import { BasicAuthTokenGuard } from './basic-auth-token.guard';

describe('BasicAuthTokenGuard', () => {
  it('should be defined', () => {
    expect(new BasicAuthTokenGuard()).toBeDefined();
  });
});
