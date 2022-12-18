import { FieldError } from '../generated/graphql';

export const mapToErrors = (errors: FieldError[]) => {
    const errorMap: Record<string, string> = {};

    for (const error of errors) {
        errorMap[error.field] = error.message;
    }

    return errorMap;
};
