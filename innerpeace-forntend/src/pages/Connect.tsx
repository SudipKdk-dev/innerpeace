
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { Mail, MessageCircle, Sparkles, Send, Twitter, Instagram, Heart } from 'lucide-react';
import { api } from '@/lib/api';
import { useState } from 'react';

export default function Connect() {
    const { push } = useToast();
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            push({ type: 'error', message: 'Please write a message before sending.' });
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/messages/anonymous', { message });
            push({ type: 'success', message: 'Message sent! Thank you for sharing your thoughts.' });
            setMessage(''); // Clear the textarea
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message ?? 'Failed to send message. Please try again.';
            push({ type: 'error', message: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-20 pb-16">
            {/* Header */}
            <section className="text-center space-y-5 px-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-blush bg-blush/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cocoa">
                    <Heart size={12} className="fill-cocoa text-cocoa animate-pulse" />
                    Always Listening
                </div>
                <h1 className="font-serif text-5xl font-bold text-ink md:text-7xl">
                    Say Hello
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-ink/70">
                    Whether you have a question, a story to share, or just want to say hi, I'd love to hear from you.
                    The door is always open.
                </p>

                <div className="flex justify-center gap-6 pt-4 text-ink/40">
                    <MessageCircle size={20} />
                    <Heart size={20} />
                    <Send size={20} />
                    <Sparkles size={20} />
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6">
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Email Me */}
                    <Card className="glass flex flex-col justify-between p-7 border border-ink/8 transition-all hover:shadow-lg">
                        <div className="space-y-4">
                            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-blush/20 text-cocoa">
                                <Mail size={24} />
                            </div>
                            <h3 className="font-serif text-2xl font-bold">Drop me a line</h3>
                            <p className="text-ink/70">For collaborations, inquiries, or just a friendly chat.</p>
                            <a href="mailto:hello@innerpeace.com" className="block text-lg font-medium text-cocoa hover:underline">
                                hello@innerpeace.com
                            </a>
                            <div className="inline-block rounded-full bg-ink/5 px-3 py-1 text-xs font-medium text-ink/50">
                                Responds within 2-3 days
                            </div>
                        </div>
                    </Card>

                    {/* Follow Along */}
                    <Card className="glass flex flex-col justify-between p-7 border border-ink/8 transition-all hover:shadow-lg">
                        <div className="space-y-4">
                            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-sand/50 text-ink">
                                <Sparkles size={24} />
                            </div>
                            <h3 className="font-serif text-2xl font-bold">Stay in the orbit</h3>
                            <p className="text-ink/70">Catch the behind-the-scenes and daily musings on my social channels.</p>
                            <div className="flex gap-4 pt-2">
                                <Button variant="outline" className="flex-1 gap-2 border-ink/10 hover:bg-white/50">
                                    <Instagram size={18} /> Instagram
                                </Button>
                                <Button variant="outline" className="flex-1 gap-2 border-ink/10 hover:bg-white/50">
                                    <Twitter size={18} /> Twitter
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Anonymous Message Form */}
            <section className="mx-auto max-w-3xl px-6">
                <Card className="glass relative overflow-hidden border border-ink/8 p-8 md:p-10 shadow-lg">
                    <div className="relative z-10 space-y-8">
                        <div className="space-y-2">
                            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-rose-100 text-rose-500 mb-4">
                                <MessageCircle size={24} />
                            </div>
                            <h2 className="font-serif text-3xl font-bold">Leave a quiet note</h2>
                            <p className="text-ink/60">
                                If you prefer to stay in the shadows, you can leave a message here. No name required.
                                Your privacy is sacred.
                            </p>
                        </div>

                        <form onSubmit={handleSendMessage} className="space-y-6">
                            <div className="space-y-2">
                                <Textarea
                                    placeholder="What's on your mind? I'm listening..."
                                    rows={6}
                                    className="bg-white/50 border-ink/10 focus:bg-white resize-none text-lg"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full gap-2 bg-gradient-to-r from-cocoa to-ink hover:opacity-90 transition-opacity"
                                disabled={isSubmitting}
                            >
                                <Send size={18} /> {isSubmitting ? 'Sending...' : 'Send Message Anonymously'}
                            </Button>
                        </form>

                        <div className="flex gap-3 rounded-lg bg-ink/5 p-4 text-xs text-ink/60">
                            <Heart size={14} className="flex-shrink-0 mt-0.5 text-rose-400" />
                            <p>
                                <strong>Your privacy matters:</strong> Messages sent through this form are completely anonymous.
                                While I can't reply directly, I read every single one and treasure the trust you place in me by sharing your words.
                            </p>
                        </div>
                    </div>
                </Card>
            </section>

            {/* What to Expect */}
            <section className="mx-auto max-w-4xl px-6">
                <div className="flex items-start gap-6 rounded-2xl border border-ink/5 bg-gradient-to-br from-sand/20 to-transparent p-6 md:p-8">
                    <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-cream shadow-sm text-cocoa">
                        <Heart size={20} className="fill-cocoa/20" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-serif text-xl font-bold">My Promise</h3>
                        <p className="text-ink/70 leading-relaxed">
                            I read every single message personally. While I can't always respond immediately, know that your words are received with gratitude.
                            This is a safe space for genuine connection.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
