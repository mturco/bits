import { supabase } from "./user.server";

export type Bit = {
  id: string;
  created_at: string;
  content: string;
  profile_id: string;
};

export async function getAllBits(
  userId: Bit["profile_id"]
): Promise<Bit[] | null> {
  const { data } = await supabase
    .from("bits")
    .select("id, created_at, content, profile_id")
    .eq("profile_id", userId);

  return data;
}

export async function createBit({
  content,
  profile_id,
}: Pick<Bit, "content" | "profile_id">) {
  const { data, error } = await supabase
    .from("bits")
    .insert({ content, profile_id })
    .select()
    .single();

  if (!error) {
    return data;
  }

  return null;
}

export async function deleteBit(id: Bit["id"]) {
  const { error } = await supabase.from("bits").delete().eq("id", id);

  if (!error) {
    return {};
  }

  return null;
}

export async function getBit({
  id,
  profile_id,
}: Pick<Bit, "id" | "profile_id">): Promise<Bit | null> {
  const { data, error } = await supabase
    .from("bits")
    .select("id, created_at, content, profile_id")
    .match({ id, profile_id })
    .single();

  if (!error) {
    return data;
  }

  return null;
}
