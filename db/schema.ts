import { relations } from 'drizzle-orm';
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import uuid from 'react-native-uuid';

export const lists = sqliteTable('lists', {
  id: text('id').primaryKey().default(uuid.v4()),
  name: text('name').notNull(),
});

export const items = sqliteTable('items', {
  id: text('id').primaryKey().default(uuid.v4()),
  name: text('name').notNull(),
});

export const listsToItems = sqliteTable(
  'lists_items',
  {
    id: text('id').primaryKey().default(uuid.v4()),
    listId: text('listId')
      .notNull()
      .references(() => lists.id),
    itemId: text('itemId')
      .notNull()
      .references(() => items.id),
  },
  t => [primaryKey({ columns: [t.itemId, t.listId] })]
);

export const listsRelations = relations(lists, ({ many }) => ({
  listsToItems: many(listsToItems),
}));
export const itemsRelations = relations(items, ({ many }) => ({
  listsToItems: many(listsToItems),
}));

export const defineRelations = relations(listsToItems, ({ one }) => ({
  list: one(lists, {
    fields: [listsToItems.listId],
    references: [lists.id],
  }),
  item: one(items, {
    fields: [listsToItems.itemId],
    references: [items.id],
  }),
}));
