import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ApiCustomDocs = (params: {
  summary?: string;
  description?: {
    title?: string;
    contents?: string[];
  };
  requestType?: any;
  responseType?: any;
}): MethodDecorator => {
  const apiOperation = ApiOperation({
    summary: params.summary,
    description:
      params?.description?.title +
        (params?.description?.title ? '\n\n' : '') +
        params?.description?.contents
          ?.map((str) => ' - ' + str)
          ?.join('\n\n') || '',
  });

  const apiBody = ApiBody({
    type: params.requestType,
  });

  const response200 = ApiResponse({
    status: 200,
    type: params.responseType,
  });

  return applyDecorators(apiOperation, response200, apiBody);
};
