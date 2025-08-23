'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      status: {
        pending: "status-pending",
        processing: "status-processing", 
        success: "status-success",
        failed: "status-failed",
        waiting: "status-pending",
        cancelled: "status-failed",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, children, ...props }, ref) => {
    return (
      <span
        className={cn(statusBadgeVariants({ status }), className)}
        ref={ref}
        {...props}
      >
        {children || getStatusText(status)}
      </span>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

function getStatusText(status: StatusBadgeProps['status']) {
  switch (status) {
    case 'pending':
      return 'Menunggu'
    case 'processing':
      return 'Diproses'
    case 'success':
      return 'Berhasil'
    case 'failed':
      return 'Gagal'
    case 'waiting':
      return 'Menunggu Pembayaran'
    case 'cancelled':
      return 'Dibatalkan'
    default:
      return 'Unknown'
  }
}

export { StatusBadge, statusBadgeVariants }
