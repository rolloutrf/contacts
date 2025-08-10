import * as React from "react"
import { cva } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        secondary:
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        destructive:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        outline: "border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 bg-transparent",
        success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Badge = React.forwardRef(({ className, variant, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      className={cn(badgeVariants({ variant }), className)}
      ref={ref}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge, badgeVariants }