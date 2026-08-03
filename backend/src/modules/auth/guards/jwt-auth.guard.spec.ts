import { JwtAuthGuard } from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: any;
  let mockContext: any;
  let mockHandler: any;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    };
    guard = new JwtAuthGuard(reflector);
    mockHandler = {};

    mockContext = {
      getHandler: () => mockHandler,
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    };
  });

  it('should allow access when @Public() is set', () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    const result = guard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      mockHandler,
      mockContext.getClass(),
    ]);
  });

  it('should call super.canActivate when @Public() is not set', () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    const superSpy = jest.spyOn(JwtAuthGuard.prototype as any, 'canActivate').mockReturnValue(true);

    const result = guard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(superSpy).toHaveBeenCalledWith(mockContext);

    superSpy.mockRestore();
  });
});
