import SideBar from "@/components/SideBar";
import AppInitializer from "@/hooks/loadUserFromLocalStorage";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <main className="w-full h-full">
        <div className="flex justify-start absolute left-0 top-0 overflow-auto w-full ">
          <SideBar />
        </div>
        <AppInitializer />
      </main>
      {children}
    </>
  );
};

export default Layout;
