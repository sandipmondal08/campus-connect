import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Eye, EyeOff, RefreshCw, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const DEPARTMENTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Information Technology', 'MBA', 'MCA'];
const HOSTELS = ['Block A', 'Block B', 'Block C', 'Block D', 'Girls Hostel 1', 'Girls Hostel 2'];

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' as 'student' | 'faculty' | '', department: '', hostel: '' });
  const [showPw, setShowPw] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');

  const pw = form.password;
  const pwChecks = useMemo(() => ({
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /\d/.test(pw),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(pw),
  }), [pw]);
  const pwStrength = Object.values(pwChecks).filter(Boolean).length;
  const pwValid = pwStrength === 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwValid) { toast.error('Please meet all password requirements'); return; }
    if (captchaInput !== captcha) { toast.error('Invalid captcha'); setCaptcha(generateCaptcha()); setCaptchaInput(''); return; }
    if (!form.role) { toast.error('Please select a role'); return; }
    const success = register({ name: form.name, email: form.email, password: form.password, role: form.role as 'student' | 'faculty', department: form.department, hostel: form.hostel || undefined });
    if (success) { toast.success('Registration successful!'); navigate('/dashboard'); }
    else { toast.error('Email already exists'); }
  };

  const PwCheck = ({ ok, label }: { ok: boolean; label: string }) => (
    <div className={`flex items-center gap-1.5 text-xs ${ok ? 'text-status-resolved' : 'text-muted-foreground'}`}>
      {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {label}
    </div>
  );

  const strengthColor = pwStrength <= 2 ? 'bg-status-rejected' : pwStrength <= 4 ? 'bg-status-pending' : 'bg-status-resolved';

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <FileText className="h-20 w-20 text-primary-foreground mx-auto mb-6" />
          <h1 className="text-4xl font-display font-extrabold text-primary-foreground mb-4">Join CMS</h1>
          <p className="text-primary-foreground/80 text-lg max-w-md">Create your account to submit and track complaints efficiently.</p>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background overflow-auto">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <h2 className="text-2xl font-display font-bold text-foreground mb-1">Create Account</h2>
          <p className="text-muted-foreground mb-6">Register to start submitting complaints</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="John Doe" required />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@student.edu" required />
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input type={showPw ? 'text' : 'password'} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {pw.length > 0 && (
                <div className="mt-2 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= pwStrength ? strengthColor : 'bg-muted'}`} />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <PwCheck ok={pwChecks.length} label="8+ characters" />
                    <PwCheck ok={pwChecks.upper} label="Uppercase" />
                    <PwCheck ok={pwChecks.lower} label="Lowercase" />
                    <PwCheck ok={pwChecks.number} label="Number" />
                    <PwCheck ok={pwChecks.special} label="Special char" />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as 'student' | 'faculty' }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Department</Label>
                <Select value={form.department} onValueChange={(v) => setForm((f) => ({ ...f, department: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Hostel (optional)</Label>
              <Select value={form.hostel} onValueChange={(v) => setForm((f) => ({ ...f, hostel: v }))}>
                <SelectTrigger><SelectValue placeholder="Select hostel" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {HOSTELS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

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

            <Button type="submit" className="w-full gradient-hero border-0">Create Account</Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
