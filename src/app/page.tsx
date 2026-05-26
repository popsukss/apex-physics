import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Master Physics Olympiad
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        Structured roadmap, curated resources, and a community Q&A — built by
        an IPhO bronze medalist for aspiring physicists.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link href="/roadmap" className={buttonVariants({ size: "lg" })}>
          Start the Roadmap
        </Link>
        <Link href="/community" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Join the Discussion
        </Link>
      </div>
    </div>
  );
}
