import { Alert, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <Alert>
      <Spinner />
      <AlertTitle>Loading projects...</AlertTitle>
    </Alert>
  );
}
