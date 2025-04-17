"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Label = React.forwardRef<
  React.ElementRef<typeof motion.label>,
  React.ComponentPropsWithoutRef<typeof motion.label>
>(({ className, ...props }, ref) => (
  <motion.label
    ref={ref}
    className={cn(
      "text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
