import {BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut,} from "lucide-react"

import {Avatar, AvatarFallback, AvatarImage,} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useRouter} from "next/navigation";
import {supabase} from "@/lib/supabase/client";
import {toast} from "sonner";
import {User} from "@/hooks/use-user";
import {getInitials} from "@/lib/utils";
import Link from "next/link";

export function NavUser({
  user,
}: {
  user: User
}) {
  const router = useRouter();

  const handleLogout = async () => {
    const {error} = await supabase.auth.signOut();
    if (error) {
      toast.error("Error while logging out: " + error.message);
    } else {
      router.replace("/login");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="w-full rounded-md outline-none ring-ring hover:bg-accent focus-visible:ring-0 data-[state=open]:bg-accent">
        <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm transition-all">
          <Avatar className="h-7 w-7 rounded-md border">
            <AvatarImage
              src={user.avatar}
              alt={user.name}
              className="animate-in fade-in-50 zoom-in-90"
            />
            <AvatarFallback className="rounded-md">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 leading-none">
            <div className="font-medium">{user.name}</div>
            <div className="overflow-hidden text-xs text-muted-foreground">
              <div className="line-clamp-1">{user.email}</div>
            </div>
          </div>
          <ChevronsUpDown className="ml-auto mr-0.5 h-4 w-4 text-muted-foreground/50"/>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        side="right"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <Link className="flex items-center gap-2 px-1 py-1.5 text-left text-sm transition-all"
                href="/settings/profile">
            <Avatar className="h-7 w-7 rounded-md">
              <AvatarImage src={user.avatar} alt={user.name}/>
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1">
              <div className="font-medium">{user.name}</div>
              <div className="overflow-hidden text-xs text-muted-foreground">
                <div className="line-clamp-1">{user.email}</div>
              </div>
            </div>
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuGroup>
          <Link href="/settings/account">
            <DropdownMenuItem className="gap-2">
              <BadgeCheck className="h-4 w-4 text-muted-foreground"/>
              Account
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground"/>
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Bell className="h-4 w-4 text-muted-foreground"/>
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator/>
        <DropdownMenuItem className="gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4 text-muted-foreground"/>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
