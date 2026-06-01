export type AppState = 'upload' | 'analyzing' | 'results';

export type IssueSeverity = 'high' | 'medium' | 'low';

export type IssueType =
  | 'duplicate_charge'
  | 'upcoding'
  | 'unbundling'
  | 'service_not_rendered'
  | 'balance_billing'
  | 'incorrect_coding'
  | 'missing_insurance_adjustment'
  | 'other';

export interface BillIssue {
  type: IssueType;
  severity: IssueSeverity;
  line_item: string;
  description: string;
  disputed_amount: string;
  action: string;
}

export interface AssistanceProgram {
  name: string;
  description: string;
  eligibility_hint: string;
  url?: string;
}

export interface BillSummary {
  total_billed: string;
  issues_count: number;
  potential_savings: string;
  confidence: 'high' | 'medium' | 'low';
  headline: string;
}

export interface AnalysisResult {
  summary: BillSummary;
  issues: BillIssue[];
  assistance_programs: AssistanceProgram[];
  dispute_letter: string;
  next_steps: string[];
}
