import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function userRole() {
  return (
    <section className="min-h-dvh flex items-center justify-center">
      <Card className="w-[350px] ">
        <CardHeader>
          <CardTitle>
            <img src="/logo.svg" alt="" />
          </CardTitle>
          {/* <CardDescription className="flex items-center">
            Your Role
          </CardDescription> */}
        </CardHeader>

        <CardFooter className="flex justify-between">
          <Button>Faculty</Button>
          <Button>Admin</Button>
        </CardFooter>
      </Card>
    </section>
  );
}
