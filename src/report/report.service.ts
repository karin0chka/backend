
import { IReport } from '../../interfaces/entities.interface';
import Report from '../.database/mongo/schemas/report.schema';

namespace ReportService {
  export async function createReport(report: Omit<IReport, 'user_id' | 'is_completed' | 'is_reviewed'>, userID: number) {
    const newReport = new Report({
      user_id: userID,
      title: report.title,
      description: report.description,
    });
    return await newReport.save();
  }

  
}

export default ReportService;
