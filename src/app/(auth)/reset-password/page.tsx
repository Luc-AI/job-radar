"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle } from "lucide-react";
import { resetPassword, type AuthState } from "../actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const initialState: AuthState = {};

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(
    resetPassword,
    initialState
  );

  if (state.success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Password updated
          </CardTitle>
          <CardDescription>
            Your password has been successfully reset.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button className="w-full" size="lg">
              Sign in with new password
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">
          Set new password
        </CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {state.error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="At least 8 characters"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Confirm your password"
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="animate-spin" />
                Updating password...
              </>
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
