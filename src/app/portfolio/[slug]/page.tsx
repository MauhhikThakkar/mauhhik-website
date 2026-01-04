interface CaseStudyProps {
    params: { slug: string };
  }
  
  export default function CaseStudyPage({ params }: CaseStudyProps) {
    return (
      <main className="bg-black text-white min-h-screen px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-10">
  
          <header>
            <h1 className="text-4xl font-bold mb-2 capitalize">
              {params.slug.replace("-", " ")}
            </h1>
            <p className="text-gray-400">
              Product case study — problem, decisions, and impact
            </p>
          </header>
  
          <section>
            <h2 className="text-2xl font-semibold mb-2">Context</h2>
            <p className="text-gray-300">
              This project focused on solving a real operational problem using a
              lightweight AI-first MVP approach.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold mb-2">Problem</h2>
            <p className="text-gray-300">
              Recruiters were spending excessive time manually reviewing resumes,
              leading to delayed hiring decisions.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold mb-2">My Role</h2>
            <p className="text-gray-300">
              I owned problem discovery, solution design, MVP scope, and delivery.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold mb-2">Solution</h2>
            <p className="text-gray-300">
              Designed an AI-assisted resume scoring workflow that prioritized
              relevant profiles automatically.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold mb-2 text-green-400">
              Impact
            </h2>
            <p className="text-gray-300">
              Reduced screening time by ~60% and improved recruiter throughput.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold mb-2">What I’d Do Next</h2>
            <p className="text-gray-300">
              Introduce feedback loops and continuous model improvement based on
              recruiter decisions.
            </p>
          </section>
  
        </div>
      </main>
    );
  }
  