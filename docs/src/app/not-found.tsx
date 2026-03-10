import { BookOpenIcon, HomeIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

const NotFoundPage = () => (
  <Empty>
    <EmptyHeader>
      <EmptyTitle className="font-black font-mono text-8xl">404</EmptyTitle>
      <EmptyDescription className="text-nowrap">
        The page you&apos;re looking for might have been <br />
        moved or doesn&apos;t exist.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/">
            <HomeIcon />
            Go Home
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href="/docs">
            <BookOpenIcon />
            Explore Docs
          </Link>
        </Button>
      </div>
    </EmptyContent>
  </Empty>
);

export default NotFoundPage;
