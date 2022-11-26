import { UsernamePasswordInput } from "src/resolvers/user";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "username length must be greater than 2",
      },
    ];
  }

  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "username cannot include `@`",
      },
    ];
  }
  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "email address must include `@`",
      },
    ];
  }
  if (options.email.length <= 2) {
    return [
      {
        field: "email",
        message: "email length must be greater than 2",
      },
    ];
  }
  if (options.password.length <= 2) {
    return [
      {
        field: "password",
        message: "password length must be greater than 2",
      },
    ];
  }
  return null;
};
