import { createCollection } from "@tanstack/react-db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { selectContactSchema } from "@/schema";
import {
  createContactAction,
  updateContactAction,
  deleteContactAction,
} from "@/actions/contacts";

export { type Contact } from "@/schema";

export const contactCollection = createCollection(
  electricCollectionOptions({
    id: "contacts",
    shapeOptions: {
      url: new URL(
        `/api/shape`,
        typeof window !== `undefined`
          ? window.location.origin
          : `http://localhost:3000`,
      ).toString(),
      params: {
        table: "contacts",
      },
    },
    schema: selectContactSchema.omit({
      userId: true,
      createdAt: true,
      updatedAt: true,
    }),
    getKey: (item) => item.id,

    // Add server action handlers for mutations
    onInsert: async ({ transaction }) => {
      const results = [];

      for (const mutation of transaction.mutations) {
        const contactData = mutation.modified;

        const result = await createContactAction(contactData);

        if (!result.success) {
          throw new Error(result.error || "Failed to create contact");
        }

        results.push(Date.now()); // Use timestamp as txid
      }

      return { txid: results };
    },

    onUpdate: async ({ transaction }) => {
      const results = [];
      for (const mutation of transaction.mutations) {
        const contactId = String(mutation.key);
        const changes = mutation.changes;

        const { id, ...updateData } = changes;

        const result = await updateContactAction(contactId, updateData);

        if (!result.success) {
          throw new Error(result.error || "Failed to update contact");
        }

        results.push(Date.now()); // Use timestamp as txid
      }

      return { txid: results };
    },

    onDelete: async ({ transaction }) => {
      const results = [];

      for (const mutation of transaction.mutations) {
        const contactId = String(mutation.key);

        const result = await deleteContactAction(contactId);

        if (!result.success) {
          throw new Error(result.error || "Failed to delete contact");
        }

        results.push(Date.now()); // Use timestamp as txid
      }

      return { txid: results };
    },
  }),
);
