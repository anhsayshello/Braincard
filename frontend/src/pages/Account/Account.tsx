import Metadata from "@/components/Metadata";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useProfileStore } from "@/stores/useProfileStore";
import { useMemo } from "react";
import { Typewriter } from "react-simple-typewriter";
export default function Account() {
  const profile = useProfileStore((state) => state.profile);
  const userInfo = useMemo(
    () => [
      {
        field: "id",
        info: profile?.id,
      },
      {
        field: "username",
        info: profile?.username,
      },
      {
        field: "name",
        info: profile?.name,
      },
      {
        field: "password",
        info: "i forgot to save",
      },
      {
        field: "my apologies",
        info: "this page hasn't been completed yet",
      },
    ],
    [profile?.id, profile?.name, profile?.username]
  );
  const typewriterWords = useMemo(
    () => userInfo.map((item) => `${item.field}: ${item.info}`),
    [userInfo]
  );
  return (
    <>
      <Metadata title="Account | BrainCard" content="account" />
      <div className="py-10">
        <Card className="px-4 ">
          <div className="flex items-center gap-4">
            <Avatar className="rounded-lg">
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <Typewriter
                words={typewriterWords}
                typeSpeed={50}
                deleteSpeed={30}
                delaySpeed={1000}
                loop={0}
              />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
