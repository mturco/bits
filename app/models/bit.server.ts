import { supabase } from "./user.server";
import { formatISO } from "date-fns";

export type Bit = {
  id: string;
  created_at: string;
  content: string;
  profile_id: string;
  updated_at: string;
};

export async function getAllBits(
  userId: Bit["profile_id"]
): Promise<Bit[] | null> {
  const { data } = await supabase
    .from("bits")
    .select("id, created_at, content, profile_id, updated_at")
    .order("updated_at", { ascending: false })
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

  console.error(error);
  return null;
}

export async function updateBit({
  id,
  content,
  profile_id,
}: Pick<Bit, "id" | "content" | "profile_id">) {
  const { data, error } = await supabase
    .from("bits")
    .update({ content, updated_at: formatISO(new Date()) })
    .match({ id, profile_id })
    .select()
    .single();

  if (!error) {
    return data;
  }

  console.error(error);
  return null;
}

export async function deleteBit({
  id,
  profile_id,
}: Pick<Bit, "id" | "profile_id">) {
  const { error } = await supabase
    .from("bits")
    .delete()
    .match({ id, profile_id });

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
    .select("id, created_at, content, profile_id, updated_at")
    .match({ id, profile_id })
    .single();

  if (!error) {
    return data;
  }

  return null;
}

export async function getBitsMatching(
  query: string,
  userId: Bit["profile_id"]
): Promise<Bit[] | null> {
  const { data, error } = await supabase
    .rpc("search_bits", {
      search_query: query.toLowerCase(),
      user_id: userId,
    })
    .order("updated_at", { ascending: false });

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
