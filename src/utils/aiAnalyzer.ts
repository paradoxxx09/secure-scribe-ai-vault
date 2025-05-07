
// AI analyzer for SecureCrypt that scans content for sensitive keywords

// Define sensitive keywords by category
const sensitiveKeywords = {
  financial: ['bank', 'credit', 'debit', 'salary', 'income', 'loan', 'finance', 'money', 'transaction', 'account', '₹', '$', '€', '£', 'payment'],
  identity: ['password', 'ssn', 'aadhaar', 'id', 'identity', 'passport', 'license', 'userid', 'username', 'social security', 'dob', 'birthdate', 'birth'],
  professional: ['confidential', 'secret', 'private', 'sensitive', 'restricted', 'nda', 'contract', 'agreement', 'proprietary', 'classified', 'confidential'],
  personal: ['address', 'phone', 'email', 'dob', 'birthdate', 'medical', 'health', 'insurance', 'family', 'personal', 'home']
};

export interface AiAnalysisResult {
  shouldEncrypt: boolean;
  confidenceScore: number; // 0-100
  reason: string;
  detectedKeywords: string[];
  category: string | null;
  detailedExplanation: string; // Added for explainable AI feature
  riskLevel: 'low' | 'medium' | 'high'; // Added for risk assessment
}

// Helper function to get risk level based on confidence score
const getRiskLevel = (score: number): 'low' | 'medium' | 'high' => {
  if (score >= 80) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

// Generate detailed explanation for the analysis
const generateDetailedExplanation = (
  category: string | null, 
  keywords: string[], 
  confidenceScore: number
): string => {
  if (!category || keywords.length === 0) {
    return "No sensitive information was detected in this content.";
  }
  
  // Build explanation based on category and keywords
  let explanation = "";
  
  // Start with confidence statement
  if (confidenceScore > 80) {
    explanation = `There is a high likelihood (${confidenceScore}%) that this content contains sensitive ${category} information. `;
  } else if (confidenceScore > 40) {
    explanation = `There is a moderate likelihood (${confidenceScore}%) that this content contains sensitive ${category} information. `;
  } else {
    explanation = `There is a low likelihood (${confidenceScore}%) that this content contains sensitive ${category} information. `;
  }
  
  // Add category-specific details
  if (category === 'financial') {
    explanation += "Financial information typically includes banking details, transaction records, or monetary values. ";
    explanation += "This data could be used for financial fraud if accessed by unauthorized parties. ";
  } else if (category === 'identity') {
    explanation += "Identity information can include personal identifiers that could be used for identity theft. ";
    explanation += "Protecting this data is crucial to prevent unauthorized access to your accounts or identity fraud. ";
  } else if (category === 'professional') {
    explanation += "Professional or business information often includes proprietary data, work products, or confidential agreements. ";
    explanation += "Encrypting this data helps maintain business confidentiality and protect intellectual property. ";
  } else if (category === 'personal') {
    explanation += "Personal information includes details about your private life that should be kept confidential. ";
    explanation += "Encryption helps protect your privacy and prevents unwanted information disclosure. ";
  }
  
  // Mention detected keywords
  if (keywords.length === 1) {
    explanation += `The term "${keywords[0]}" was detected, which often indicates sensitive information.`;
  } else if (keywords.length === 2) {
    explanation += `The terms "${keywords[0]}" and "${keywords[1]}" were detected, which often indicate sensitive information.`;
  } else if (keywords.length > 2) {
    const mainKeywords = keywords.slice(0, 3).join('", "');
    explanation += `Terms like "${mainKeywords}", and ${keywords.length - 3} other sensitive indicators were detected.`;
  }
  
  return explanation;
};

export const analyzeContent = (content: string): AiAnalysisResult => {
  const result: AiAnalysisResult = {
    shouldEncrypt: false,
    confidenceScore: 0,
    reason: '',
    detectedKeywords: [],
    category: null,
    detailedExplanation: '',
    riskLevel: 'low'
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
      result.reason = `Contains financial information (${result.detectedKeywords.slice(0, 3).join(', ')}${result.detectedKeywords.length > 3 ? '...' : ''}). For financial privacy, encryption is recommended.`;
    } else if (result.category === 'identity') {
      result.reason = `Contains identity-related information (${result.detectedKeywords.slice(0, 3).join(', ')}${result.detectedKeywords.length > 3 ? '...' : ''}). To prevent identity theft, encryption is strongly recommended.`;
    } else if (result.category === 'professional') {
      result.reason = `Contains confidential professional content (${result.detectedKeywords.slice(0, 3).join(', ')}${result.detectedKeywords.length > 3 ? '...' : ''}). For maintaining confidentiality, encryption is recommended.`;
    } else if (result.category === 'personal') {
      result.reason = `Contains personal information (${result.detectedKeywords.slice(0, 3).join(', ')}${result.detectedKeywords.length > 3 ? '...' : ''}). For privacy protection, encryption is recommended.`;
    }
    
    // Update risk level
    result.riskLevel = getRiskLevel(result.confidenceScore);
    
    // Set detailed explanation
    result.detailedExplanation = generateDetailedExplanation(
      result.category, 
      result.detectedKeywords, 
      result.confidenceScore
    );
    
    // Update encryption stats from encryptionUtils
    try {
      const { encryptionStats } = require('./encryptionUtils');
      encryptionStats.sensitiveContentDetected++;
      
      if (result.category) {
        encryptionStats.categoryCount[result.category as keyof typeof encryptionStats.categoryCount]++;
      }
    } catch (error) {
      console.error('Error updating encryption stats:', error);
    }
  } else {
    result.reason = 'No sensitive information detected.';
    result.detailedExplanation = 'This content does not appear to contain any sensitive information based on our analysis. However, you may still choose to encrypt it for additional security.';
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
  const sensitiveFileTypes = ['csv', 'xls', 'xlsx', 'pdf', 'doc', 'docx', 'txt', 'json', 'xml', 'sql', 'db', 'bak'];
  
  // Check if this is a file type that commonly contains sensitive data
  const isSensitiveFileType = sensitiveFileTypes.includes(extension || '');
  
  // Check the filename against our sensitive keywords
  const filenameAnalysis = analyzeContent(name);
  
  // If the file is a sensitive type, increase the confidence
  if (isSensitiveFileType && filenameAnalysis.confidenceScore > 0) {
    filenameAnalysis.confidenceScore = Math.min(100, filenameAnalysis.confidenceScore + 20);
    filenameAnalysis.reason = `${filenameAnalysis.reason} The file type (.${extension}) often contains sensitive data.`;
    filenameAnalysis.detailedExplanation += ` Additionally, .${extension} files commonly contain structured data or documents that may hold sensitive information.`;
  } else if (isSensitiveFileType) {
    filenameAnalysis.shouldEncrypt = true;
    filenameAnalysis.confidenceScore = 60;
    filenameAnalysis.reason = `The file type (.${extension}) often contains sensitive data.`;
    filenameAnalysis.detailedExplanation = `Files with the .${extension} extension commonly contain structured data or documents that frequently include sensitive information. While we didn't detect sensitive keywords in the filename itself, the file type suggests caution is warranted.`;
    filenameAnalysis.riskLevel = 'medium';
  }
  
  return filenameAnalysis;
};
