import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useComplaints } from '@/context/ComplaintContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SUBCATEGORIES, ComplaintCategory } from '@/types';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

const NewComplaint = () => {
  const { user } = useAuth();
  const { addComplaint } = useComplaints();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '' as ComplaintCategory | '', subcategory: '', location: '' });
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subcats = form.category ? SUBCATEGORIES[form.category as ComplaintCategory] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.category) return;
    addComplaint({
      userId: user.id,
      userName: user.name,
      userRole: user.role as 'student' | 'faculty',
      title: form.title,
      description: form.description,
      category: form.category as ComplaintCategory,
      subcategory: form.subcategory,
      location: form.location,
      imageUrl: attachment ? URL.createObjectURL(attachment) : undefined,
    });
    toast.success('Complaint submitted successfully!');
    navigate('/my-complaints');
  };

  return (
    <DashboardLayout title="Submit New Complaint">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-xl shadow-card p-6 md:p-8">
          <h2 className="text-xl font-display font-bold text-card-foreground mb-6">Complaint Details</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Complaint Title</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Brief title of your complaint" required />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Describe the issue in detail..." rows={4} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v as ComplaintCategory, subcategory: '' }))}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="college">College Related</SelectItem>
                    <SelectItem value="hostel">Hostel Related</SelectItem>
                    <SelectItem value="mess-security">Mess / Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subcategory</Label>
                <Select value={form.subcategory} onValueChange={(v) => setForm((f) => ({ ...f, subcategory: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
                  <SelectContent>
                    {subcats.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Location / Block / Department</Label>
              <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="e.g., Building A, Room 201" required />
            </div>
            <div>
              <Label>Attachment <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => setAttachment(e.target.files?.[0] || null)}
              />
              {attachment ? (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-input bg-muted/50">
                  <Upload className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground truncate flex-1">{attachment.name}</span>
                  <span className="text-xs text-muted-foreground">{(attachment.size / 1024).toFixed(1)} KB</span>
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setAttachment(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button type="button" variant="outline" className="w-full justify-start gap-2 text-muted-foreground" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4" /> Choose file (image, PDF, document, etc.)
                </Button>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="gradient-hero border-0 flex-1">Submit Complaint</Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewComplaint;
