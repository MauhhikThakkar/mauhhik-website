import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
import { visionTool } from "@sanity/vision"

// Import schema from Next.js app
import project from "../src/sanity/schemaTypes/project"
import category from "../src/sanity/schemaTypes/categoryType"
import author from "../src/sanity/schemaTypes/authorType"
import metric from "../src/sanity/schemaTypes/metric"
import richText from "../src/sanity/schemaTypes/richText"

export default defineConfig({
  name: "default",
  title: "Mauhhik Portfolio",

  projectId: "7gxmi8er",
  dataset: "production",

  plugins: [deskTool(), visionTool()],

  schema: {
    types: [project, category, author, metric, richText],
  },
})
