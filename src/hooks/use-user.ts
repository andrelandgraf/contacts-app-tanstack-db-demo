import { useUser } from "@stackframe/stack";
import invariant from "tiny-invariant";

export function useRequiredUser() {
  const user = useUser();
  invariant(
    user,
    "User is required for this operation. Please ensure you are authenticated.",
  );
  return user;
}
