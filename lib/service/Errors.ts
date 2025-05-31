
export class DefaultError extends Error {
  constructor(
  ) {
    super(
      'unknown error'
    );
  }
}

export class FileAlreadyExists extends Error {
  constructor() {
    super(
      'already exists'
    )
  }
}

export class NoFileOrDirecotry extends Error {
  constructor() {
    super(
      'no such file or directory'
    )
  }
}


export default class ErrorFactory {
  private static errors: Array<Error> = [
    new FileAlreadyExists(),
  ];

  static matchError(errorMessages: string[]): Error {
    for (const message of errorMessages) {
      for (const error of this.errors) {
        if (message.includes(error.message.toLowerCase())) {
          return error;
        }
      }
    }
    return new DefaultError();
  }
}