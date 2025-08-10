import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const ChevronDownIcon = React.forwardRef(({ className, ...props }, ref) => (
  <ChevronDown ref={ref} className={cn("h-4 w-4", className)} {...props} />
))
ChevronDownIcon.displayName = "ChevronDownIcon"

export { ChevronDownIcon }
