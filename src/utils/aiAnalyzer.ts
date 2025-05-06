
// AI analyzer for SecureCrypt that scans content for sensitive keywords

// Define sensitive keywords by category
const sensitiveKeywords = {
  financial: ['bank', 'credit', 'debit', 'salary', 'income', 'loan', 'finance', 'money', 'transaction', 'account'],
  identity: ['password', 'ssn', 'aadhaar', 'id', 'identity', 'passport', 'license', 'userid', 'username', 'social security'],
  professional: ['confidential', 'secret', 'private', 'sensitive', 'restricted', 'nda', 'contract', 'agreement', 'proprietary', 'classified'],
  personal: ['address', 'phone', 'email', 'dob', 'birthdate', 'medical', 'health', 'insurance', 'family', 'personal']
};

export interface AiAnalysisResult {
  shouldEncrypt: boolean;
  confidenceScore: number; // 0-100
  reason: string;
  detectedKeywords: string[];
  category: string | null;
}

export const analyzeContent = (content: string): AiAnalysisResult => {
  const result: AiAnalysisResult = {
    shouldEncrypt: false,
    confidenceScore: 0,
    reason: '',
    detectedKeywords: [],
    category: null
  };
  
  // Convert to lowercase for case-insensitive matching
  const lowerContent = content.toLowerCase();
  
  // Check each category of sensitive keywords
  let maxCategoryMatches = 0;
  let primaryCategory = null;
  
  for (const [category, keywords] of Object.entries(sensitiveKeywords)) {
    let categoryMatches = 0;
    
    for (const keyword of keywords) {
      if (lowerContent.includes(keyword.toLowerCase())) {
        result.detectedKeywords.push(keyword);
        categoryMatches++;
      }
    }
    
    // Determine the primary category based on most matches
    if (categoryMatches > maxCategoryMatches) {
      maxCategoryMatches = categoryMatches;
      primaryCategory = category;
    }
  }
  
  // Set the category if any sensitive keywords were found
  result.category = primaryCategory;
  
  // Calculate confidence score based on number of detected keywords
  const totalKeywords = result.detectedKeywords.length;
  
  if (totalKeywords > 0) {
    // More keywords = higher confidence
    result.confidenceScore = Math.min(100, totalKeywords * 20);
    result.shouldEncrypt = true;
    
    // Generate reason based on category and confidence
    if (result.category === 'financial') {
      result.reason = `Contains financial information (${result.detectedKeywords.join(', ')}). For financial privacy, encryption is recommended.`;
    } else if (result.category === 'identity') {
      result.reason = `Contains identity-related information (${result.detectedKeywords.join(', ')}). To prevent identity theft, encryption is strongly recommended.`;
    } else if (result.category === 'professional') {
      result.reason = `Contains confidential professional content (${result.detectedKeywords.join(', ')}). For maintaining confidentiality, encryption is recommended.`;
    } else if (result.category === 'personal') {
      result.reason = `Contains personal information (${result.detectedKeywords.join(', ')}). For privacy protection, encryption is recommended.`;
    }
  } else {
    result.reason = 'No sensitive information detected.';
  }
  
  return result;
};

// Function to analyze a filename for sensitive information
export const analyzeFilename = (filename: string): AiAnalysisResult => {
  // Get file extension and name
  const nameParts = filename.split('.');
  const extension = nameParts.length > 1 ? nameParts.pop()?.toLowerCase() : '';
  const name = nameParts.join('.');
  
  // High-risk file types that often contain sensitive data
  const sensitiveFileTypes = ['csv', 'xls', 'xlsx', 'pdf', 'doc', 'docx', 'txt', 'json'];
  
  // Check if this is a file type that commonly contains sensitive data
  const isSensitiveFileType = sensitiveFileTypes.includes(extension || '');
  
  // Check the filename against our sensitive keywords
  const filenameAnalysis = analyzeContent(name);
  
  // If the file is a sensitive type, increase the confidence
  if (isSensitiveFileType && filenameAnalysis.confidenceScore > 0) {
    filenameAnalysis.confidenceScore = Math.min(100, filenameAnalysis.confidenceScore + 20);
    filenameAnalysis.reason = `${filenameAnalysis.reason} The file type (.${extension}) often contains sensitive data.`;
  } else if (isSensitiveFileType) {
    filenameAnalysis.shouldEncrypt = true;
    filenameAnalysis.confidenceScore = 60;
    filenameAnalysis.reason = `The file type (.${extension}) often contains sensitive data.`;
  }
  
  return filenameAnalysis;
};
