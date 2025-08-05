import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { usersSync as userSyncTable } from "drizzle-orm/neon";
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";

const { createInsertSchema, createSelectSchema, createUpdateSchema } =
  createSchemaFactory({ zodInstance: z });

export { userSyncTable };

export const contactsTable = pgTable("contacts", {
  id: uuid("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userSyncTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  tel: text("tel"),
  title: text("title"),
  company: text("company"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const selectContactSchema = createSelectSchema(contactsTable);
export const createContactSchema = createInsertSchema(contactsTable).omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
});
export const updateContactSchema = createUpdateSchema(contactsTable).omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type Contact = Omit<
  z.infer<typeof selectContactSchema>,
  "userId" | "createdAt" | "updatedAt"
>;
export type CreateContact = z.infer<typeof createContactSchema>;
export type UpdateContact = z.infer<typeof updateContactSchema>;
