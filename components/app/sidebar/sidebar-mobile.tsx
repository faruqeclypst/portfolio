import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion";
import { FadeIn } from "@/components/atoms/fade-in";
import { NAVIGATION } from "@/constants";
import { AnimatePresence } from "motion/react";
import Link from "next/link";
import React, { Fragment } from "react";

interface AppSidebarMobileProps {
  isOpen: boolean;
  toggleNavbar: () => void;
}

export default function AppSidebarMobile({
  isOpen,
  toggleNavbar,
}: AppSidebarMobileProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <FadeIn className="fixed z-[100] left-0 right-0 top-[60px] bottom-[27px] bg-background p-5 overflow-y-auto">
          {NAVIGATION.map((item) => (
            <Fragment key={item.title}>
              {item.children ? (
                <Accordion type="single" collapsible>
                  <AccordionItem value={item.title}>
                    <AccordionTrigger className="text-lg font-normal text-foreground">
                      {item.content}
                    </AccordionTrigger>
                    <AccordionContent>
                      {item.children.map((child) => (
                        <Link
                          href={child.path}
                          key={child.name}
                          className="block py-2 first:pt-0 last:pb-0 border-b last:border-b-0 text-muted-foreground hover:underline"
                          onClick={toggleNavbar}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Link
                  href={item.path}
                  className="block text-foreground text-lg py-4 first:pt-0 last:pb-0"
                  onClick={toggleNavbar}
                >
                  {item.content}
                </Link>
              )}
            </Fragment>
          ))}
        </FadeIn>
      )}
    </AnimatePresence>
  );
}
