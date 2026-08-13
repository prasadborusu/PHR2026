import * as XLSX from 'xlsx';
import { Team } from './db';

// Format columns automatically based on max cell text length
const autoFitColumns = (worksheet: XLSX.WorkSheet) => {
  const objectMaxLength: { width: number }[] = [];
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
  
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let maxWidth = 10; // Default min width
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      const cell = worksheet[cell_ref];
      if (cell && cell.v) {
        const textVal = cell.v.toString();
        if (textVal.length > maxWidth) {
          maxWidth = textVal.length;
        }
      }
    }
    objectMaxLength.push({ width: maxWidth + 3 }); // Padding
  }
  worksheet['!cols'] = objectMaxLength;
};

// Style Header row to look professional
const makeHeaderRowBold = (worksheet: XLSX.WorkSheet) => {
  // Freezes the first row
  worksheet['!views'] = [{ state: 'frozen', ySplit: 1 }];
};

export const excelExporter = {
  // FORMAT 1: Attendance Sheet
  exportAttendance: (teams: Team[]): void => {
    const data: any[] = [];
    
    // Header
    data.push(['Team ID', 'Team Name', 'Student Name', 'Roll No.', 'Branch', 'Section']);
    
    // Group members underneath grouped team IDs
    teams.forEach(team => {
      team.members.forEach((member, index) => {
        // Output Team ID & Team Name only once per group
        data.push([
          index === 0 ? team.id : '',
          index === 0 ? team.teamName : '',
          member.name,
          member.rollNumber,
          member.branch,
          member.section
        ]);
      });
      // Empty spacing row
      data.push(['', '', '', '', '', '']);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    makeHeaderRowBold(worksheet);
    autoFitColumns(worksheet);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, 'PRAJNA_2026_Attendance.xlsx');
  },

  // FORMAT 2: Master List
  exportMasterList: (teams: Team[]): void => {
    const data: any[] = [];
    
    // Header
    data.push(['Team ID', 'Team Name', 'Student Name', 'Branch', 'Roll No.', 'Mobile', 'Email']);
    
    teams.forEach(team => {
      team.members.forEach((member, index) => {
        data.push([
          index === 0 ? team.id : '',
          index === 0 ? team.teamName : '',
          member.name,
          member.branch,
          member.rollNumber,
          member.mobile,
          member.email
        ]);
      });
      data.push(['', '', '', '', '', '', '']);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    makeHeaderRowBold(worksheet);
    autoFitColumns(worksheet);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Master List');
    XLSX.writeFile(workbook, 'PRAJNA_2026_Total_Teams.xlsx');
  },

  // FORMAT 3: Year -> Branch -> Section Directory
  exportDirectorySheet: (
    teams: Team[],
    year: '3rd Year' | '4th Year',
    branch: string,
    section: string
  ): void => {
    const data: any[] = [];
    
    // Header
    data.push(['Student Name', 'Roll Number', 'Team ID', 'Team Name', 'Branch', 'Section']);

    teams.forEach(team => {
      team.members.forEach(member => {
        if (
          member.year === year &&
          member.branch.trim().toUpperCase() === branch.trim().toUpperCase() &&
          member.section.trim().toUpperCase() === section.trim().toUpperCase()
        ) {
          data.push([
            member.name,
            member.rollNumber,
            team.id,
            team.teamName,
            member.branch,
            member.section
          ]);
        }
      });
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    makeHeaderRowBold(worksheet);
    autoFitColumns(worksheet);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Directory');
    
    const formattedBranch = branch.replace(/[^a-zA-Z0-9]/g, '');
    const formattedSection = section.replace(/[^a-zA-Z0-9]/g, '');
    const yearPrefix = year === '3rd Year' ? '3rdYear' : '4thYear';
    XLSX.writeFile(workbook, `PRAJNA_2026_${yearPrefix}_${formattedBranch}_${formattedSection}.xlsx`);
  }
};
