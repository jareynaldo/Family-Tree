import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white">
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-extrabold text-text">Build Your Family Tree</h1>
        <p className="mt-4 text-lg text-text/70">
          Create, manage, and share your family history with Easy Tree.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <a href="/register" className="btn-primary">Get Started</a>
          <a href="/login" className="btn-secondary">Sign In</a>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          ["👨‍👩‍👧‍👦", "Family Management", "Add and manage family members with ease"],
          ["📱", "Access Anywhere", "View and edit your family tree from any device"],
          ["🔒", "Secure & Private", "Your family data is protected and private"],
        ].map(([icon, title, desc]) => (
          <div key={title} className="text-center">
            <div className="text-5xl text-primary mb-4">{icon}</div>
            <h3 className="text-xl font-medium text-text">{title}</h3>
            <p className="mt-2 text-text/70">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
