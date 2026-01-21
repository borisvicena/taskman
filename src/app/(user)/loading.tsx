import { Alert, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

export default function LoadingProfile() {
  return (
    <Alert>
      <Spinner />
      <AlertTitle>Loading profile...</AlertTitle>
    </Alert>
  );
}
