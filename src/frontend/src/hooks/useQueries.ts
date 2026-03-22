import { useMutation, useQuery } from "@tanstack/react-query";
import type { Contact } from "../backend";
import { useActor } from "./useActor";

export function useSubmitContact() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (contact: Contact) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitContact(contact);
    },
  });
}

export function useGetAllSubmissions(enabled: boolean) {
  const { actor, isFetching } = useActor();
  return useQuery<Contact[]>({
    queryKey: ["submissions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubmissions();
    },
    enabled: enabled && !!actor && !isFetching,
  });
}
