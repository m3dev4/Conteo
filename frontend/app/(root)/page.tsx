import SideBar from "@/components/SideBar";
import { ModeToggle } from "@/components/theme";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex absolute right-0 top-0 px-5 mt-5">
        <ModeToggle />
      </div>
    </main>
  );
}
