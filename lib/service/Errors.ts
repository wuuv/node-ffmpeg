
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


export default class ErrorFactory {
  private static errors: Array<Error> = [
    new FileAlreadyExists(),
  ];

  static matchError(errorMessages: string[]): Error {
    for (const message of errorMessages) {
      for (const error of this.errors) {
        console.log(error.message);
        if (message.includes(error.message)) {
          return error;
        }
      }
    }
    return new DefaultError();
  }
}