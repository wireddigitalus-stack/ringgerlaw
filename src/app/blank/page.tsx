import { redirect } from "next/navigation";

export default function LegacyBlankRedirectPage() {
  redirect("/intake");
}
