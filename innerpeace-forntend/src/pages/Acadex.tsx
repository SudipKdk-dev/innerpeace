import { SectionHeading } from '@/components/SectionHeading';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, BookOpen, PenTool, Lightbulb, Heart, ArrowRight } from 'lucide-react';

export default function Acadex() {
    return (
        <div className="animate-fade-in space-y-32 pb-20">
            {/* Hero Section */}
            <section className="relative flex flex-col-reverse gap-12 overflow-hidden px-6 pt-12 md:flex-row md:items-center md:justify-between md:px-12 md:pt-24">
                <div className="flex-1 space-y-6 animate-slide-up">
                    <div className="inline-flex items-center rounded-full bg-blush/30 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cocoa">
                        Career Arc
                    </div>
                    <h1 className="font-serif text-5xl font-bold text-ink md:text-7xl lg:text-8xl">
                        Portfolio
                    </h1>
                    <p className="max-w-xl text-lg text-ink/70 md:text-xl">
                        Markers of effort, learning, and the pursuit of meaning in my professional life.
                    </p>
                </div>
                <div className="relative flex-1 animate-scale-in">
                    {/* Placeholder for Hero Image */}
                    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[3rem] bg-sand/30 shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                            alt="Professional Portrait"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent" />
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -bottom-10 -left-10 -z-10 h-64 w-64 rounded-full bg-moss/20 blur-3xl" />
                    <div className="absolute -top-10 -right-10 -z-10 h-64 w-64 rounded-full bg-blush/30 blur-3xl" />
                </div>
            </section>

            {/* Story Behind Acadex */}
            <section className="mx-auto max-w-6xl px-6">
                <div className="grid gap-16 md:grid-cols-2">
                    <div className="order-2 md:order-1 relative">
                        <div className="clip-blob-1 relative aspect-square w-full overflow-hidden bg-white shadow-xl">
                            <img
                                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80"
                                alt="Studying"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="order-1 md:order-2 flex flex-col justify-center space-y-8">
                        <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-sand/50 text-cocoa">
                            <Lightbulb size={32} />
                        </div>
                        <h2 className="font-serif text-4xl font-bold text-ink md:text-5xl">The Backstory</h2>
                        <div className="space-y-6 text-lg text-ink/70 leading-relaxed">
                            <p>
                                I realized that a simple list of jobs doesn't capture the essence of a career.
                                This portfolio is an attempt to bridge the gap between credentials and the lived experience of learning.
                            </p>
                            <p>
                                It is a digital garden where I document not just what I've done, but what I've learned along the way.
                                It represents the intersection of structured knowledge and real-world application.
                            </p>
                            <p>
                                From quiet study sessions to high-stakes project launches, every step is documented here as part of a larger narrative of growth.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Major Milestones */}
            <section className="bg-white/50 py-24">
                <div className="mx-auto max-w-6xl px-6 text-center">
                    <div className="mb-16 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blush/20 text-cocoa">
                        <Award size={32} />
                    </div>
                    <h2 className="mb-4 font-serif text-4xl font-bold text-ink">Significant Markers</h2>
                    <p className="mx-auto mb-16 max-w-2xl text-ink/60">
                        Points of reflection that mark the journey so far.
                    </p>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            {
                                icon: Award,
                                title: "Leading Initiatives",
                                desc: "Spearheaded key strategic projects that defined direction and fostered team cohesion.",
                                color: "bg-moss/10 text-moss"
                            },
                            {
                                icon: Heart,
                                title: "Community Building",
                                desc: "Fostered a growing network of like-minded individuals, creating spaces for shared stories and support.",
                                color: "bg-blush/20 text-cocoa"
                            },
                            {
                                icon: BookOpen,
                                title: "Words in Print",
                                desc: "Shared personal essays and thoughts in various publications, exploring themes of resilience and living well.",
                                color: "bg-sand/40 text-ink"
                            }
                        ].map((item, i) => (
                            <Card key={i} className="glass group relative overflow-hidden border-2 border-white/50 p-8 text-left transition-all hover:-translate-y-2 hover:shadow-soft">
                                <div className={`mb-6 inline-flex items-center justify-center rounded-2xl p-4 transition-colors group-hover:bg-white ${item.color}`}>
                                    <div className={`p-3 rounded-xl ${item.color}`}>
                                        <item.icon size={28} />
                                    </div>
                                </div>
                                <h3 className="mb-3 font-serif text-xl font-bold">{item.title}</h3>
                                <p className="text-ink/70 leading-relaxed">{item.desc}</p>

                                <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest text-ink/20 transform group-hover:translate-x-1 transition-transform">
                                    0{i + 1}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Founder Section */}
            <section className="mx-auto max-w-6xl px-6">
                <div className="rounded-[3rem] bg-ink p-8 text-cream md:p-16 relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,#fff,transparent_50%)]" />

                    <div className="relative z-10 grid gap-12 md:grid-cols-2 items-center">
                        <div className="relative aspect-[3/4] max-w-sm mx-auto md:mx-0 overflow-hidden rounded-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                                alt="Founder"
                                className="h-full w-full object-cover opacity-90 transition-opacity hover:opacity-100"
                            />
                            <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-cream/10 p-4 backdrop-blur-md">
                                <p className="font-serif text-lg font-bold">Sudeep</p>
                                <p className="text-xs uppercase tracking-widest opacity-70">Creator</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-4 py-2 text-sm">
                                <Heart size={14} className="fill-cream text-cream" />
                                <span>Creator's Note</span>
                            </div>
                            <h2 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
                                A Personal Note
                            </h2>
                            <blockquote className="text-xl italic text-cream/80 leading-relaxed border-l-2 border-cream/30 pl-6">
                                "Building this space hasn't just been about showcasing work—it’s been about reclaiming my narrative.
                                In a world that often values speed, I wanted to create a space that honors the process."
                            </blockquote>
                            <div className="space-y-4 text-cream/70">
                                <p>
                                    Resilience isn't just bouncing back; it's moving forward with new wisdom. Every project listed here taught me something about my craft, and more importantly, about myself.
                                </p>
                                <p>
                                    When you explore this portfolio, don't just see the outcomes. See the late nights, the questions, and the passion that fueled it all.
                                </p>
                            </div>

                            <div className="pt-4">
                                <Button variant="secondary" className="gap-2">
                                    Read Full Story <ArrowRight size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Insights */}
            <section className="mx-auto max-w-3xl px-6 text-center space-y-12">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sand/50 text-ink">
                    <PenTool size={28} />
                </div>
                <h2 className="font-serif text-4xl font-bold text-ink">Lessons Learned</h2>
                <p className="text-lg text-ink/70">
                    Thoughts, guidance, and experiences gathered along the winding path.
                </p>
                <div className="mx-auto h-1 w-24 bg-cocoa/20 rounded-full" />
            </section>

            {/* Let's Connect CTA */}
            <section className="mx-auto max-w-lg px-6 text-center space-y-8">
                <div className="h-20 w-20 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-blush to-sand text-ink shadow-lg">
                    <span className="font-serif text-2xl font-bold">Hi</span>
                </div>
                <h2 className="font-serif text-4xl font-bold text-ink">Reach Out</h2>
                <p className="text-ink/60">
                    Interested in collaborating? Have questions about my work?
                    I'm always open to discussing new ideas.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                    <Button size="lg" className="rounded-full px-8 shadow-xl shadow-ink/10 hover:shadow-2xl hover:-translate-y-1 transition-all">
                        Contact Me
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full border-ink/20 px-8 hover:bg-ink/5">
                        See CV
                    </Button>
                </div>
            </section>
        </div>
    );
}
