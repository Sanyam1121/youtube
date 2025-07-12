import { v } from "convex/values";
import { query, mutation, action, internalQuery, internalMutation, internalAction } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const getConversations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    
    return await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    // Verify user owns this conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== userId) {
      throw new Error("Conversation not found");
    }
    
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();
  },
});

export const createConversation = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.db.insert("conversations", {
      userId,
      title: args.title,
    });
  },
});

export const sendMessage = mutation({
  args: { 
    conversationId: v.id("conversations"),
    content: v.string() 
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    // Verify user owns this conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== userId) {
      throw new Error("Conversation not found");
    }
    
    // Insert user message
    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      content: args.content,
      role: "user",
      userId,
    });
    
    // Schedule AI response
    await ctx.scheduler.runAfter(0, internal.chat.generateAIResponse, {
      conversationId: args.conversationId,
    });
  },
});

export const generateAIResponse = internalAction({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    // Get conversation history
    const messages = await ctx.runQuery(internal.chat.getConversationHistory, {
      conversationId: args.conversationId,
    });
    
    // Format messages for OpenAI
    const openaiMessages = messages.map((msg: any) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: openaiMessages,
        max_tokens: 1000,
        temperature: 0.7,
      });
      
      const aiResponse = response.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error("No response from AI");
      }
      
      // Save AI response
      await ctx.runMutation(internal.chat.saveAIMessage, {
        conversationId: args.conversationId,
        content: aiResponse,
      });
    } catch (error) {
      console.error("AI response error:", error);
      // Save error message
      await ctx.runMutation(internal.chat.saveAIMessage, {
        conversationId: args.conversationId,
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
      });
    }
  },
});

export const getConversationHistory = internalQuery({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();
  },
});

export const saveAIMessage = internalMutation({
  args: { 
    conversationId: v.id("conversations"),
    content: v.string() 
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      content: args.content,
      role: "assistant",
    });
  },
});
