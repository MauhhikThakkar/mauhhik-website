import Link from "next/link";

const projects = [
  {
    title: "AI Resume Analyzer",
    description:
      "An AI-powered tool that analyzes resumes and gives ATS-friendly feedback.",
    tags: ["AI", "Product Thinking", "LLMs"],
  },
  {
    title: "Excel Automation Suite",
    description:
      "Automation templates and workflows built for operations and finance teams.",
    tags: ["Excel", "Automation", "No-Code"],
  },
];

export default function PortfolioSection() {
  return (
    <section className="bg-black text-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-4">Portfolio</h2>
        <p className="text-gray-400 mb-12">
          Selected case studies showcasing product thinking, execution, and real-world delivery.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Link
              key={index}
              href={`/portfolio/${project.title
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              <div className="border border-gray-800 rounded-xl p-6 hover:border-white transition cursor-pointer">
                <h3 className="text-2xl font-semibold mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 bg-gray-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
