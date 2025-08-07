import {
  Bell,
  ChevronUp,
  Home,
  Ghost,
  Inbox,
  Search,
  Settings,
  User2,
  OctagonAlert,
  LogOut,
  BadgeCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router";
import path from "@/constants/path";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import classNames from "classnames";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useAuthenticatedStore } from "@/stores/useAuthenticatedStore";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authApi from "@/apis/auth.api";
import { Badge } from "../ui/badge";
import notificationApi from "@/apis/notification.api";
import useUserQuery from "@/hooks/useUserQuery";

const items = [
  {
    title: "Home",
    url: path.home,
    icon: Home,
    tooltip: "Home",
  },
  {
    title: "Deck",
    url: path.deck,
    icon: Ghost,
    tooltip: "Deck",
  },
  {
    title: "Search",
    url: path.allCards,
    icon: Search,
    tooltip: "Search",
  },
  {
    title: "Feedback",
    url: path.feedback,
    icon: Inbox,
    tooltip: "Feedback",
  },
  {
    title: "Notifications",
    url: path.notifications,
    icon: Bell,
    tooltip: "Notifications",
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    tooltip: "Not available",
  },
];

export default function AppSidebar() {
  const { state } = useSidebar();
  const isAuthenticated = useAuthenticatedStore(
    (state) => state.isAuthenticated
  );
  const { data: dataUnreadNotifications } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: () => notificationApi.getUnRead(),
    enabled: isAuthenticated,
  });
  console.log("re-render");

  const { data: dataUser } = useUserQuery();
  const name = dataUser?.data?.name ?? "unnamed";
  console.log(dataUser);

  const queryClient = useQueryClient();
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: (data) => {
      console.log("log out", data);
      queryClient.removeQueries({ queryKey: ["unreadCount"] });
      queryClient.removeQueries({ queryKey: ["stats"] });
      nagigate("/");
    },
  });
  const nagigate = useNavigate();
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Project</SidebarGroupLabel>
            <SidebarGroupAction>
              <HoverCard openDelay={200}>
                <HoverCardTrigger>
                  <OctagonAlert
                    size={18}
                    className="text-sidebar-foreground/70"
                  />
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">@anhsayshello</h4>
                    <p className="text-[13px]">
                      Flashcard Project for Effective Learning: A study tool
                      leveraging active recall and spaced repetition, developed
                      by Duc Anh.
                    </p>
                    <div className="text-muted-foreground text-xs">
                      Released on July 18, 2025.
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </SidebarGroupAction>
            <SidebarGroupContent />
          </SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="my-1">
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <Tooltip>
                        <TooltipTrigger>
                          {item.title !== "Settings" ? (
                            item.title === "Notifications" &&
                            dataUnreadNotifications &&
                            dataUnreadNotifications?.data.unreadCount > 0 ? (
                              <div className="relative">
                                <item.icon size={20} />
                                <Badge
                                  variant="destructive"
                                  className="absolute w-4 h-4 -top-1.5 -right-1.5 text-[11px]"
                                >
                                  {dataUnreadNotifications?.data.unreadCount}
                                </Badge>
                              </div>
                            ) : (
                              <item.icon size={20} />
                            )
                          ) : (
                            <div className="text-black/30">
                              <item.icon size={20} />
                            </div>
                          )}
                        </TooltipTrigger>
                        <TooltipContent
                          className={classNames("hidden", {
                            block: state === "collapsed",
                          })}
                          side="right"
                        >
                          <p>{item.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                      <span
                        className={
                          item.title !== "Settings" ? "" : "text-black/40"
                        }
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {isAuthenticated ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {name}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <Link to={path.account}>
                    <DropdownMenuItem className="flex items-end gap-2.5">
                      <BadgeCheck />
                      <div>Account</div>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-end gap-2.5"
                  >
                    <LogOut />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <Link to={path.login}>
            <Button variant="outline" className="w-full py-2 cursor-pointer">
              Login
            </Button>
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
