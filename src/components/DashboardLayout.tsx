import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';
import {
  LayoutDashboard, FileText, PlusCircle, Users, BarChart3,
  Settings, LogOut, Menu, Shield, Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const userLinks = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'My Complaints', url: '/my-complaints', icon: FileText },
  { title: 'New Complaint', url: '/new-complaint', icon: PlusCircle },
];

const adminLinks = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'All Complaints', url: '/admin/complaints', icon: FileText },
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Teams', url: '/admin/teams', icon: Settings },
  { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
];

const teamLinks = [
  { title: 'Dashboard', url: '/team', icon: LayoutDashboard },
  { title: 'Assigned Tasks', url: '/team/tasks', icon: Wrench },
];

function SidebarInner() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'team' ? teamLinks : userLinks;
  const roleIcon = user?.role === 'admin' ? Shield : user?.role === 'team' ? Wrench : Users;
  const RoleIcon = roleIcon;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="gradient-sidebar h-full flex flex-col">
        <div className="p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg gradient-hero flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-display font-bold text-sidebar-foreground text-sm">CCMS</h2>
              <p className="text-[10px] text-sidebar-foreground/60">Complaint Portal</p>
            </div>
          )}
        </div>

        <SidebarContent className="flex-1">
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider px-4">
                Navigation
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {links.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg mx-2 px-3 py-2 flex items-center gap-3 transition-colors"
                        activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <div className="p-4 border-t border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-3 mb-3 px-1">
              <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                <RoleIcon className="h-4 w-4 text-sidebar-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.name}</p>
                <p className="text-[10px] text-sidebar-foreground/50 capitalize">{user?.role}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {!collapsed && 'Logout'}
          </Button>
        </div>
      </div>
    </Sidebar>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SidebarInner />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-4 border-b bg-card px-4 sticky top-0 z-10">
            <SidebarTrigger>
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <h1 className="text-lg font-display font-semibold text-card-foreground">{title}</h1>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
