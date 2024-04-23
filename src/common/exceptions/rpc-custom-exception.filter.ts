import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    // return throwError(() => exception.getError());
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const rpcError = exception.getError();

    if (rpcError.toString().includes('Empty respose')) {
      return response.status(500).json({
        status: 500,
        message: rpcError
          .toString()
          .substring(0, rpcError.toString().indexOf('(') - 1),
      });
    }

    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const status = isNaN(+rpcError.status) ? 400 : rpcError.status;
      response.status(status).json({
        error: rpcError,
      });
    }
  }
}
