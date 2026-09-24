import Link from "next/link";
import { Swatch } from "@/components/swatch";

export default function NotFound() {
  return (
    <section className="shell grid min-h-[80vh] place-items-center pt-24 text-center">
      <div>
        <Swatch tex="nero" seed={4} className="mx-auto size-40 rotate-6 rounded-md shadow-2xl" eager />
        <h1 className="display mt-10 text-5xl">This surface has not been laid yet.</h1>
        <p className="mt-4 text-fog">The page you asked for does not exist.</p>
        <Link href="/" className="btn btn-ghost mt-8">
          SURMAT
        </Link>
      </div>
    </section>
  );
}
