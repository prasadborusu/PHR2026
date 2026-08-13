import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client if credentials are provided in localStorage, env, or query params
const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  if (envUrl && envUrl.startsWith('http') && !envUrl.includes('YOUR_SUPABASE')) {
    return { url: envUrl, key: envKey };
  }
  
  const url = localStorage.getItem('PRAJNA_SUPABASE_URL') || '';
  const key = localStorage.getItem('PRAJNA_SUPABASE_ANON_KEY') || '';
  return { url, key };
};

const config = getSupabaseConfig();
console.log("Supabase Client Init Config:", { url: config.url, keyLength: config.key?.length });
export const supabase = config.url && config.url.startsWith('http') && config.key ? createClient(config.url, config.key) : null;

// Database Mocking Engine (LocalStorage Fallback)
export interface EventConfig {
  startDate: string;
  endDate: string;
  deadline: string;
  venue: string;
  status: 'OPEN' | 'CLOSED';
  hoursCount: number;
  teamsCount: number;
  participantsCount: number;
  projectsCount: number;
  branches: string[];
  sections: string[];
  minTeamSize: number;
  maxTeamSize: number;
  minWomanCount: number;
  minBranchesCount: number;
  allowedYears: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  gender: 'Female' | 'Male';
  rollNumber: string;
  branch: string;
  section: string;
  year: '3rd Year' | '4th Year';
  mobile: string;
  email: string;
}

export const getSectionsForBranch = (branch: string, defaultSections: string[] = ['A', 'B', 'C', 'D', 'E', 'F']): string[] => {
  if (branch && branch.toUpperCase() === 'AIML') {
    return ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12'];
  }
  return defaultSections;
};


export interface Team {
  id: string; // generated unique ID like PRJ001
  teamName: string;
  leaderName: string;
  college: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  members: TeamMember[];
}

export interface ProblemStatement {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'LOCKED' | 'PUBLISHED';
  publishedAt?: string;
  createdAt: string;
  fileUrl?: string;
  fileName?: string;
}

export interface PastEdition {
  id: string;
  year: string;
  teams: number;
  participants: number;
  linkText: string;
}

export interface Winner {
  id: string;
  year: string;
  position: 'Winner' | 'Runner Up' | 'Special Mention';
  teamName: string;
  projectName: string;
  department: string;
  members: string[];
  description: string;
  imageUrl?: string;
}

export interface Memory {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

// Initial default configuration parameters
const DEFAULT_EVENT_CONFIG: EventConfig = {
  startDate: '2026-08-19T09:00:00',
  endDate: '2026-08-20T21:00:00',
  deadline: '2026-08-12T23:59:59',
  venue: 'SoE & SoC Blocks, Mohan Babu University',
  status: 'OPEN',
  hoursCount: 36,
  teamsCount: 120,
  participantsCount: 480,
  projectsCount: 120,
  branches: ['CSE', 'ECE', 'EEE', 'ME', 'CIVIL', 'AIML', 'DS', 'CS', 'IT'],
  sections: ['A', 'B', 'C', 'D', 'E', 'F'],
  minTeamSize: 3,
  maxTeamSize: 5,
  minWomanCount: 1,
  minBranchesCount: 2,
  allowedYears: ['3rd Year', '4th Year']
};

const DEFAULT_PROBLEMS: ProblemStatement[] = [
  {
    id: 'prob-1',
    title: 'Smart Campus Navigation System using AR',
    description: 'Design and prototype a mobile application to guide visitors and new students through the campus buildings (SoE and SoC) using Augmented Reality overlays.',
    category: 'Smart City & Urban Infrastructure',
    status: 'LOCKED',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prob-2',
    title: 'Automated Smart Energy Grid for University Blocks',
    description: 'Create an intelligent grid distribution simulator to optimize power consumption during peak lab hours, with dashboard controls.',
    category: 'Green Energy & Power Grid',
    status: 'LOCKED',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prob-3',
    title: 'AI-Based Assessment and Attendance System',
    description: 'Implement a secure, multi-camera student identification framework utilizing facial biometrics and gaze estimation to automate attendance sheets.',
    category: 'EdTech, Governance & Societal Tech',
    status: 'LOCKED',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_WINNERS: Winner[] = [];

const DEFAULT_PAST_EDITIONS: PastEdition[] = [
  { id: 'past-1', year: '2025', teams: 108, participants: 432, linkText: 'View Memories →' },
  { id: 'past-2', year: '2024', teams: 95, participants: 380, linkText: 'View Memories →' },
  { id: 'past-3', year: '2023', teams: 80, participants: 320, linkText: 'View Memories →' }
];

const DEFAULT_MEMORIES: Memory[] = [];

// Initialize mock DB
const initializeMockDB = () => {
  if (!localStorage.getItem('PRAJNA_EVENT_CONFIG')) {
    localStorage.setItem('PRAJNA_EVENT_CONFIG', JSON.stringify(DEFAULT_EVENT_CONFIG));
  }
  if (!localStorage.getItem('PRAJNA_PROBLEMS')) {
    localStorage.setItem('PRAJNA_PROBLEMS', JSON.stringify(DEFAULT_PROBLEMS));
  }
  if (!localStorage.getItem('PRAJNA_WINNERS')) {
    localStorage.setItem('PRAJNA_WINNERS', JSON.stringify(DEFAULT_WINNERS));
  }
  if (!localStorage.getItem('PRAJNA_PAST_EDITIONS')) {
    localStorage.setItem('PRAJNA_PAST_EDITIONS', JSON.stringify(DEFAULT_PAST_EDITIONS));
  }
  if (!localStorage.getItem('PRAJNA_MEMORIES')) {
    localStorage.setItem('PRAJNA_MEMORIES', JSON.stringify(DEFAULT_MEMORIES));
  }
  if (!localStorage.getItem('PRAJNA_TEAMS')) {
    localStorage.setItem('PRAJNA_TEAMS', JSON.stringify([]));
  }
};

initializeMockDB();

// Database Service API
export const dbService = {
  // Config
  getEventConfig: async (): Promise<EventConfig> => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('event_config')
          .select('*')
          .single();
        if (!error && data) {
          let updatedStartDate = data.start_date;
          let updatedEndDate = data.end_date;
          let updatedDeadline = data.deadline;
          let needsUpdate = false;

          if (data.start_date && !data.start_date.startsWith('2026-08-19')) {
            updatedStartDate = '2026-08-19T09:00:00';
            needsUpdate = true;
          }
          if (data.end_date && !data.end_date.startsWith('2026-08-20')) {
            updatedEndDate = '2026-08-20T21:00:00';
            needsUpdate = true;
          }
          if (data.deadline && !data.deadline.startsWith('2026-08-12')) {
            updatedDeadline = '2026-08-12T23:59:59';
            needsUpdate = true;
          }

          const config: EventConfig = {
            startDate: updatedStartDate,
            endDate: updatedEndDate,
            deadline: updatedDeadline,
            venue: data.venue,
            status: data.status,
            hoursCount: data.hours_count,
            teamsCount: data.teams_count,
            participantsCount: data.participants_count,
            projectsCount: data.projects_count,
            branches: data.branches,
            sections: data.sections,
            minTeamSize: data.min_team_size,
            maxTeamSize: data.max_team_size,
            minWomanCount: data.min_woman_count,
            minBranchesCount: data.min_branches_count,
            allowedYears: data.allowed_years
          };

          if (needsUpdate) {
            await dbService.saveEventConfig(config);
          }

          return config;
        }
      }
    } catch (e) {
      console.warn("Supabase fetch event_config failed, falling back to localStorage", e);
    }
    const local = localStorage.getItem('PRAJNA_EVENT_CONFIG');
    const parsed: EventConfig = local ? JSON.parse(local) : DEFAULT_EVENT_CONFIG;
    if (parsed.startDate && !parsed.startDate.startsWith('2026-08-19')) {
      parsed.startDate = '2026-08-19T09:00:00';
      parsed.endDate = '2026-08-20T21:00:00';
      parsed.deadline = '2026-08-12T23:59:59';
      localStorage.setItem('PRAJNA_EVENT_CONFIG', JSON.stringify(parsed));
      if (supabase) {
        try {
          await dbService.saveEventConfig(parsed);
        } catch (dbErr) {
          console.warn("Could not save migrated config to Supabase", dbErr);
        }
      }
    }
    return parsed;
  },
  saveEventConfig: async (config: EventConfig): Promise<void> => {
    localStorage.setItem('PRAJNA_EVENT_CONFIG', JSON.stringify(config));
    try {
      if (supabase) {
        await supabase
          .from('event_config')
          .upsert({
            id: 1,
            start_date: config.startDate,
            end_date: config.endDate,
            deadline: config.deadline,
            venue: config.venue,
            status: config.status,
            hours_count: config.hoursCount,
            teams_count: config.teamsCount,
            participants_count: config.participantsCount,
            projects_count: config.projectsCount,
            branches: config.branches,
            sections: config.sections,
            min_team_size: config.minTeamSize,
            max_team_size: config.maxTeamSize,
            min_woman_count: config.minWomanCount,
            min_branches_count: config.minBranchesCount,
            allowed_years: config.allowedYears
          });
      }
    } catch (e) {
      console.warn("Supabase save event_config failed", e);
    }
  },
  subscribeToEventConfig: (callback: (config: EventConfig) => void): (() => void) => {
    if (!supabase) return () => {};

    const uniqueId = Math.random().toString(36).substring(2, 11);
    const channel = supabase
      .channel(`realtime_event_config_${uniqueId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'event_config' },
        (payload) => {
          const data = payload.new as any;
          if (data) {
            const config: EventConfig = {
              startDate: data.start_date,
              endDate: data.end_date,
              deadline: data.deadline,
              venue: data.venue,
              status: data.status,
              hoursCount: data.hours_count,
              teamsCount: data.teams_count,
              participantsCount: data.participants_count,
              projectsCount: data.projects_count,
              branches: data.branches,
              sections: data.sections,
              minTeamSize: data.min_team_size,
              maxTeamSize: data.max_team_size,
              minWomanCount: data.min_woman_count,
              minBranchesCount: data.min_branches_count,
              allowedYears: data.allowed_years
            };
            localStorage.setItem('PRAJNA_EVENT_CONFIG', JSON.stringify(config));
            callback(config);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Teams
  getTeams: async (): Promise<Team[]> => {
    // Always load localStorage data as a fallback source
    const localData = localStorage.getItem('PRAJNA_TEAMS');
    const localTeams: Team[] = localData ? JSON.parse(localData) : [];
    const localTeamsMap = new Map<string, Team>();
    localTeams.forEach(t => localTeamsMap.set(t.id, t));

    try {
      if (supabase) {
        const { data: teamsData, error: teamsErr } = await supabase
          .from('teams')
          .select('*');
        
        const { data: membersData, error: membersErr } = await supabase
          .from('team_members')
          .select('*');

        if (membersErr) {
          console.warn("Supabase fetch team_members failed:", membersErr);
        }

        if (!teamsErr && teamsData) {
          const supabaseTeams = teamsData.map(team => {
            const teamMembers = (membersData || [])
              .filter(m => m.team_id === team.id && m.name && m.name.trim() !== '')
              .map(m => ({
                id: m.id,
                name: m.name || '',
                gender: m.gender === 'Woman' ? 'Female' : m.gender === 'Man' ? 'Male' : (m.gender || '') as any,
                rollNumber: m.roll_number || '',
                branch: m.branch || '',
                section: m.section || '',
                year: m.year || '',
                mobile: m.mobile || '',
                email: m.email || ''
              }));
            
            // If Supabase has no members for this team, try localStorage fallback
            let finalMembers = teamMembers;
            if (finalMembers.length === 0) {
              const localTeam = localTeamsMap.get(team.id);
              if (localTeam && localTeam.members && localTeam.members.length > 0) {
                finalMembers = localTeam.members.filter(m => m.name && m.name.trim() !== '');
                console.log(`Team ${team.id}: Using localStorage members as fallback (${finalMembers.length} members)`);
              }
            }

            return {
              id: team.id,
              teamName: team.team_name,
              leaderName: team.leader_name,
              college: team.college,
              status: team.status === 'PENDING' ? 'APPROVED' : team.status,
              createdAt: team.created_at,
              members: finalMembers
            };
          });

          // Sync localStorage with current Supabase state
          localStorage.setItem('PRAJNA_TEAMS', JSON.stringify(supabaseTeams));
          return supabaseTeams;
        }
      }
    } catch (e) {
      console.warn("Supabase fetch teams failed, falling back to localStorage", e);
    }
    return localTeams.map(t => ({
      ...t,
      status: t.status === 'PENDING' ? 'APPROVED' : t.status,
      members: (t.members || []).filter(m => m.name && m.name.trim() !== '')
    }));
  },
  registerTeam: async (teamData: Omit<Team, 'id' | 'status' | 'createdAt'>): Promise<Team> => {
    const teams = await dbService.getTeams();
    
    // Generate next unique Team ID
    const pad = (num: number, size: number) => {
      let s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    };
    const nextIdNumber = teams.length + 1;
    const teamId = `PRJ${pad(nextIdNumber, 3)}`;

    const newTeam: Team = {
      ...teamData,
      id: teamId,
      status: 'APPROVED',
      createdAt: new Date().toISOString()
    };

    // Save to local storage
    const localTeams = localStorage.getItem('PRAJNA_TEAMS');
    const parsedLocal = localTeams ? JSON.parse(localTeams) : [];
    parsedLocal.push(newTeam);
    localStorage.setItem('PRAJNA_TEAMS', JSON.stringify(parsedLocal));

    // Save to Supabase
    try {
      if (supabase) {
        // Insert team row
        const { error: teamErr } = await supabase
          .from('teams')
          .insert({
            id: newTeam.id,
            team_name: newTeam.teamName,
            leader_name: newTeam.leaderName,
            college: newTeam.college,
            status: newTeam.status,
            created_at: newTeam.createdAt
          });

        if (teamErr) {
          console.error("Supabase team insert failed details:", teamErr);
          throw new Error(`Team insert failed: ${teamErr.message} (${teamErr.code})`);
        }

        // Insert member rows
        if (newTeam.members && newTeam.members.length > 0) {
          const insertableMembers = newTeam.members.map(m => ({
            id: m.id,
            team_id: newTeam.id,
            name: m.name,
            gender: m.gender === 'Female' ? 'Woman' : m.gender === 'Male' ? 'Man' : m.gender,
            roll_number: m.rollNumber,
            branch: m.branch,
            section: m.section,
            year: m.year,
            mobile: m.mobile,
            email: m.email
          }));
          const { error: membersErr } = await supabase
            .from('team_members')
            .insert(insertableMembers);

          if (membersErr) {
            console.error("Supabase team_members insert failed details:", membersErr);
            throw new Error(`Members insert failed: ${membersErr.message} (${membersErr.code})`);
          }
        }
      }
    } catch (e: any) {
      console.error("Supabase team registration sync failed:", e);
      // Re-throw so the frontend is aware of the database failure
      throw e;
    }

    return newTeam;
  },
  updateTeamStatus: async (id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED'): Promise<void> => {
    // Local
    const localData = localStorage.getItem('PRAJNA_TEAMS');
    if (localData) {
      const parsed = JSON.parse(localData);
      const updated = parsed.map((t: any) => t.id === id ? { ...t, status } : t);
      localStorage.setItem('PRAJNA_TEAMS', JSON.stringify(updated));
    }

    // Supabase
    try {
      if (supabase) {
        await supabase
          .from('teams')
          .update({ status })
          .eq('id', id);
      }
    } catch (e) {
      console.warn("Supabase team update status failed", e);
    }
  },
  deleteTeam: async (id: string): Promise<void> => {
    // Local
    const localData = localStorage.getItem('PRAJNA_TEAMS');
    if (localData) {
      const parsed = JSON.parse(localData);
      const filtered = parsed.filter((t: any) => t.id !== id);
      localStorage.setItem('PRAJNA_TEAMS', JSON.stringify(filtered));
    }

    // Supabase
    try {
      if (supabase) {
        // Cascades deletes using foreign keys referencing team_members table
        await supabase
          .from('teams')
          .delete()
          .eq('id', id);
      }
    } catch (e) {
      console.warn("Supabase team deletion failed", e);
    }
  },

  // Problems
  getProblems: async (): Promise<ProblemStatement[]> => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('problem_statements')
          .select('*')
          .order('created_at', { ascending: true });
        if (!error && data) {
          return data.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            category: p.category,
            status: p.status,
            publishedAt: p.published_at || undefined,
            createdAt: p.created_at,
            fileUrl: p.file_url || undefined,
            fileName: p.file_name || undefined
          }));
        }
      }
    } catch (e) {
      console.warn("Supabase fetch problems failed, falling back to localStorage", e);
    }
    return JSON.parse(localStorage.getItem('PRAJNA_PROBLEMS') || '[]');
  },
  saveProblem: async (problem: ProblemStatement): Promise<void> => {
    // Local fallback
    const problems = await dbService.getProblems();
    const exists = problems.findIndex(p => p.id === problem.id);
    if (exists >= 0) {
      problems[exists] = problem;
    } else {
      problems.push(problem);
    }
    localStorage.setItem('PRAJNA_PROBLEMS', JSON.stringify(problems));

    // Supabase
    try {
      if (supabase) {
        const supabaseItem = {
          id: problem.id,
          title: problem.title,
          description: problem.description,
          category: problem.category,
          status: problem.status,
          published_at: problem.publishedAt || null,
          created_at: problem.createdAt,
          file_url: problem.fileUrl || null,
          file_name: problem.fileName || null
        };
        const { error } = await supabase
          .from('problem_statements')
          .upsert(supabaseItem, { onConflict: 'id' });
        if (error) throw error;
      }
    } catch (e) {
      console.warn("Supabase save problem failed", e);
    }
  },
  deleteProblem: async (id: string): Promise<void> => {
    // Local fallback
    const problems = await dbService.getProblems();
    const filtered = problems.filter(p => p.id !== id);
    localStorage.setItem('PRAJNA_PROBLEMS', JSON.stringify(filtered));

    // Supabase
    try {
      if (supabase) {
        const { error } = await supabase
          .from('problem_statements')
          .delete()
          .eq('id', id);
        if (error) throw error;
      }
    } catch (e) {
      console.warn("Supabase delete problem failed", e);
    }
  },
  uploadProblemFile: async (file: File): Promise<{ publicUrl: string; error?: string }> => {
    try {
      if (!supabase) {
        return { publicUrl: '', error: 'Supabase client not initialized' };
      }
      const filePath = `problems/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('problem-attachments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage
        .from('problem-attachments')
        .getPublicUrl(filePath);
      return { publicUrl };
    } catch (e: any) {
      console.warn("Supabase storage upload failed", e);
      return { publicUrl: '', error: e.message };
    }
  },

  // Winners
  getWinners: async (): Promise<Winner[]> => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('winners')
          .select('*')
          .order('year', { ascending: false });
        if (!error && data) {
          return data.map(w => ({
            id: w.id,
            year: w.year,
            position: w.position as any,
            teamName: w.team_name,
            projectName: w.project_name,
            department: w.department,
            members: w.members,
            description: w.description,
            imageUrl: w.image_url || undefined
          }));
        }
      }
    } catch (e) {
      console.warn("Supabase fetch winners failed, falling back to localStorage", e);
    }
    return JSON.parse(localStorage.getItem('PRAJNA_WINNERS') || '[]');
  },
  saveWinner: async (winner: Winner): Promise<void> => {
    // Local fallback
    const winners = await dbService.getWinners();
    const exists = winners.findIndex(w => w.id === winner.id);
    if (exists >= 0) {
      winners[exists] = winner;
    } else {
      winners.push(winner);
    }
    localStorage.setItem('PRAJNA_WINNERS', JSON.stringify(winners));

    // Supabase
    try {
      if (supabase) {
        const { error } = await supabase
          .from('winners')
          .upsert({
            id: winner.id,
            year: winner.year,
            position: winner.position,
            team_name: winner.teamName,
            project_name: winner.projectName,
            department: winner.department,
            members: winner.members,
            description: winner.description,
            image_url: winner.imageUrl || null
          }, { onConflict: 'id' });
        if (error) throw error;
      }
    } catch (e) {
      console.warn("Supabase save winner failed", e);
    }
  },
  deleteWinner: async (id: string): Promise<void> => {
    // Local fallback
    const winners = await dbService.getWinners();
    const filtered = winners.filter(w => w.id !== id);
    localStorage.setItem('PRAJNA_WINNERS', JSON.stringify(filtered));

    // Supabase
    try {
      if (supabase) {
        const { error } = await supabase
          .from('winners')
          .delete()
          .eq('id', id);
        if (error) throw error;
      }
    } catch (e) {
      console.warn("Supabase delete winner failed", e);
    }
  },
  uploadWinnerImage: async (file: File): Promise<{ publicUrl: string; error?: string }> => {
    try {
      if (!supabase) return { publicUrl: '', error: 'Supabase client not initialized' };
      const filePath = `winners/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('winner-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('winner-images').getPublicUrl(filePath);
      return { publicUrl };
    } catch (e: any) {
      console.warn("Supabase winner image upload failed", e);
      return { publicUrl: '', error: e.message };
    }
  },
  subscribeToWinners: (callback: (winners: Winner[]) => void): (() => void) => {
    if (!supabase) return () => {};
    const uniqueId = Math.random().toString(36).substring(2, 11);
    const channel = supabase
      .channel(`realtime_winners_${uniqueId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'winners' },
        async () => {
          const latest = await dbService.getWinners();
          callback(latest);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Memories
  getMemories: async (): Promise<Memory[]> => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('memories')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data.map(m => ({
            id: m.id,
            title: m.title,
            imageUrl: m.image_url,
            category: m.category,
            createdAt: m.created_at
          }));
        }
      }
    } catch (e) {
      console.warn("Supabase fetch memories failed, falling back to localStorage", e);
    }
    return JSON.parse(localStorage.getItem('PRAJNA_MEMORIES') || '[]');
  },
  addMemory: async (memory: Memory): Promise<void> => {
    // Local fallback
    const memories = await dbService.getMemories();
    memories.push(memory);
    localStorage.setItem('PRAJNA_MEMORIES', JSON.stringify(memories));

    // Supabase
    try {
      if (supabase) {
        const { error } = await supabase
          .from('memories')
          .insert({
            id: memory.id,
            title: memory.title,
            image_url: memory.imageUrl,
            category: memory.category,
            created_at: memory.createdAt
          });
        if (error) throw error;
      }
    } catch (e) {
      console.warn("Supabase add memory failed", e);
    }
  },
  deleteMemory: async (id: string): Promise<void> => {
    // Local fallback
    const memories = await dbService.getMemories();
    const filtered = memories.filter(m => m.id !== id);
    localStorage.setItem('PRAJNA_MEMORIES', JSON.stringify(filtered));

    // Supabase
    try {
      if (supabase) {
        const { error } = await supabase
          .from('memories')
          .delete()
          .eq('id', id);
        if (error) throw error;
      }
    } catch (e) {
      console.warn("Supabase delete memory failed", e);
    }
  },
  uploadMemoryImage: async (file: File): Promise<{ publicUrl: string; error?: string }> => {
    try {
      if (!supabase) return { publicUrl: '', error: 'Supabase client not initialized' };
      const filePath = `memories/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('memory-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('memory-images').getPublicUrl(filePath);
      return { publicUrl };
    } catch (e: any) {
      console.warn("Supabase memory image upload failed", e);
      return { publicUrl: '', error: e.message };
    }
  },
  subscribeToMemories: (callback: (memories: Memory[]) => void): (() => void) => {
    if (!supabase) return () => {};
    const uniqueId = Math.random().toString(36).substring(2, 11);
    const channel = supabase
      .channel(`realtime_memories_${uniqueId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'memories' },
        async () => {
          const latest = await dbService.getMemories();
          callback(latest);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Past Editions
  getPastEditions: async (): Promise<PastEdition[]> => {
    return JSON.parse(localStorage.getItem('PRAJNA_PAST_EDITIONS') || '[]');
  },
  savePastEdition: async (edition: PastEdition): Promise<void> => {
    const editions = await dbService.getPastEditions();
    const exists = editions.findIndex(e => e.id === edition.id);
    if (exists >= 0) {
      editions[exists] = edition;
    } else {
      editions.push(edition);
    }
    localStorage.setItem('PRAJNA_PAST_EDITIONS', JSON.stringify(editions));
  },
  deletePastEdition: async (id: string): Promise<void> => {
    const editions = await dbService.getPastEditions();
    const filtered = editions.filter(e => e.id !== id);
    localStorage.setItem('PRAJNA_PAST_EDITIONS', JSON.stringify(filtered));
  }
};
