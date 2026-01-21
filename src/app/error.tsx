"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Something went wrong!</AlertTitle>
      <AlertDescription>
        <Button size={"sm"} variant={"destructive"} onClick={() => reset()}>
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}
