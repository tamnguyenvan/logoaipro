import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action";
import { InvalidCredentialsError, UserAlreadyExistsError, AuthError } from "@/utils/errors/auth";

export const actionClient = createSafeActionClient({

  handleServerError(e) {
    if (e instanceof InvalidCredentialsError) {
      return e.message;
    } else if (e instanceof UserAlreadyExistsError) {
      return e.message;
    } else if (e instanceof AuthError) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});