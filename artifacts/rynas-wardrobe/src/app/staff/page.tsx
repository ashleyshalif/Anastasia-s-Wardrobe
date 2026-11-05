import { Metadata } from "next";
import { StaffPortalView } from "@/components/staff/StaffPortalView";

export const metadata: Metadata = {
  title: "Atelier Staff Operations & Fulfillment Console | Ryna's Wardrobe",
  description:
    "Internal staff portal for Ryna's Wardrobe atelier operations: granular RBAC order fulfillment, customer concierge inquiries, and inventory management.",
};

export default function StaffPage() {
  return <StaffPortalView />;
}

