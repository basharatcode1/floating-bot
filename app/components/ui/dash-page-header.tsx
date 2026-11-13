import * as React from "react"
import { cn } from "@/app/lib/utils"

interface DashPageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode
  subtitle?: React.ReactNode
  titleClassName?: string
  subtitleClassName?: string
  actions?: React.ReactNode
  children?: React.ReactNode
}

export function DashPageHeader({
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
  actions,
  className,
  children,
  ...props
}: DashPageHeaderProps) {
  const content = actions || children;
  return (
    <div
      className={cn(
        "dash-page-header flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6",
        className
      )}
      {...props}
    >
      <div className="min-w-0">
        <h1
          className={cn(
            "dash-page-title text-2xl sm:text-3xl font-semibold tracking-tight leading-tight text-[var(--dash-brand-title,#005A9C)] flex items-center gap-2.5 flex-wrap",
            titleClassName
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              "page-subtitle dash-page-subtitle",
              subtitleClassName
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {content && (
        <div className="dash-page-actions flex items-center gap-2.5 sm:gap-3 flex-nowrap shrink-0">
          {content}
        </div>
      )}
    </div>
  )
}
