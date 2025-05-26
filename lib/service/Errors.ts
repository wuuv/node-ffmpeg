class ErrorMatcher {
  constructor(
    protected readonly errorPattern: string | RegExp,
    public readonly errorConstructor: new () => Error
  ) {}

  matches(error: string): boolean {
    console.log(error, this.errorPattern)
    return typeof this.errorPattern === 'string'
      ? error.includes(this.errorPattern)
      : this.errorPattern.test(error);
  }
}

export default class ErrorFactory {
  private static errorMatchers: ErrorMatcher[] = [];

  static registerError(
    pattern: string | RegExp,
    errorConstructor: new () => Error
  ): void {
    this.errorMatchers.push(new ErrorMatcher(pattern, errorConstructor));
  }

  static matchError(errorMessages: string[]): Error{
    for (const message of errorMessages) {
      for (const matcher of this.errorMatchers) {
        if (matcher.matches(message)) {
          return new matcher.errorConstructor();
        }
      }
    }
    return new Error('unknown');
  }
}

class FileAlreadyExistsError extends Error {
  constructor() {
    super('already exists');
    this.name = 'FileAlreadyExistsError';
  }
}

class PermissionDeniedError extends Error {
  constructor() {
    super('Permission denied');
    this.name = 'PermissionDeniedError';
  }
}

ErrorFactory.registerError('already exist', FileAlreadyExistsError);
ErrorFactory.registerError('permission denied', PermissionDeniedError);