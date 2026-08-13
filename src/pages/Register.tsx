import React from 'react';
import { dbService, Team, TeamMember, EventConfig, getSectionsForBranch } from '../lib/db';
import { validateTeamEligibility, EligibilityResult } from '../lib/eligibility';
import { ShieldCheck, User, ShieldAlert, Award, FileText, CheckCircle, Info, ChevronRight, X, Users, UserCheck, Layers, GraduationCap, AlertTriangle } from 'lucide-react';

interface RegisterProps {
  onNavigate: (page: string) => void;
  onSuccess: (registeredTeam: Team) => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigate, onSuccess }) => {
  const [config, setConfig] = React.useState<EventConfig | null>(null);
  const [step, setStep] = React.useState<1 | 2>(1);
  const [teamName, setTeamName] = React.useState('');
  const [college, setCollege] = React.useState('Mohan Babu University (MBU)');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize members structure
  const emptyMember = (): Omit<TeamMember, 'id'> => ({
    name: '',
    gender: '' as any,
    rollNumber: '',
    branch: '',
    section: '',
    year: '' as any,
    mobile: '',
    email: ''
  });

  const [members, setMembers] = React.useState<Omit<TeamMember, 'id'>[]>([
    emptyMember(),
    emptyMember(),
    emptyMember(),
    emptyMember(),
    emptyMember()
  ]);

  const [eligibility, setEligibility] = React.useState<EligibilityResult>({
    isValid: false,
    memberCount: false,
    womanCount: false,
    branchDiversity: false,
    academicYears: false,
    allFieldsComplete: false,
    reasons: []
  });

  React.useEffect(() => {
    // Initial load
    dbService.getEventConfig().then(setConfig);

    // Subscribe to realtime database updates
    const unsubscribe = dbService.subscribeToEventConfig((updated) => {
      setConfig((prev) => {
        if (!prev || JSON.stringify(prev) !== JSON.stringify(updated)) {
          return updated;
        }
        return prev;
      });
    });

    // Fallback polling for localStorage (useful if Supabase is offline or not configured)
    const interval = setInterval(() => {
      dbService.getEventConfig().then((latest) => {
        setConfig((prev) => {
          if (!prev || JSON.stringify(prev) !== JSON.stringify(latest)) {
            return latest;
          }
          return prev;
        });
      });
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Recalculate team eligibility on any inputs change
  React.useEffect(() => {
    if (config) {
      const result = validateTeamEligibility(members, config);
      setEligibility(result);
    }
  }, [members, config]);

  const [unlockedInputs, setUnlockedInputs] = React.useState<Record<string, boolean>>({});

  const unlockField = (key: string) => {
    setUnlockedInputs(prev => ({ ...prev, [key]: true }));
  };

  if (!config) return null;

  if (config.status !== 'OPEN') {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <div className="border border-prajna-red/20 bg-prajna-red/[0.02] p-10">
          <ShieldAlert className="h-12 w-12 text-prajna-red mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-prajna-blue font-bold mb-4">REGISTRATIONS CLOSED</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Registrations for PRAJNA 2026 are currently closed. If you have already registered, please look out for updates from organizers.
          </p>
          <button 
            onClick={() => onNavigate('home')}
            className="bg-prajna-blue text-white text-xs font-bold tracking-widest uppercase py-3 px-6 hover:bg-prajna-blue-hover transition-all"
          >
            RETURN HOME
          </button>
        </div>
      </div>
    );
  }

  const handleMemberChange = (index: number, field: keyof Omit<TeamMember, 'id'>, value: string) => {
    const updated = [...members];
    if (field === 'branch') {
      updated[index] = {
        ...updated[index],
        branch: value,
        section: ''
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value
      };
    }
    setMembers(updated);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eligibility.isValid || !teamName.trim()) return;

    // Check for duplicate Student IDs / Roll Numbers
    const filledMembers = members.filter(m => m.name && m.name.trim() !== '');
    const rollNumbers = filledMembers.map(m => m.rollNumber.trim().toUpperCase()).filter(Boolean);
    const uniqueRolls = new Set(rollNumbers);
    if (rollNumbers.length !== uniqueRolls.size) {
      alert("Error: Duplicate Student IDs / Roll Numbers detected. Every team member must have a unique Student ID.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Map members into proper Team schema formats
      const mappedMembers: TeamMember[] = filledMembers.map((m, idx) => ({
        ...m,
        id: `mem-${idx + 1}-${Date.now()}`
      }));

      const registered = await dbService.registerTeam({
        teamName: teamName.trim(),
        leaderName: mappedMembers[0].name, // Leader is Member 1
        college,
        members: mappedMembers
      });

      onSuccess(registered);
    } catch (err) {
      console.error(err);
      alert('Error registering team. Please check credentials or data fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Side: Steps Form Container */}
        <div className="lg:col-span-8 bg-cream-100 border border-prajna-blue/10 p-4 sm:p-6 md:p-10">
          <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-prajna-blue/10">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-prajna-red block mb-1">PRAJNA 2026</span>
              <h2 className="text-xl sm:text-2xl font-serif text-prajna-blue font-bold">TEAM REGISTRATION</h2>
            </div>
            
            <div className="flex gap-1.5 sm:gap-2">
              <span className={`h-2 w-6 sm:w-8 transition-colors ${step === 1 ? 'bg-prajna-red' : 'bg-prajna-blue/20'}`}></span>
              <span className={`h-2 w-6 sm:w-8 transition-colors ${step === 2 ? 'bg-prajna-red' : 'bg-prajna-blue/20'}`}></span>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} autoComplete="off" className="space-y-6 sm:space-y-8">
            {step === 1 ? (
              <div className="space-y-5 sm:space-y-6">
                <div className="border-l-2 border-prajna-red pl-3 sm:pl-4 py-1 mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-prajna-blue">STEP 1: TEAM INFORMATION</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Define your core team identity.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5 sm:mb-2" htmlFor="teamName">
                      Team Name *
                    </label>
                    <input
                      id="teamName"
                      name="team_name"
                      type="text"
                      required
                      autoComplete="off"
                      placeholder="e.g. Code Wizards"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full bg-cream-50 border border-prajna-blue/15 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-prajna-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2" htmlFor="college">
                      College / University *
                    </label>
                    <input
                      id="college"
                      name="college_institution"
                      type="text"
                      required
                      autoComplete="off"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full bg-cream-50 border border-prajna-blue/15 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-prajna-red"
                    />
                  </div>
                </div>

                <div className="bg-cream-50 border border-prajna-blue/5 p-4 sm:p-5 text-xs text-slate-600 leading-relaxed flex gap-3">
                  <Info className="h-5 w-5 text-prajna-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-prajna-blue">Registration Notice:</span>
                    <p className="mt-1">
                      Member 1 will automatically be assigned as the **Team Leader**. Ensure they provide their primary contact phone number and email for verification updates.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-prajna-blue/5">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!teamName.trim()}
                    className={`w-full sm:w-auto text-xs font-bold tracking-widest uppercase py-3.5 px-6 inline-flex items-center justify-center gap-1.5 transition-colors ${
                      teamName.trim()
                        ? 'bg-prajna-blue text-white hover:bg-prajna-blue-hover'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    CONTINUE TO MEMBERS <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                <div className="border-l-2 border-prajna-red pl-3 sm:pl-4 py-1 mb-2">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-prajna-blue">STEP 2: TEAM MEMBERS (3 TO 5 MEMBERS REQUIRED)</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Please provide structural details for 3 to 5 participants. Leave empty if not applicable.</p>
                </div>

                {members.map((member, idx) => {
                  const isLeader = idx === 0;
                  const prefix = isLeader ? 'leader' : `participant_m${idx + 1}`;
                  return (
                    <div key={idx} className="bg-cream-50 border border-prajna-blue/10 p-4 sm:p-6 space-y-4">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-prajna-blue bg-cream-200 px-3 py-1 inline-block">
                        MEMBER {idx + 1} {isLeader ? '(TEAM LEADER)' : idx >= 3 ? '(OPTIONAL)' : ''}
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
                        <div className="sm:col-span-2">
                          <label 
                            htmlFor={`${prefix}_fn`}
                            className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"
                          >
                            Full Name {idx < 3 && '*'}
                          </label>
                          <input
                            id={`${prefix}_fn`}
                            name={`${prefix}_fn`}
                            type="text"
                            readOnly={!isLeader && !unlockedInputs[`${idx}_fn`]}
                            onFocus={(e) => { e.currentTarget.removeAttribute('readonly'); unlockField(`${idx}_fn`); }}
                            autoComplete={isLeader ? "name" : "one-time-code"}
                            data-lpignore="true"
                            required={idx < 3}
                            value={member.name}
                            onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                            className="w-full bg-cream-100 border border-prajna-blue/10 px-3 py-2 text-sm sm:text-xs text-slate-800 focus:outline-none focus:border-prajna-red"
                          />
                        </div>

                        <div>
                          <label 
                            htmlFor={`${prefix}_gd`}
                            className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"
                          >
                            Gender {idx < 3 && '*'}
                          </label>
                          <select
                            id={`${prefix}_gd`}
                            name={`${prefix}_gd`}
                            autoComplete="off"
                            required={idx < 3}
                            value={member.gender}
                            onChange={(e) => handleMemberChange(idx, 'gender', e.target.value as any)}
                            className="w-full bg-cream-100 border border-prajna-blue/10 px-3 py-2 text-sm sm:text-xs text-slate-800 focus:outline-none focus:border-prajna-red"
                          >
                            <option value="">Select Gender</option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                          </select>
                        </div>

                        <div>
                          <label 
                            htmlFor={`${prefix}_rn`}
                            className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"
                          >
                            Roll Number {idx < 3 && '*'}
                          </label>
                          <input
                            id={`${prefix}_rn`}
                            name={`${prefix}_rn`}
                            type="text"
                            readOnly={!isLeader && !unlockedInputs[`${idx}_rn`]}
                            onFocus={(e) => { e.currentTarget.removeAttribute('readonly'); unlockField(`${idx}_rn`); }}
                            autoComplete="off"
                            data-lpignore="true"
                            required={idx < 3}
                            placeholder="e.g. 23CSE001"
                            value={member.rollNumber}
                            onChange={(e) => handleMemberChange(idx, 'rollNumber', e.target.value)}
                            className="w-full bg-cream-100 border border-prajna-blue/10 px-3 py-2 text-sm sm:text-xs text-slate-800 focus:outline-none focus:border-prajna-red"
                          />
                        </div>

                        <div>
                          <label 
                            htmlFor={`${prefix}_br`}
                            className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"
                          >
                            Branch {idx < 3 && '*'}
                          </label>
                          <select
                            id={`${prefix}_br`}
                            name={`${prefix}_br`}
                            autoComplete="off"
                            required={idx < 3}
                            value={member.branch}
                            onChange={(e) => handleMemberChange(idx, 'branch', e.target.value)}
                            className="w-full bg-cream-100 border border-prajna-blue/10 px-3 py-2 text-sm sm:text-xs text-slate-800 focus:outline-none focus:border-prajna-red"
                          >
                            <option value="">Select Branch</option>
                            {config.branches.map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label 
                            htmlFor={`${prefix}_sc`}
                            className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"
                          >
                            Section {idx < 3 && '*'}
                          </label>
                          <select
                            id={`${prefix}_sc`}
                            name={`${prefix}_sc`}
                            autoComplete="off"
                            required={idx < 3}
                            value={member.section}
                            onChange={(e) => handleMemberChange(idx, 'section', e.target.value)}
                            className="w-full bg-cream-100 border border-prajna-blue/10 px-3 py-2 text-sm sm:text-xs text-slate-800 focus:outline-none focus:border-prajna-red"
                          >
                            <option value="">Select Section</option>
                            {getSectionsForBranch(member.branch, config.sections).map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label 
                            htmlFor={`${prefix}_yr`}
                            className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"
                          >
                            Year {idx < 3 && '*'}
                          </label>
                          <select
                            id={`${prefix}_yr`}
                            name={`${prefix}_yr`}
                            autoComplete="off"
                            required={idx < 3}
                            value={member.year}
                            onChange={(e) => handleMemberChange(idx, 'year', e.target.value as any)}
                            className="w-full bg-cream-100 border border-prajna-blue/10 px-3 py-2 text-sm sm:text-xs text-slate-800 focus:outline-none focus:border-prajna-red"
                          >
                            <option value="">Select Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                          </select>
                        </div>

                        <div>
                          <label 
                            htmlFor={`${prefix}_ph`}
                            className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"
                          >
                            Mobile {idx < 3 && '*'}
                          </label>
                          <input
                            id={`${prefix}_ph`}
                            name={`${prefix}_ph`}
                            type={isLeader ? "tel" : "text"}
                            inputMode="tel"
                            readOnly={!isLeader && !unlockedInputs[`${idx}_ph`]}
                            onFocus={(e) => { e.currentTarget.removeAttribute('readonly'); unlockField(`${idx}_ph`); }}
                            autoComplete={isLeader ? "tel" : "one-time-code"}
                            data-lpignore="true"
                            required={idx < 3}
                            value={member.mobile}
                            onChange={(e) => handleMemberChange(idx, 'mobile', e.target.value)}
                            className="w-full bg-cream-100 border border-prajna-blue/10 px-3 py-2 text-sm sm:text-xs text-slate-800 focus:outline-none focus:border-prajna-red"
                          />
                        </div>

                        <div>
                          <label 
                            htmlFor={`${prefix}_em`}
                            className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1"
                          >
                            Email {idx < 3 && '*'}
                          </label>
                          <input
                            id={`${prefix}_em`}
                            name={`${prefix}_em`}
                            type={isLeader ? "email" : "text"}
                            inputMode="email"
                            readOnly={!isLeader && !unlockedInputs[`${idx}_em`]}
                            onFocus={(e) => { e.currentTarget.removeAttribute('readonly'); unlockField(`${idx}_em`); }}
                            autoComplete={isLeader ? "email" : "one-time-code"}
                            data-lpignore="true"
                            required={idx < 3}
                            value={member.email}
                            onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                            className="w-full bg-cream-100 border border-prajna-blue/10 px-3 py-2 text-sm sm:text-xs text-slate-800 focus:outline-none focus:border-prajna-red"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-4 pt-4 border-t border-prajna-blue/5">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full sm:w-auto text-xs font-bold tracking-widest uppercase border border-prajna-blue/10 hover:border-prajna-red px-6 py-3 transition-colors text-center"
                  >
                    GO BACK
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      if (!eligibility.isValid) {
                        const errorMsg = eligibility.reasons.length > 0 
                          ? eligibility.reasons.join('\n') 
                          : 'Please fill in all team leader and required member details.';
                        alert(`Cannot Register. The following criteria failed:\n\n${errorMsg}`);
                      } else {
                        handleFormSubmit(e);
                      }
                    }}
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto text-xs font-bold tracking-widest uppercase py-3.5 px-10 transition-colors shadow-sm bg-prajna-red text-white hover:bg-prajna-red-hover cursor-pointer text-center`}
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'COMPLETE REGISTRATION'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Side: Redesigned Eligibility Criteria Mockup Panel */}
        <div className="lg:col-span-4 sticky top-24 bg-white border border-slate-200/80 p-6 space-y-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 bg-cream-200 text-prajna-blue rounded-full">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-slate-900">
                ELIGIBILITY CRITERIA
              </h3>
              <p className="text-xs text-slate-500">
                Make sure your team meets all the rules before registration.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* 1. Team Size Card */}
            <div className="flex items-center justify-between p-4 bg-cream-50/50 border border-slate-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${eligibility.memberCount ? 'bg-green-100 text-green-700' : 'bg-red-50 text-prajna-red'}`}>
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">TEAM SIZE</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Min 3 and max 5 members.
                  </p>
                </div>
              </div>
              <div className={`text-center px-3 py-1.5 rounded-lg ${eligibility.memberCount ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-prajna-red border border-red-200'}`}>
                <span className="text-[11px] font-bold block leading-none">3 - 5</span>
                <span className="text-[8px] font-bold uppercase tracking-widest block mt-0.5 opacity-80">
                  {eligibility.memberCount ? 'VALID' : 'REQUIRED'}
                </span>
              </div>
            </div>

            {/* 2. Female Member Card */}
            <div className="flex items-center justify-between p-4 bg-cream-50/50 border border-slate-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${eligibility.womanCount ? 'bg-green-100 text-green-700' : 'bg-red-50 text-prajna-red'}`}>
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">FEMALE MEMBER</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    At least 1 female member.
                  </p>
                </div>
              </div>
              <div className={`text-center px-3 py-1.5 rounded-lg w-[72px] ${eligibility.womanCount ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-prajna-red border border-red-200'}`}>
                <span className="text-[11px] font-bold block leading-none">1</span>
                <span className="text-[8px] font-bold uppercase tracking-widest block mt-0.5 opacity-80">
                  {eligibility.womanCount ? 'VALID' : 'MINIMUM'}
                </span>
              </div>
            </div>

            {/* 3. Branch Diversity Card */}
            <div className="flex items-center justify-between p-4 bg-cream-50/50 border border-slate-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${eligibility.branchDiversity ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-prajna-blue'}`}>
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">BRANCH DIVERSITY</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    More than one branch is required.
                  </p>
                </div>
              </div>
              <div className={`text-center px-3 py-1.5 rounded-lg w-[72px] ${eligibility.branchDiversity ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-prajna-blue border border-blue-200'}`}>
                <span className="text-[11px] font-bold block leading-none">2+</span>
                <span className="text-[8px] font-bold uppercase tracking-widest block mt-0.5 opacity-80">
                  {eligibility.branchDiversity ? 'VALID' : 'REQUIRED'}
                </span>
              </div>
            </div>


            {/* 4. Year Eligibility Card */}
            <div className="flex items-center justify-between p-4 bg-cream-50/50 border border-slate-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${eligibility.academicYears ? 'bg-green-100 text-green-700' : 'bg-green-50 text-green-800'}`}>
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">YEAR ELIGIBILITY</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Only 3rd and 4th year students.
                  </p>
                </div>
              </div>
              <div className={`text-center px-3 py-1.5 rounded-lg ${eligibility.academicYears ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
                <span className="text-[11px] font-bold block leading-none">3rd / 4th</span>
                <span className="text-[8px] font-bold uppercase tracking-widest block mt-0.5 opacity-80">
                  {eligibility.academicYears ? 'VALID' : 'YEARS'}
                </span>
              </div>
            </div>

            {/* 5. All Fields Complete Card */}
            <div className="flex items-center justify-between p-4 bg-cream-50/50 border border-slate-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${eligibility.allFieldsComplete ? 'bg-green-100 text-green-700' : 'bg-orange-50 text-orange-600'}`}>
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">ALL FIELDS FILLED</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Every member's details must be complete.
                  </p>
                </div>
              </div>
              <div className={`text-center px-3 py-1.5 rounded-lg w-[72px] ${eligibility.allFieldsComplete ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-600 border border-orange-200'}`}>
                <span className="text-[11px] font-bold block leading-none">{eligibility.allFieldsComplete ? '✓' : '✗'}</span>
                <span className="text-[8px] font-bold uppercase tracking-widest block mt-0.5 opacity-80">
                  {eligibility.allFieldsComplete ? 'COMPLETE' : 'PENDING'}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            {eligibility.isValid && (
              <div className="border border-green-200 bg-green-50/30 p-4 rounded-lg flex items-start gap-3 transition-all duration-300">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-green-700 uppercase tracking-wider block">
                    TEAM ELIGIBLE ✓
                  </span>
                  <p className="text-[10px] text-slate-600 mt-1 leading-normal">
                    Your team satisfies all the above criteria. You can proceed with registration.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
