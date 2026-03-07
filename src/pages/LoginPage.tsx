import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput !== captcha) {
      toast.error('Invalid captcha. Please try again.');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }
    const success = login(email, password);
    if (success) {
      toast.success('Login successful!');
      // navigate based on role is handled in App via redirects
      // for now just navigate to dashboard
      const user = JSON.parse(JSON.stringify(success));
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials or account blocked.');
    }
  };

  // Quick login helpers for demo
  const demoLogin = (email: string) => {
    const success = login(email, 'demo');
    if (success) {
      toast.success('Logged in!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative items-center justify-center p-12">
        <div className="text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <FileText className="h-20 w-20 text-primary-foreground mx-auto mb-6" />
            <h1 className="text-4xl font-display font-extrabold text-primary-foreground mb-4">Welcome Back</h1>
            <p className="text-primary-foreground/80 text-lg max-w-md">
              Login to manage, track, and resolve campus complaints efficiently.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="h-10 w-10 rounded-xl gradient-hero flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">CCMS</span>
          </div>

          <h2 className="text-2xl font-display font-bold text-foreground mb-1">Sign in</h2>
          <p className="text-muted-foreground mb-6">Enter your credentials to access your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Captcha */}
            <div>
              <Label>Captcha Verification</Label>
              <div className="flex items-center gap-3 mt-1">
                <div className="bg-muted px-4 py-2 rounded-lg font-mono text-lg font-bold tracking-widest text-foreground select-none italic" style={{ letterSpacing: '0.3em' }}>
                  {captcha}
                </div>
                <button type="button" onClick={() => { setCaptcha(generateCaptcha()); setCaptchaInput(''); }} className="text-muted-foreground hover:text-primary">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              <Input className="mt-2" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="Enter captcha" required />
            </div>

            <Button type="submit" className="w-full gradient-hero border-0">Sign In</Button>
          </form>

          {/* Demo logins */}
          <div className="mt-6 p-4 rounded-xl bg-muted/50 border">
            <p className="text-xs font-medium text-muted-foreground mb-3">Quick Demo Login (no captcha needed):</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => demoLogin('amit@student.edu')}>Student</Button>
              <Button size="sm" variant="outline" onClick={() => demoLogin('meena@faculty.edu')}>Faculty</Button>
              <Button size="sm" variant="outline" onClick={() => demoLogin('admin@college.edu')}>Admin</Button>
              <Button size="sm" variant="outline" onClick={() => demoLogin('rajesh@college.edu')}>Team</Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Register here</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
