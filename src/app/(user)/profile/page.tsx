import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Loader2,
  User,
  Mail,
  Calendar,
  Clock,
  ShoppingBag,
  Package,
  Users,
  CheckCircle2,
} from "lucide-react";
import { getUserData } from "@/lib/dal";
import { getInitials } from "@/lib/utils";
import { redirect } from "next/navigation";

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

export default async function ProfilePage() {
  const user = await getUserData();

  if (!user) {
    redirect("/login");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-medium">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-1">
            <h2 className="text-xl font-semibold text-foreground">
              {user.name}
            </h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <CheckCircle2 className="h-3 w-3" />
                Active
              </span>
              <span className="text-xs text-muted-foreground">
                Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-1 sm:grid-cols-2">
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow
            icon={Calendar}
            label="Joined"
            value={new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          />
          <InfoRow
            icon={Clock}
            label="Last active"
            value={new Date().toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          />
          <InfoRow icon={User} label="Account type" value="Standard" />
        </div>
      </CardContent>
    </Card>
  );
}
