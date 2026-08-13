import { Team, TeamMember, EventConfig } from './db';

export interface EligibilityResult {
  isValid: boolean;
  memberCount: boolean;
  womanCount: boolean;
  branchDiversity: boolean;
  academicYears: boolean;
  allFieldsComplete: boolean;
  reasons: string[];
}

const MEMBER_FIELDS: (keyof Omit<TeamMember, 'id'>)[] = [
  'name', 'gender', 'rollNumber', 'branch', 'section', 'year', 'mobile', 'email'
];

const isMemberFullyFilled = (m: Partial<TeamMember>): boolean => {
  return MEMBER_FIELDS.every(field => {
    const val = m[field];
    return typeof val === 'string' && val.trim() !== '';
  });
};

const isMemberPartiallyFilled = (m: Partial<TeamMember>): boolean => {
  const hasAny = MEMBER_FIELDS.some(field => {
    const val = m[field];
    return typeof val === 'string' && val.trim() !== '';
  });
  return hasAny && !isMemberFullyFilled(m);
};

const getMissingFields = (m: Partial<TeamMember>): string[] => {
  return MEMBER_FIELDS.filter(field => {
    const val = m[field];
    return !val || (typeof val === 'string' && val.trim() === '');
  }).map(field => {
    // Convert camelCase to readable label
    const labels: Record<string, string> = {
      name: 'Full Name', gender: 'Gender', rollNumber: 'Roll Number',
      branch: 'Branch', section: 'Section', year: 'Year',
      mobile: 'Mobile', email: 'Email'
    };
    return labels[field] || field;
  });
};

export const validateTeamEligibility = (
  members: Partial<TeamMember>[],
  config?: EventConfig
): EligibilityResult => {
  const reasons: string[] = [];
  
  // Custom configurations or fallbacks
  const minSize = config?.minTeamSize ?? 3;
  const maxSize = config?.maxTeamSize ?? 5;
  const minWoman = config?.minWomanCount ?? 1;
  const minBranches = config?.minBranchesCount ?? 2;
  const allowedYears = config?.allowedYears ?? ['3rd Year', '4th Year'];

  // 1. Team Size check
  const validMembers = members.filter(m => m && m.name && m.name.trim() !== '');
  const memberCountValid = validMembers.length >= minSize && validMembers.length <= maxSize;
  if (!memberCountValid) {
    if (validMembers.length < minSize) {
      reasons.push(`Add at least one more member. Minimum team size is ${minSize}.`);
    } else {
      reasons.push(`Remove excess members. Maximum team size is ${maxSize}.`);
    }
  }

  // 2. Female member requirement check
  const womenCount = validMembers.filter(m => m.gender === 'Female').length;
  const womanCountValid = womenCount >= minWoman;
  if (!womanCountValid) {
    reasons.push(minWoman === 1 ? "At least one female member is required." : `At least ${minWoman} female members are required.`);
  }

  // 3. Branch diversity check
  const branches = validMembers.map(m => m.branch?.trim().toUpperCase()).filter(Boolean);
  const uniqueBranches = new Set(branches);
  const branchDiversityValid = uniqueBranches.size >= minBranches;
  if (!branchDiversityValid && validMembers.length > 1) {
    reasons.push(`More than one branch is required in the team (minimum ${minBranches} different branches).`);
  }

  // 4. Year eligibility check
  const invalidYearsCount = validMembers.filter(m => !allowedYears.includes(m.year || '')).length;
  const academicYearsValid = invalidYearsCount === 0 && validMembers.length > 0;
  if (!academicYearsValid && validMembers.length > 0) {
    reasons.push(`Only ${allowedYears.join(' and ')} students are eligible.`);
  }

  // 5. All fields complete check — required members (first minSize) must have ALL fields filled,
  //    and optional members that are partially started must also be fully filled
  let allFieldsComplete = true;
  
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    const isRequired = i < minSize;
    
    if (isRequired) {
      if (!isMemberFullyFilled(m)) {
        allFieldsComplete = false;
        const missing = getMissingFields(m);
        reasons.push(`Member ${i + 1}: Please fill in ${missing.join(', ')}.`);
      }
    } else {
      // Optional member — if they started filling, they must complete all fields
      if (isMemberPartiallyFilled(m)) {
        allFieldsComplete = false;
        const missing = getMissingFields(m);
        reasons.push(`Member ${i + 1} (optional): Started but incomplete — please fill in ${missing.join(', ')} or clear all fields.`);
      }
    }
  }

  return {
    isValid: memberCountValid && womanCountValid && branchDiversityValid && academicYearsValid && allFieldsComplete,
    memberCount: memberCountValid,
    womanCount: womanCountValid,
    branchDiversity: branchDiversityValid && branches.length > 1,
    academicYears: academicYearsValid,
    allFieldsComplete,
    reasons
  };
};
