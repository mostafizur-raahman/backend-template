import { BadRequestException, ValidationError } from '@nestjs/common';

/**
 * Extracts validation error messages recursively.
 * @param errors Array of validation errors
 * @returns Flattened array of error messages
 */
export const validationExceptionFactoryPipe = (
  errors: ValidationError[],
): BadRequestException => {
  const extractErrors = (validationErrors: ValidationError[]): string[] =>
    validationErrors.reduce<string[]>((messages, error) => {
      if (error.constraints) {
        // Add constraint messages
        messages.push(...Object.values(error.constraints));
      }
      if (error.children && error.children.length > 0) {
        // Recursively process child errors
        messages.push(...extractErrors(error.children));
      }
      return messages;
    }, []);

  const errorMessages = extractErrors(errors);
  return new BadRequestException({
    status: 400,
    message: errorMessages,
  });
};
