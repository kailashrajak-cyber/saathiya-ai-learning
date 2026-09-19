import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface SavedOutput {
  id: string;
  title: string;
  file_name: string | null;
  content: string;
  source: string;
  created_at: string;
}

export const listSavedOutputs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SavedOutput[]> => {
    const { data, error } = await context.supabase
      .from("saved_outputs")
      .select("id, title, file_name, content, source, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const saveOutput = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        title: z.string().min(1).max(300),
        content: z.string().min(1).max(40000),
        fileName: z.string().max(200).nullable().default(null),
        source: z.string().max(40).default("workspace"),
      })
      .parse(input),
  )
  .handler(async ({ data, context }): Promise<SavedOutput> => {
    const { data: row, error } = await context.supabase
      .from("saved_outputs")
      .insert({
        user_id: context.userId,
        title: data.title,
        content: data.content,
        file_name: data.fileName,
        source: data.source,
      })
      .select("id, title, file_name, content, source, created_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteSavedOutput = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("saved_outputs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
