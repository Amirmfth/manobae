import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/server/session";

export default async function Home() {
  redirect((await getSessionUser()) ? "/today" : "/enter");
}
