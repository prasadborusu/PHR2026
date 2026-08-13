import React from 'react';
import { dbService, Team, EventConfig, ProblemStatement, Winner, Memory, PastEdition, getSectionsForBranch } from '../lib/db';
import { excelExporter } from '../lib/excel';
import { 
  Users, Award, Settings, FileText, Download, Lock, Unlock, 
  Trash2, Plus, Edit2, Check, X, ShieldAlert, LogOut, ChevronRight, Filter 
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [authError, setAuthError] = React.useState('');

  // Core configuration states
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [config, setConfig] = React.useState<EventConfig | null>(null);
  const [problems, setProblems] = React.useState<ProblemStatement[]>([]);
  const [winners, setWinners] = React.useState<Winner[]>([]);
  const [memories, setMemories] = React.useState<Memory[]>([]);
  const [pastEditions, setPastEditions] = React.useState<PastEdition[]>([]);

  // Navigation inside Admin Panel
  const [activeTab, setActiveTab] = React.useState<'teams' | 'problems' | 'winners' | 'memories' | 'config' | 'directory'>('teams');

  // Search/Filters states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  // Directory filter selections
  const [dirYear, setDirYear] = React.useState<'3rd Year' | '4th Year'>('3rd Year');
  const [dirBranch, setDirBranch] = React.useState('CSE');
  const [dirSection, setDirSection] = React.useState('A');

  // Modal / Add item states
  const [showAddProblem, setShowAddProblem] = React.useState(false);
  const [newProbDesc, setNewProbDesc] = React.useState('');
  const [newProbCategory, setNewProbCategory] = React.useState('Agritech & Rural Automation');
  const [newProbFileUrl, setNewProbFileUrl] = React.useState('');
  const [newProbFileName, setNewProbFileName] = React.useState('');
  const [newProbFile, setNewProbFile] = React.useState<File | null>(null);

  const [showAddWinner, setShowAddWinner] = React.useState(false);
  const [newWinYear, setNewWinYear] = React.useState('2026');
  const [newWinPos, setNewWinPos] = React.useState<'Winner' | 'Runner Up' | 'Special Mention'>('Winner');
  const [newWinTeam, setNewWinTeam] = React.useState('');
  const [newWinProj, setNewWinProj] = React.useState('');
  const [newWinDept, setNewWinDept] = React.useState('');
  const [newWinDesc, setNewWinDesc] = React.useState('');
  const [newWinMembers, setNewWinMembers] = React.useState('');
  const [newWinImg, setNewWinImg] = React.useState('');

  const [showAddMemory, setShowAddMemory] = React.useState(false);
  const [newMemTitle, setNewMemTitle] = React.useState('');
  const [newMemCat, setNewMemCat] = React.useState('Coding');
  const [newMemUrl, setNewMemUrl] = React.useState('');
  const [newMemFile, setNewMemFile] = React.useState<File | null>(null);
  const [newWinFile, setNewWinFile] = React.useState<File | null>(null);

  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);

  React.useEffect(() => {
    // Check if previously logged in this session
    if (sessionStorage.getItem('PRAJNA_ADMIN_AUTH') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = () => {
    dbService.getTeams().then(setTeams);
    dbService.getEventConfig().then(setConfig);
    dbService.getProblems().then(setProblems);
    dbService.getWinners().then(setWinners);
    dbService.getMemories().then(setMemories);
    dbService.getPastEditions().then(setPastEditions);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'prajna2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('PRAJNA_ADMIN_AUTH', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid credentials. Hint: use admin / prajna2026');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('PRAJNA_ADMIN_AUTH');
  };

  // Status management controls
  const handleUpdateStatus = async (teamId: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    await dbService.updateTeamStatus(teamId, status);
    loadAllData();
    if (selectedTeam && selectedTeam.id === teamId) {
      setSelectedTeam(prev => prev ? { ...prev, status } : null);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (window.confirm(`Are you sure you want to delete Team ${teamId}?`)) {
      await dbService.deleteTeam(teamId);
      setSelectedTeam(null);
      loadAllData();
    }
  };

  // Toggle problem statement unlock controls
  const handleToggleProblemPublish = async (prob: ProblemStatement) => {
    const nextStatus = prob.status === 'LOCKED' ? 'PUBLISHED' : 'LOCKED';
    await dbService.saveProblem({
      ...prob,
      status: nextStatus,
      publishedAt: nextStatus === 'PUBLISHED' ? new Date().toISOString() : undefined
    });
    loadAllData();
  };

  // Trigger problem releases for all statements simultaneously
  const handleReleaseAllProblems = async (release: boolean) => {
    const updatedStatus = release ? 'PUBLISHED' : 'LOCKED';
    for (const prob of problems) {
      await dbService.saveProblem({
        ...prob,
        status: updatedStatus,
        publishedAt: release ? new Date().toISOString() : undefined
      });
    }
    loadAllData();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Please upload a file smaller than 10MB.");
      return;
    }

    setNewProbFile(file);
    setNewProbFileName(file.name);
  };

  const handleAddProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let fileUrl = '';
    if (newProbFile) {
      // First try Supabase Storage
      const res = await dbService.uploadProblemFile(newProbFile);
      if (res.publicUrl) {
        fileUrl = res.publicUrl;
      } else {
        // Fallback to local storage base64
        console.warn("Storage upload failed, fallback to base64 Data URL");
        const toBase64 = (file: File): Promise<string> => new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string || '');
          reader.readAsDataURL(file);
        });
        fileUrl = await toBase64(newProbFile);
      }
    }

    await dbService.saveProblem({
      id: `prob-${Date.now()}`,
      title: newProbCategory,
      description: newProbDesc,
      category: newProbCategory,
      status: 'LOCKED',
      createdAt: new Date().toISOString(),
      fileUrl: fileUrl || undefined,
      fileName: newProbFileName || undefined
    });

    setNewProbDesc('');
    setNewProbFileUrl('');
    setNewProbFileName('');
    setNewProbFile(null);
    setShowAddProblem(false);
    loadAllData();
  };

  const handleDeleteProblem = async (id: string) => {
    await dbService.deleteProblem(id);
    loadAllData();
  };

  const handleAddWinner = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrl = '';
    if (newWinFile && dbService.uploadWinnerImage) {
      const res = await dbService.uploadWinnerImage(newWinFile);
      if (res.publicUrl) {
        imageUrl = res.publicUrl;
      } else {
        imageUrl = newWinImg; // Use base64 fallback
      }
    } else {
      imageUrl = newWinImg;
    }

    await dbService.saveWinner({
      id: `win-${Date.now()}`,
      year: newWinYear,
      position: newWinPos,
      teamName: newWinTeam,
      projectName: newWinProj,
      department: newWinDept,
      description: newWinDesc,
      members: newWinMembers.split(',').map(m => m.trim()).filter(Boolean),
      imageUrl: imageUrl || undefined
    });
    setNewWinTeam('');
    setNewWinProj('');
    setNewWinDept('');
    setNewWinDesc('');
    setNewWinMembers('');
    setNewWinImg('');
    setNewWinFile(null);
    setShowAddWinner(false);
    loadAllData();
  };

  const handleDeleteWinner = async (id: string) => {
    await dbService.deleteWinner(id);
    loadAllData();
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrl = '';
    if (newMemFile && dbService.uploadMemoryImage) {
      const res = await dbService.uploadMemoryImage(newMemFile);
      if (res.publicUrl) {
        imageUrl = res.publicUrl;
      } else {
        imageUrl = newMemUrl; // Use base64 fallback
      }
    } else {
      imageUrl = newMemUrl;
    }

    await dbService.addMemory({
      id: `mem-${Date.now()}`,
      title: newMemTitle,
      category: newMemCat,
      imageUrl: imageUrl,
      createdAt: new Date().toISOString()
    });
    setNewMemTitle('');
    setNewMemUrl('');
    setNewMemFile(null);
    setShowAddMemory(false);
    loadAllData();
  };

  const handleDeleteMemory = async (id: string) => {
    await dbService.deleteMemory(id);
    loadAllData();
  };

  // Configure core registration controls
  const handleConfigUpdate = async (field: keyof EventConfig, value: any) => {
    if (!config) return;
    const updated = { ...config, [field]: value };
    await dbService.saveEventConfig(updated);
    setConfig(updated);
  };

  // Filter logic on registered lists
  const filteredTeams = teams.filter(team => {
    const matchesSearch = 
      team.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.members.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || team.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics metrics
  const totalStudentsCount = teams.reduce((acc, t) => acc + t.members.length, 0);
  const eligibleTeamsCount = teams.length; // We only allow eligible submissions on form
  const thirdYearCount = teams.reduce((acc, t) => acc + t.members.filter(m => m.year === '3rd Year').length, 0);
  const fourthYearCount = teams.reduce((acc, t) => acc + t.members.filter(m => m.year === '4th Year').length, 0);
  const womenCount = teams.reduce((acc, t) => acc + t.members.filter(m => m.gender === 'Female').length, 0);

  // Compute branch aggregates
  const branchStats: Record<string, number> = {};
  teams.forEach(t => {
    t.members.forEach(m => {
      const b = m.branch.toUpperCase();
      branchStats[b] = (branchStats[b] || 0) + 1;
    });
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="bg-cream-100 border border-prajna-blue/15 p-8 shadow-sm">
          <div className="text-center mb-6">
            <ShieldAlert className="h-10 w-10 text-prajna-red mx-auto mb-2" />
            <h2 className="text-2xl font-serif text-prajna-blue font-bold">ADMIN SECURE ENTRY</h2>
            <p className="text-slate-500 text-[10px] tracking-wider uppercase mt-1">Authorized Access Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-prajna-red"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-prajna-red"
              />
            </div>

            {authError && <p className="text-prajna-red text-[10px] font-semibold">{authError}</p>}

            <button
              type="submit"
              className="w-full bg-prajna-red text-white text-[11px] font-bold tracking-widest uppercase py-3 hover:bg-prajna-red-hover transition-colors"
            >
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header controls bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 pb-6 border-b border-prajna-blue/10 mb-6 sm:mb-8">
        <div>
          <span className="text-[10px] font-bold text-prajna-red tracking-widest uppercase">CONTROL CENTER</span>
          <h2 className="text-2xl sm:text-3xl font-serif text-prajna-blue font-bold">ADMIN PANEL</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <button
            onClick={() => excelExporter.exportAttendance(teams)}
            className="border border-prajna-blue/20 text-prajna-blue hover:text-prajna-red hover:border-prajna-red text-[10px] font-bold tracking-widest uppercase py-2.5 px-4 flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="h-3.5 w-3.5" /> ATTENDANCE SHEET
          </button>

          <button
            onClick={() => excelExporter.exportMasterList(teams)}
            className="bg-prajna-blue text-white hover:bg-prajna-blue-hover text-[10px] font-bold tracking-widest uppercase py-2.5 px-4 flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="h-3.5 w-3.5" /> TOTAL MASTER LIST
          </button>

          <button
            onClick={handleLogout}
            className="border border-slate-300 text-slate-500 hover:border-prajna-red hover:text-prajna-red text-[10px] font-bold tracking-widest uppercase py-2.5 px-4 flex items-center justify-center gap-1.5 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" /> SIGN OUT
          </button>
        </div>
      </div>

      {/* Statistics metrics ribbon cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-cream-100 p-3.5 sm:p-4 border border-prajna-blue/10">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">TOTAL TEAMS</span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-prajna-blue">{teams.length}</span>
        </div>
        <div className="bg-cream-100 p-3.5 sm:p-4 border border-prajna-blue/10">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">TOTAL STUDENTS</span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-prajna-blue">{totalStudentsCount}</span>
        </div>
        <div className="bg-cream-100 p-3.5 sm:p-4 border border-prajna-blue/10">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">WOMEN PARTICIPANTS</span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-prajna-red">{womenCount}</span>
        </div>
        <div className="bg-cream-100 p-3.5 sm:p-4 border border-prajna-blue/10">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">3rd YEAR STUDENTS</span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-slate-700">{thirdYearCount}</span>
        </div>
        <div className="bg-cream-100 p-3.5 sm:p-4 border border-prajna-blue/10">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">4th YEAR STUDENTS</span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-slate-700">{fourthYearCount}</span>
        </div>
        <div className="bg-cream-100 p-3.5 sm:p-4 border border-prajna-blue/10">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">DEPARTMENTS REPRE.</span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-prajna-blue">{Object.keys(branchStats).length}</span>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-prajna-blue/10 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none gap-1">
        {[
          { label: 'TEAMS', id: 'teams', icon: <Users className="h-4 w-4" /> },
          { label: 'DIRECTORY EXPORT', id: 'directory', icon: <Download className="h-4 w-4" /> },
          { label: 'PROBLEM STATEMENTS', id: 'problems', icon: <FileText className="h-4 w-4" /> },
          { label: 'WINNERS PANEL', id: 'winners', icon: <Award className="h-4 w-4" /> },
          { label: 'MEMORIES ARCHIVE', id: 'memories', icon: <Award className="h-4 w-4 text-emerald-600" /> },
          { label: 'SETTINGS CONFIG', id: 'config', icon: <Settings className="h-4 w-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setSelectedTeam(null); }}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-prajna-red text-prajna-red bg-cream-100' 
                : 'border-transparent text-slate-500 hover:text-prajna-blue'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Render Active Panels */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Teams Table */}
          <div className="lg:col-span-8 bg-cream-100 border border-prajna-blue/10 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h3 className="font-serif font-bold text-lg text-prajna-blue uppercase">REGISTERED COHORTS</h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search roll, name, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-cream-50 border border-prajna-blue/15 px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-cream-50 border border-prajna-blue/15 px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="ALL">ALL STATUS</option>
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto border border-prajna-blue/10 bg-cream-50">
              <table className="min-w-full divide-y divide-prajna-blue/10 text-left text-xs">
                <thead className="bg-cream-100 font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Team ID / Name</th>
                    <th className="px-4 py-3">Participant Details</th>
                    <th className="px-4 py-3">Branch</th>
                    <th className="px-4 py-3">Roll No</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-prajna-blue/10">
                  {filteredTeams.map((team) => (
                    <React.Fragment key={team.id}>
                      {/* Conceptually rowspan-grouped layout using unique visuals per block */}
                      {team.members.length > 0 ? (
                        team.members.map((member, index) => (
                          <tr 
                            key={member.id} 
                            className={`hover:bg-cream-100/50 cursor-pointer ${index === 0 ? 'border-t-2 border-prajna-blue/10' : ''} ${selectedTeam?.id === team.id ? 'bg-prajna-blue/[0.02]' : ''}`}
                            onClick={() => setSelectedTeam(team)}
                          >
                            {index === 0 ? (
                              <td className="px-4 py-4 font-semibold text-prajna-blue border-r border-prajna-blue/5" rowSpan={team.members.length}>
                                <span className="text-[10px] text-prajna-red font-mono font-bold block">{team.id}</span>
                                <span className="font-serif text-sm block mt-0.5">{team.teamName}</span>
                                <span className="text-[9px] text-slate-400 block mt-1 uppercase">{team.college}</span>
                              </td>
                            ) : null}
                            
                            <td className="px-4 py-2.5">
                              <span className="font-semibold text-slate-800">{member.name}</span>
                              {index === 0 && <span className="text-[8px] bg-prajna-red/10 text-prajna-red font-bold px-1.5 py-0.2 ml-1 uppercase rounded-sm">Leader</span>}
                              <span className="text-[10px] text-slate-400 block">{member.gender} • {member.year}</span>
                            </td>
                            <td className="px-4 py-2.5 font-medium text-slate-700">{member.branch || 'N/A'} (Sec {member.section || '-'})</td>
                            <td className="px-4 py-2.5 font-mono text-slate-600">{member.rollNumber || '-'}</td>
                            
                            {index === 0 ? (
                              <td className="px-4 py-4 text-center border-l border-prajna-blue/5" rowSpan={team.members.length} onClick={(e) => e.stopPropagation()}>
                                <span className={`inline-block text-[10px] font-bold px-3 py-1 border rounded-sm ${
                                  team.status === 'REJECTED' 
                                    ? 'border-prajna-red/20 bg-prajna-red/10 text-prajna-red' 
                                    : 'border-green-600/30 bg-green-50 text-green-700'
                                }`}>
                                  {team.status === 'REJECTED' ? 'REJECTED' : 'APPROVED'}
                                </span>
                              </td>
                            ) : null}
                          </tr>
                        ))
                      ) : (
                        /* Fallback row when team has no members data */
                        <tr 
                          className={`hover:bg-cream-100/50 cursor-pointer border-t-2 border-prajna-blue/10 ${selectedTeam?.id === team.id ? 'bg-prajna-blue/[0.02]' : ''}`}
                          onClick={() => setSelectedTeam(team)}
                        >
                          <td className="px-4 py-4 font-semibold text-prajna-blue border-r border-prajna-blue/5">
                            <span className="text-[10px] text-prajna-red font-mono font-bold block">{team.id}</span>
                            <span className="font-serif text-sm block mt-0.5">{team.teamName}</span>
                            <span className="text-[9px] text-slate-400 block mt-1 uppercase">{team.college}</span>
                          </td>
                          <td className="px-4 py-2.5 text-slate-400 italic" colSpan={2}>
                            {team.leaderName || 'No member data available'}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-slate-400">—</td>
                          <td className="px-4 py-4 text-center border-l border-prajna-blue/5" onClick={(e) => e.stopPropagation()}>
                            <span className={`inline-block text-[10px] font-bold px-3 py-1 border rounded-sm ${
                              team.status === 'REJECTED' 
                                ? 'border-prajna-red/20 bg-prajna-red/10 text-prajna-red' 
                                : 'border-green-600/30 bg-green-50 text-green-700'
                            }`}>
                              {team.status === 'REJECTED' ? 'REJECTED' : 'APPROVED'}
                            </span>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                  {filteredTeams.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-400 font-semibold">
                        No registered cohorts match filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Details Sidebar Pane */}
          <div className="lg:col-span-4 bg-cream-100 border border-prajna-blue/10 p-6 sticky top-24">
            <h3 className="font-serif font-bold text-lg text-prajna-blue uppercase pb-4 border-b border-prajna-blue/10 mb-6">
              COHORT DETAILS
            </h3>

            {selectedTeam ? (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono font-bold text-prajna-red block">{selectedTeam.id}</span>
                  <h4 className="text-xl font-serif font-bold text-prajna-blue">{selectedTeam.teamName}</h4>
                  <span className="text-xs text-slate-500 block uppercase tracking-wider mt-1">{selectedTeam.college}</span>
                </div>

                <div className="border border-prajna-blue/5 p-4 bg-cream-50 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 uppercase">Verification Status</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 border ${
                    selectedTeam.status === 'APPROVED' 
                      ? 'border-green-600/20 bg-green-500/5 text-green-700' 
                      : selectedTeam.status === 'REJECTED' 
                      ? 'border-prajna-red/20 bg-prajna-red/5 text-prajna-red' 
                      : 'border-amber-500/20 bg-amber-500/5 text-amber-700'
                  }`}>
                    {selectedTeam.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">MEMBERS CONTACT DIRECTORY</span>
                  
                  {selectedTeam.members.map((member, i) => (
                    <div key={member.id} className="text-xs border-b border-prajna-blue/5 pb-3 last:border-none">
                      <div className="font-semibold text-slate-800 flex justify-between">
                        <span>{i + 1}. {member.name} {i === 0 && '(Leader)'}</span>
                        <span className="text-prajna-blue">{member.branch} ({member.section})</span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-1 space-y-0.5">
                        <p>Roll: {member.rollNumber} • {member.year}</p>
                        <p>Mobile: {member.mobile}</p>
                        <p>Email: {member.email}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-prajna-blue/10 flex gap-2 justify-end">
                  <button
                    onClick={() => handleDeleteTeam(selectedTeam.id)}
                    className="border border-prajna-red/20 hover:bg-prajna-red/5 text-prajna-red text-[10px] font-bold tracking-widest uppercase py-2 px-4 flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> DELETE TEAM
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-12">
                Select a team from the registry list to view comprehensive details, verify documents, and reject/approve status.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Directory Tab section */}
      {activeTab === 'directory' && (
        <div className="bg-cream-100 border border-prajna-blue/10 p-6 md:p-8 max-w-4xl mx-auto">
          <div className="border-l-2 border-prajna-red pl-4 py-1 mb-6">
            <h3 className="font-serif font-bold text-lg text-prajna-blue">PARTICIPANT DIRECTORY SEARCH</h3>
            <p className="text-slate-500 text-xs mt-0.5">Filter and export student lists sorted hierarchically.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-cream-50 p-6 border border-prajna-blue/10 mb-8">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Academic Year</label>
              <select
                value={dirYear}
                onChange={(e) => setDirYear(e.target.value as any)}
                className="w-full bg-cream-100 border border-prajna-blue/10 px-3 py-2 text-xs text-slate-800 focus:outline-none"
              >
                <option value="3rd Year">3rd Year Only</option>
                <option value="4th Year">4th Year Only</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Branch Department</label>
              <select
                value={dirBranch}
                onChange={(e) => {
                  const newBranch = e.target.value;
                  setDirBranch(newBranch);
                  const validSections = getSectionsForBranch(newBranch, config?.sections || []);
                  if (validSections.length > 0) {
                    setDirSection(validSections[0]);
                  }
                }}
                className="w-full bg-cream-100 border border-prajna-blue/10 px-3 py-2 text-xs text-slate-800 focus:outline-none"
              >
                {config?.branches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Class Section</label>
              <select
                value={dirSection}
                onChange={(e) => setDirSection(e.target.value)}
                className="w-full bg-cream-100 border border-prajna-blue/10 px-3 py-2 text-xs text-slate-800 focus:outline-none"
              >
                {getSectionsForBranch(dirBranch, config?.sections || []).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Calculate students list matches */}
          {(() => {
            const matches: { member: any; teamId: string; teamName: string }[] = [];
            teams.forEach(t => {
              t.members.forEach(m => {
                if (
                  m.year === dirYear &&
                  m.branch.trim().toUpperCase() === dirBranch.trim().toUpperCase() &&
                  m.section.trim().toUpperCase() === dirSection.trim().toUpperCase()
                ) {
                  matches.push({ member: m, teamId: t.id, teamName: t.teamName });
                }
              });
            });

            return (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-bold uppercase">
                    RESULTS MATCHED: {matches.length} STUDENTS
                  </span>
                  
                  <button
                    onClick={() => excelExporter.exportDirectorySheet(teams, dirYear, dirBranch, dirSection)}
                    disabled={matches.length === 0}
                    className={`text-[10px] font-bold tracking-widest uppercase py-2 px-4 flex items-center gap-1.5 transition-colors ${
                      matches.length > 0
                        ? 'bg-prajna-red text-white hover:bg-prajna-red-hover'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Download className="h-3.5 w-3.5" /> DOWNLOAD EXCEL
                  </button>
                </div>

                <div className="border border-prajna-blue/10 bg-cream-50 overflow-hidden">
                  <table className="min-w-full divide-y divide-prajna-blue/10 text-left text-xs">
                    <thead className="bg-cream-100 font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3">Roll Number</th>
                        <th className="px-4 py-3">Team Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-prajna-blue/10">
                      {matches.map((item, idx) => (
                        <tr key={idx} className="hover:bg-cream-100/50">
                          <td className="px-4 py-3 font-semibold text-slate-800">{item.member.name}</td>
                          <td className="px-4 py-3 font-mono text-slate-600">{item.member.rollNumber}</td>
                          <td className="px-4 py-3">
                            <span className="font-serif text-prajna-blue font-bold">{item.teamName}</span>
                            <span className="text-[10px] text-prajna-red font-mono block">{item.teamId}</span>
                          </td>
                        </tr>
                      ))}
                      {matches.length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center py-6 text-slate-400 font-semibold">
                            No students match the chosen directory cohort criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Problem Statements Admin Panel */}
      {activeTab === 'problems' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-prajna-blue uppercase">PROBLEM STATEMENTS PANEL</h3>
              <p className="text-slate-500 text-xs mt-0.5">Control live release status during Hackathon Day.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleReleaseAllProblems(true)}
                className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold tracking-widest uppercase py-2.5 px-4 flex items-center gap-1.5 transition-colors"
              >
                <Unlock className="h-3.5 w-3.5" /> UNLOCK ALL
              </button>

              <button
                onClick={() => handleReleaseAllProblems(false)}
                className="border border-prajna-red/20 bg-prajna-red/5 text-prajna-red text-[10px] font-bold tracking-widest uppercase py-2.5 px-4 flex items-center gap-1.5 transition-colors"
              >
                <Lock className="h-3.5 w-3.5" /> LOCK ALL
              </button>

              <button
                onClick={() => setShowAddProblem(true)}
                className="bg-prajna-red hover:bg-prajna-red-hover text-white text-[10px] font-bold tracking-widest uppercase py-2.5 px-4 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> ADD STATEMENT
              </button>
            </div>
          </div>

          {/* Add Problem Modal Form */}
          {showAddProblem && (
            <form onSubmit={handleAddProblem} className="bg-cream-100 border border-prajna-blue/10 p-6 max-w-xl">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-prajna-blue/10">
                <h4 className="font-serif font-bold text-prajna-blue">NEW PROBLEM TRACK</h4>
                <button type="button" onClick={() => setShowAddProblem(false)}><X className="h-5 w-5 text-slate-500" /></button>
              </div>

              <div className="space-y-4">

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Track Category</label>
                  <select
                    value={newProbCategory}
                    onChange={(e) => setNewProbCategory(e.target.value)}
                    className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="Agritech & Rural Automation">Agritech & Rural Automation</option>
                    <option value="Smart City & Urban Infrastructure">Smart City & Urban Infrastructure</option>
                    <option value="Healthcare Tech & Bio-Engineering">Healthcare Tech & Bio-Engineering</option>
                    <option value="Next-Gen Mobility & EVs">Next-Gen Mobility & EVs</option>
                    <option value="Green Energy & Power Grid">Green Energy & Power Grid</option>
                    <option value="Advanced Manufacturing & Industry 4.0">Advanced Manufacturing & Industry 4.0</option>
                    <option value="EdTech, Governance & Societal Tech">EdTech, Governance & Societal Tech</option>
                    <option value="Disaster Management, Defense & Space">Disaster Management, Defense & Space</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={newProbDesc}
                    onChange={(e) => setNewProbDesc(e.target.value)}
                    className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Attach Document (PDF, DOC, DOCX)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                  {newProbFileName && (
                    <span className="text-[10px] text-green-600 block mt-1 font-semibold">
                      ✓ Attached: {newProbFileName}
                    </span>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProblem(false)}
                    className="border border-slate-300 text-slate-500 text-[10px] font-bold tracking-widest uppercase py-2 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-prajna-red text-white text-[10px] font-bold tracking-widest uppercase py-2 px-6"
                  >
                    Save Track
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((prob) => (
              <div key={prob.id} className="bg-cream-100 border border-prajna-blue/10 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-end items-start mb-3">
                    <button
                      onClick={() => handleToggleProblemPublish(prob)}
                      className={`text-[9px] font-bold px-2 py-0.5 border flex items-center gap-1 ${
                        prob.status === 'PUBLISHED' 
                          ? 'border-green-600/20 bg-green-500/5 text-green-700' 
                          : 'border-prajna-red/20 bg-prajna-red/5 text-prajna-red'
                      }`}
                    >
                      {prob.status === 'PUBLISHED' ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      {prob.status}
                    </button>
                  </div>

                  <h4 className="font-serif font-bold text-prajna-blue mb-2 text-sm sm:text-base leading-tight">
                    {prob.category}
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed mb-6">{prob.description}</p>
                  {prob.fileUrl && (
                    <div className="mb-4 bg-cream-50 p-2 border border-prajna-blue/5 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]" title={prob.fileName}>
                        📎 {prob.fileName || 'Attached Document'}
                      </span>
                      <a 
                        href={prob.fileUrl} 
                        download={prob.fileName || 'problem_statement_document'}
                        className="text-[10px] text-prajna-blue hover:text-prajna-red font-bold uppercase tracking-wider"
                      >
                        Download
                      </a>
                    </div>
                  )}
                </div>

                <div className="border-t border-prajna-blue/5 pt-4 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">ID: {prob.id}</span>
                  <button
                    onClick={() => handleDeleteProblem(prob.id)}
                    className="text-prajna-red hover:text-prajna-red-hover flex items-center gap-0.5 text-[10px] font-bold"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Winners Tab control panel */}
      {activeTab === 'winners' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif font-bold text-lg text-prajna-blue uppercase">WINNERS SHOWCASE REGISTRY</h3>
              <p className="text-slate-500 text-xs mt-0.5">Manage podium details displayed publicly.</p>
            </div>
            
            <button
              onClick={() => setShowAddWinner(true)}
              className="bg-prajna-red hover:bg-prajna-red-hover text-white text-[10px] font-bold tracking-widest uppercase py-2.5 px-4 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> ADD WINNER
            </button>
          </div>

          {/* Add Winner Modal Form */}
          {showAddWinner && (
            <form onSubmit={handleAddWinner} className="bg-cream-100 border border-prajna-blue/10 p-6 max-w-xl">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-prajna-blue/10">
                <h4 className="font-serif font-bold text-prajna-blue">NEW PODIUM ENTRY</h4>
                <button type="button" onClick={() => setShowAddWinner(false)}><X className="h-5 w-5 text-slate-500" /></button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Edition Year *</label>
                    <input
                      type="text"
                      required
                      value={newWinYear}
                      onChange={(e) => setNewWinYear(e.target.value)}
                      className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Podium Position *</label>
                    <select
                      value={newWinPos}
                      onChange={(e) => setNewWinPos(e.target.value as any)}
                      className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800"
                    >
                      <option value="Winner">Winner</option>
                      <option value="Runner Up">Runner Up</option>
                      <option value="Special Mention">Special Mention</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Team Name *</label>
                    <input
                      type="text"
                      required
                      value={newWinTeam}
                      onChange={(e) => setNewWinTeam(e.target.value)}
                      className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={newWinProj}
                      onChange={(e) => setNewWinProj(e.target.value)}
                      className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Academic Departments *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSE & SoC"
                    value={newWinDept}
                    onChange={(e) => setNewWinDept(e.target.value)}
                    className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Members (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Aditya (CSE), Kalyani (Agri)"
                    value={newWinMembers}
                    onChange={(e) => setNewWinMembers(e.target.value)}
                    className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Project / Team Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewWinImg(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-cream-200 file:text-prajna-blue hover:file:bg-cream-300"
                  />
                  {newWinImg && (
                    <div className="mt-2 relative inline-block">
                      <img src={newWinImg} alt="Preview" className="h-16 w-24 object-cover border border-slate-200" />
                      <button
                        type="button"
                        onClick={() => setNewWinImg('')}
                        className="absolute -top-1.5 -right-1.5 bg-prajna-red text-white rounded-full p-0.5 hover:bg-prajna-red-hover"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Project Overview *</label>
                  <textarea
                    required
                    rows={3}
                    value={newWinDesc}
                    onChange={(e) => setNewWinDesc(e.target.value)}
                    className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddWinner(false)}
                    className="border border-slate-300 text-slate-500 text-[10px] font-bold tracking-widest uppercase py-2 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-prajna-red text-white text-[10px] font-bold tracking-widest uppercase py-2 px-6"
                  >
                    Save Entry
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {winners.map((win) => (
              <div key={win.id} className="bg-cream-100 border border-prajna-blue/10 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[9px] uppercase font-bold text-prajna-red tracking-wider">
                      {win.position} • PRAJNA {win.year}
                    </span>
                    <button
                      onClick={() => handleDeleteWinner(win.id)}
                      className="text-prajna-red hover:text-prajna-red-hover p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <h4 className="font-serif font-bold text-prajna-blue text-base mb-1">{win.projectName}</h4>
                  <span className="text-xs font-semibold text-slate-600 block mb-3">Team: {win.teamName} ({win.department})</span>
                  <p className="text-slate-600 text-xs leading-relaxed mb-4">{win.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {win.members.map((m, i) => (
                      <span key={i} className="text-[10px] bg-cream-50 text-prajna-blue border border-prajna-blue/10 px-2 py-0.5">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Memories Tab control panel */}
      {activeTab === 'memories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif font-bold text-lg text-prajna-blue uppercase">MEMORIES GALLERY PANEL</h3>
              <p className="text-slate-500 text-xs mt-0.5">Manage photo assets displayed in masonry archives.</p>
            </div>
            
            <button
              onClick={() => setShowAddMemory(true)}
              className="bg-prajna-red hover:bg-prajna-red-hover text-white text-[10px] font-bold tracking-widest uppercase py-2.5 px-4 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> ADD MEMORY PHOTO
            </button>
          </div>

          {/* Add Memory Modal Form */}
          {showAddMemory && (
            <form onSubmit={handleAddMemory} className="bg-cream-100 border border-prajna-blue/10 p-6 max-w-xl">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-prajna-blue/10">
                <h4 className="font-serif font-bold text-prajna-blue">NEW PHOTO ENTRY</h4>
                <button type="button" onClick={() => setShowAddMemory(false)}><X className="h-5 w-5 text-slate-500" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Photo Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Team Pitch Session"
                    value={newMemTitle}
                    onChange={(e) => setNewMemTitle(e.target.value)}
                    className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Category *</label>
                  <select
                    value={newMemCat}
                    onChange={(e) => setNewMemCat(e.target.value)}
                    className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800"
                  >
                    <option value="Coding">Coding</option>
                    <option value="Teams">Teams</option>
                    <option value="Judging">Judging</option>
                    <option value="Presentations">Presentations</option>
                    <option value="Mentors">Mentors</option>
                    <option value="Prize Distribution">Prize Distribution</option>
                    <option value="Group Photos">Group Photos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Memory Photo *</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewMemFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewMemUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-cream-200 file:text-prajna-blue hover:file:bg-cream-300"
                  />
                  {newMemUrl && (
                    <div className="mt-2 relative inline-block">
                      <img src={newMemUrl} alt="Preview" className="h-16 w-24 object-cover border border-slate-200" />
                      <button
                        type="button"
                        onClick={() => { setNewMemUrl(''); setNewMemFile(null); }}
                        className="absolute -top-1.5 -right-1.5 bg-prajna-red text-white rounded-full p-0.5 hover:bg-prajna-red-hover"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMemory(false)}
                    className="border border-slate-300 text-slate-500 text-[10px] font-bold tracking-widest uppercase py-2 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-prajna-red text-white text-[10px] font-bold tracking-widest uppercase py-2 px-6"
                  >
                    Save Photo
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {memories.map((mem) => (
              <div key={mem.id} className="bg-cream-100 border border-prajna-blue/10 overflow-hidden relative group">
                <div className="w-full h-44 overflow-hidden relative">
                  <img src={mem.imageUrl} alt={mem.title} className="w-full h-full object-cover grayscale scale-100" />
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDeleteMemory(mem.id)}
                      className="bg-prajna-red text-white p-2 rounded-full hover:bg-prajna-red-hover transition-colors"
                      title="Delete Photo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-cream-50">
                  <span className="text-[9px] uppercase font-bold text-prajna-red tracking-widest">{mem.category}</span>
                  <h4 className="font-serif text-xs font-semibold text-prajna-blue truncate mt-0.5">{mem.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Configuration Settings Tab */}
      {activeTab === 'config' && config && (
        <div className="bg-cream-100 border border-prajna-blue/10 p-6 md:p-8 max-w-3xl mx-auto space-y-6">
          <div className="border-l-2 border-prajna-red pl-4 py-1 mb-6">
            <h3 className="font-serif font-bold text-lg text-prajna-blue">EVENT REGISTRATION & PARAMETERS CONFIGURATION</h3>
            <p className="text-slate-500 text-xs mt-0.5">Control timeline, live deadlines, and allowed departments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Registration Status</label>
              <select
                value={config.status}
                onChange={(e) => handleConfigUpdate('status', e.target.value)}
                className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800 focus:outline-none"
              >
                <option value="OPEN">OPEN (Allow Submissions)</option>
                <option value="CLOSED">CLOSED (Block Submissions)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Venue Location</label>
              <input
                type="text"
                value={config.venue}
                onChange={(e) => handleConfigUpdate('venue', e.target.value)}
                className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Hackathon Start Date</label>
              <input
                type="datetime-local"
                value={config.startDate.substring(0, 16)}
                onChange={(e) => handleConfigUpdate('startDate', new Date(e.target.value).toISOString())}
                className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">Registration Deadline</label>
              <input
                type="datetime-local"
                value={config.deadline.substring(0, 16)}
                onChange={(e) => handleConfigUpdate('deadline', new Date(e.target.value).toISOString())}
                className="w-full bg-cream-50 border border-prajna-blue/15 px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-prajna-blue/10 flex justify-end">
            <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
              ✓ Parameter changes auto-save immediately to database
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
