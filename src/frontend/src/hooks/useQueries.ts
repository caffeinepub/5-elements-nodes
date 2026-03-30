import { useMutation, useQuery } from "@tanstack/react-query";
import type { ContactSubmission } from "../backend";
import { useActor } from "./useActor";

export function useSubmitContact() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      message,
    }: {
      name: string;
      email: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitContact(name, email, message);
    },
  });
}

export function useGetAllSubmissions(enabled: boolean) {
  const { actor, isFetching } = useActor();
  return useQuery<ContactSubmission[] | null>({
    queryKey: ["submissions"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSubmissions("5elements");
    },
    enabled: enabled && !!actor && !isFetching,
  });
}
