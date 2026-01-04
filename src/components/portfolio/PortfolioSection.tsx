const projects = [
    {
      title: "AI Resume Screening Tool",
      description:
        "Designed and shipped an AI-powered resume screening workflow to reduce recruiter effort.",
      role: "Product Manager",
      impact: "Reduced screening time by ~60%",
      tags: ["AI", "SaaS", "MVP", "B2B"],
    },
    {
      title: "Excel Automation for Ops Team",
      description:
        "Built Excel-based automation to eliminate repetitive reporting work.",
      role: "PM + Builder",
      impact: "Saved ~10 hrs/week per analyst",
      tags: ["Excel", "Automation", "Internal Tools"],
    },
  ];
  
  export default function PortfolioSection() {
    return (
      <section className="bg-black text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Portfolio</h2>
          <p className="text-gray-400 mb-12">
            Selected case studies showcasing product thinking, execution, and impact.
          </p>
  
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition"
              >
                <h3 className="text-2xl font-semibold mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {project.description}
                </p>
  
                <div className="text-sm text-gray-300 mb-3">
                  <strong>Role:</strong> {project.role}
                </div>
  
                <div className="text-sm text-green-400 mb-4">
                  <strong>Impact:</strong> {project.impact}
                </div>
  
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
            ))}
          </div>
        </div>
      </section>
    );
  }
  