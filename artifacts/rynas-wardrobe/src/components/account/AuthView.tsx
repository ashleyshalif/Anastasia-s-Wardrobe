"use client";

import React from "react";
import { SignInView } from "./SignInView";

export function AuthView({ onSuccess }: { onSuccess?: () => void }) {
  return <SignInView onSuccess={onSuccess} />;
}

export default AuthView;
