import { ClientOnly } from "@/components/client-only";
import { stackServerApp } from "../stack";
import { ContactsList } from "@/components/contacts-list";

export default async function Home() {
  const user = await stackServerApp.getUser({ or: "redirect" });

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ClientOnly>
          <div className="w-full max-w-6xl mx-auto">
            <ContactsList />
          </div>
        </ClientOnly>
      </div>
    </main>
  );
}
