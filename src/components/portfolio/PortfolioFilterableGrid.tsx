"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import PortfolioCard from "./PortfolioCard"
import FeaturedProductCard from "./FeaturedProductCard"
import {
  FILTER_CATEGORIES,
  FilterCategory,
  getProjectFilterCategory,
} from "@/lib/portfolioCategories"

interface ImpactMetric {
  label: string
  value: string
  context?: string
}

interface Category {
  title: string
  slug: string
}

interface PortfolioProject {
  _id: string
  title: string
  slug: string
  shortDescription?: string
  prototypeLink?: string
  coverImage?: {
    alt?: string
    asset?: {
      _id: string
      url: string
      metadata?: {
        dimensions?: { width: number; height: number }
      }
    }
  }
  impact?: ImpactMetric[]
  categories?: Category[]
  intendedImpact?: string
  whatThisDemonstrates?: string
  keyAssumptions?: string[]
  tradeoffs?: Array<{ decision: string; tradeoff: string }>
  _createdAt?: string
}

interface FeaturedItem {
  id: string
  title: string
  positioning: string
  caseStudySlug: string
  prototypeLink: string
  filterCategory: FilterCategory
}

interface PortfolioFilterableGridProps {
  featuredItems: FeaturedItem[]
  projects: PortfolioProject[]
}

export default function PortfolioFilterableGrid({
  featuredItems,
  projects,
}: PortfolioFilterableGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All")

  // Build unified list with filter categories (projects without category show in "All" only)
  const allItems = [
    ...featuredItems.map((f) => ({
      id: f.id,
      type: "featured" as const,
      filterCategory: f.filterCategory,
      featured: f,
    })),
    ...projects.map((p) => ({
      id: p._id,
      type: "project" as const,
      filterCategory: getProjectFilterCategory(
        p.slug,
        p.title,
        p.categories
      ),
      project: p,
    })),
  ]

  const filteredItems =
    activeFilter === "All"
      ? allItems
      : allItems.filter((item) => item.filterCategory === activeFilter)

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {FILTER_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-charcoal ${
              activeFilter === category
                ? "bg-white text-black"
                : "bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-300"
            }`}
            aria-pressed={activeFilter === category}
            aria-label={`Filter by ${category}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid - 2-col layout for clean alignment with featured cards */}
      <div className="grid md:grid-cols-2 gap-6 sm:gap-8 min-h-[200px]">
        <AnimatePresence mode="popLayout">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {item.type === "featured" && item.featured ? (
                  <FeaturedProductCard
                    title={item.featured.title}
                    positioning={item.featured.positioning}
                    caseStudySlug={item.featured.caseStudySlug}
                    prototypeLink={item.featured.prototypeLink}
                  />
                ) : item.type === "project" && item.project ? (
                  <PortfolioCard
                    project={item.project}
                    index={index}
                    isRecommended={index === 0 && activeFilter !== "All"}
                  />
                ) : null}
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full py-16 text-center"
            >
              <p className="text-zinc-500 text-base">
                No projects in this category yet.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
