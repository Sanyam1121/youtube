import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  conversations: defineTable({
    userId: v.id("users"),
    title: v.string(),
  }).index("by_user", ["userId"]),
  
  messages: defineTable({
    conversationId: v.id("conversations"),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    userId: v.optional(v.id("users")),
  }).index("by_conversation", ["conversationId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
