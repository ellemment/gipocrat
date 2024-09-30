// app/components/ui/navtab.tsx

"use client"
import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import { type ReactNode, useMemo, useState } from "react"
import useMeasure from "react-use-measure"
import { cn } from '#app/utils/misc.tsx'

type Tab = {
  id: number
  label: string
  content: ReactNode
}

interface DirectionAwareTabsProps {
  tabs: Tab[]
  className?: string
  rounded?: string
  onChange?: (newTabId: number) => void
  activeTab?: number
}

function DirectionAwareTabs({
  tabs,
  className,
  rounded,
  onChange,
  activeTab: externalActiveTab,
}: DirectionAwareTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(0)
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [ref, bounds] = useMeasure()

  const content = useMemo(() => {
    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content
    return activeTabContent || null
  }, [activeTab, tabs])

  const handleTabClick = (newTabId: number) => {
    if (newTabId !== activeTab && !isAnimating) {
      const newDirection = newTabId > activeTab ? 1 : -1
      setDirection(newDirection)
      setInternalActiveTab(newTabId)
      onChange?.(newTabId)
    }
  }

  const variants = {
    initial: (direction: number) => ({
      x: 300 * direction,
      opacity: 0,
      filter: "blur(4px)",
    }),
    active: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      x: -300 * direction,
      opacity: 0,
      filter: "blur(4px)",
    }),
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className={cn(
          "flex space-x-1 border rounded-full cursor-pointer bg-neutral-200 p-1 shadow-inner-shadow",
          className,
          rounded
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "relative rounded-full px-4 py-2 text-xs lg:text-sm font-medium transition focus-visible:outline-1 focus-visible:ring-1 focus-visible:outline-none flex gap-2 items-center",
              activeTab === tab.id
                ? "text-inherit"
                : "hover:text-neutral-300/60 text-neutral-900/80 dark:text-neutral-200",
              "w-1/2"
            )}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="bubble"
                className="absolute inset-0 z-10 rounded-full dark:bg-neutral-700 bg-white mix-blend-difference shadow-inner-shadow border border-white/10 dark:border-black/10"
                transition={{ type: "spring", bounce: 0.19, duration: 0.4 }}
              />
            )}
            {tab.label}
          </button>
        ))}
      </div>
      <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}>
        <motion.div
          className="relative mx-auto w-full h-full overflow-hidden"
          initial={false}
          animate={{ height: bounds.height }}
        >
          <div className="p-1" ref={ref}>
            <AnimatePresence
              custom={direction}
              mode="popLayout"
              onExitComplete={() => setIsAnimating(false)}
            >
              <motion.div
                key={activeTab}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                custom={direction}
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </MotionConfig>
    </div>
  )
}

export { DirectionAwareTabs }