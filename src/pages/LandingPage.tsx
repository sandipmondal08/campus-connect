import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Shield, ArrowRight, CheckCircle, Clock, Users } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: FileText, title: 'Easy Submission', desc: 'Submit complaints in seconds with our intuitive form' },
    { icon: Clock, title: 'Real-time Tracking', desc: 'Track your complaint status with color-coded updates' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your data is protected with role-based access control' },
    { icon: CheckCircle, title: 'Quick Resolution', desc: 'Dedicated teams ensure fast complaint resolution' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-card shadow-card">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-hero flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-foreground">CCMS</h1>
            <p className="text-[10px] text-muted-foreground">College Complaint System</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
          <Button onClick={() => navigate('/register')} className="gradient-hero border-0">Register</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
        <div className="container mx-auto px-6 py-20 md:py-32 text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="h-4 w-4" /> Trusted by 1000+ Students
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-foreground leading-tight mb-6">
              College Complaint<br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-hero)' }}>
                Management System
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Submit, track, and resolve campus complaints efficiently. A streamlined platform for students, faculty, and administrators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/register')} className="gradient-hero border-0 text-base px-8">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="text-base px-8">
                Login to Dashboard
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground mb-3">How It Works</h2>
          <p className="text-muted-foreground">Simple, fast, and effective complaint management</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow text-center"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-card-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="gradient-hero py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '500+', label: 'Complaints Resolved' },
              { num: '1200+', label: 'Active Users' },
              { num: '15', label: 'Team Members' },
              { num: '98%', label: 'Satisfaction Rate' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-display font-extrabold text-primary-foreground">{s.num}</p>
                <p className="text-sm text-primary-foreground/70 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 College Complaint Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
