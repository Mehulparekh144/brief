"use client";
import { useRouter } from "next/navigation";
import { ShimmerButton } from "@/components/ui/shimmer-button";

/** Magic UI ShimmerButton that navigates (it renders a <button>, so it cannot be a link itself). */
export function ShimmerLink({ href, children }: { href: string; children: string }) {
  const router = useRouter();
  return (
    <ShimmerButton background="#14181D" shimmerColor="#F7E36A" aria-label={children} className="px-6 py-3 text-base font-semibold" onClick={() => (href.startsWith("/auth/") ? window.location.assign(href) : router.push(href))}>
      {children}
    </ShimmerButton>
  );
}
