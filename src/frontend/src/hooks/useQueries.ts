import { useMutation } from "@tanstack/react-query";
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
