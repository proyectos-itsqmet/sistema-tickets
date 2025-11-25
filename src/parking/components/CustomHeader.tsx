import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const CustomHeader = () => {
  return (
    <div className="sticky top-0 z-10 bg-background flex items-center justify-between p-2 border-b">
      <SidebarTrigger />
      <Avatar>
        <AvatarImage src="/src/assets/images/avatar.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
};
