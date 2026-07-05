import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import {
  useListRegistrations,
  useGetRegistrationStats,
  useListCourses,
  useAdminLogin,
  useAdminLogout,
  getListRegistrationsQueryKey,
  getGetRegistrationStatsQueryKey,
  setAuthTokenGetter,
} from '@workspace/api-client-react';
import { format } from 'date-fns';
import {
  Lock, ArrowLeft, LogOut,
  Download, Filter,
  Users, Sun, Moon, CalendarDays, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Admin() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Auth state — token lives in memory only, never persisted
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [shiftFilter, setShiftFilter] = useState<string>('all');

  const { data: courses } = useListCourses();

  const adminLogin = useAdminLogin();
  const adminLogout = useAdminLogout();

  const isAuthenticated = !!token;

  // Admin data — only fetched when authenticated
  const { data: registrations, isLoading: loadingRegs } = useListRegistrations(
    {
      courseId: courseFilter !== 'all' ? courseFilter : undefined,
      shift: shiftFilter !== 'all' ? (shiftFilter as 'morning' | 'evening') : undefined,
    },
    {
      query: {
        enabled: isAuthenticated,
        retry: false,
        queryKey: getListRegistrationsQueryKey({
          courseId: courseFilter !== 'all' ? courseFilter : undefined,
          shift: shiftFilter !== 'all' ? (shiftFilter as 'morning' | 'evening') : undefined,
        }),
      }
    }
  );

  const { data: stats } = useGetRegistrationStats(
    { query: { enabled: isAuthenticated, retry: false, queryKey: getGetRegistrationStatsQueryKey() } }
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoginError('');
    adminLogin.mutate(
      { data: { password } },
      {
        onSuccess: (res) => {
          setToken(res.token);
          setAuthTokenGetter(() => res.token);
          queryClient.invalidateQueries();
        },
        onError: (err: { status?: number }) => {
          if (err?.status === 429) {
            setLoginError('Too many failed attempts. Please wait 15 minutes.');
          } else {
            setLoginError('Incorrect password. Please try again.');
          }
          setPassword('');
        },
      }
    );
  };

  const handleLogout = () => {
    adminLogout.mutate();
    setAuthTokenGetter(null);
    setToken(null);
    setPassword('');
    queryClient.clear();
  };

  // ---- LOGIN SCREEN ----
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
          <div className="p-8 text-center bg-primary">
            <div className="w-16 h-16 rounded-full bg-white/10 text-white flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Access</h2>
            <p className="text-primary-foreground/70 mt-2">Enter password to view registrations</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-center text-lg"
                  autoFocus
                  disabled={adminLogin.isPending}
                />
                {loginError && (
                  <p className="text-destructive text-sm text-center font-medium">{loginError}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full h-12 text-base" disabled={adminLogin.isPending}>
                  {adminLogin.isPending ? 'Verifying...' : 'Login to Dashboard'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setLocation('/')}
                  className="w-full h-12"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Website
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---- DASHBOARD SCREEN ----
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">ش</div>
            <h1 className="font-bold text-xl">Shar Institute Admin</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            { label: 'Total Registrations', value: stats?.totalRegistrations ?? 0, icon: Users, color: 'bg-blue-100 text-blue-600' },
            { label: 'Morning Shift', value: stats?.morningCount ?? 0, icon: Sun, color: 'bg-amber-100 text-amber-600' },
            { label: 'Evening Shift', value: stats?.eveningCount ?? 0, icon: Moon, color: 'bg-indigo-100 text-indigo-600' },
            { label: 'Last 7 Days', value: stats?.recentRegistrations ?? 0, icon: CalendarDays, color: 'bg-emerald-100 text-emerald-600' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                Registrations
              </h2>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
                {registrations?.length ?? 0}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-background">
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses?.map(course => (
                      <SelectItem key={course.id} value={course.id}>{course.nameEn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Select value={shiftFilter} onValueChange={setShiftFilter}>
                <SelectTrigger className="w-full sm:w-[130px] bg-background">
                  <SelectValue placeholder="All Shifts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shifts</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" title="Export (coming soon)" className="shrink-0">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Date Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingRegs ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        Loading registrations...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : registrations && registrations.length > 0 ? (
                  registrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium text-muted-foreground">{reg.id}</TableCell>
                      <TableCell className="font-semibold">{reg.studentName}</TableCell>
                      <TableCell className="font-mono text-sm" dir="ltr">{reg.phoneNumber}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                          {reg.courseName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          reg.shift === 'morning' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {reg.shift === 'morning' ? 'Morning' : 'Evening'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs uppercase text-muted-foreground tracking-wider font-semibold">
                          {reg.language === 'ku' ? 'Kurdish' : reg.language === 'ar' ? 'Arabic' : 'English'}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(reg.submittedAt), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No registrations found matching the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
