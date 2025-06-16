import fs from 'fs';

interface ProfessionalAnalysis {
  dimensions: {
    widthMM: number;
    heightMM: number;
    confidence: number;
  };
  printReadiness: {
    isReady: boolean;
    issues: string[];
    recommendations: string[];
  };
  qualityAssessment: {
    score: number;
    factors: string[];
  };
  category: string;
  processingNotes: string[];
}

export class ProfessionalDesignAnalyzer {
  async analyzeForProfessionalPrinting(
    filePath: string, 
    fileName: string, 
    mimeType: string
  ): Promise<ProfessionalAnalysis> {
    console.log(`🏭 Professional analysis for: ${fileName}`);
    
    const analysis = await this.performComprehensiveAnalysis(filePath, fileName, mimeType);
    return analysis;
  }

  private async performComprehensiveAnalysis(
    filePath: string, 
    fileName: string, 
    mimeType: string
  ): Promise<ProfessionalAnalysis> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    const processingNotes: string[] = [];
    let qualityScore = 100;

    // File size analysis
    const stats = fs.statSync(filePath);
    const fileSizeMB = stats.size / (1024 * 1024);
    
    if (fileSizeMB > 100) {
      issues.push('File size exceeds 100MB limit');
      qualityScore -= 20;
    } else if (fileSizeMB < 0.1) {
      issues.push('File size suspiciously small, may lack detail');
      qualityScore -= 10;
    }

    // Format analysis
    let dimensions = { widthMM: 100, heightMM: 100, confidence: 0.5 };
    
    if (mimeType === 'application/pdf') {
      dimensions = await this.analyzePDFDimensions(filePath);
      recommendations.push('PDF format is excellent for professional printing');
      qualityScore += 10;
    } else if (mimeType === 'image/svg+xml') {
      dimensions = await this.analyzeSVGDimensions(filePath);
      recommendations.push('SVG format preserves vector quality');
      qualityScore += 15;
    } else if (mimeType.startsWith('image/')) {
      dimensions = this.estimateImageDimensions(fileName);
      issues.push('Raster format may limit print quality at large sizes');
      qualityScore -= 15;
      recommendations.push('Consider converting to vector format for best results');
    } else {
      issues.push('Unsupported format for professional printing');
      qualityScore -= 30;
    }

    // Category determination
    const category = this.determineCategory(dimensions.widthMM, dimensions.heightMM, fileName);
    
    // Standard size validation
    const sizeValidation = this.validateStandardSizes(dimensions.widthMM, dimensions.heightMM, category);
    if (!sizeValidation.isStandard) {
      recommendations.push(sizeValidation.suggestion);
    }

    // Print readiness assessment
    const isReady = issues.length === 0 && qualityScore >= 70;
    
    processingNotes.push(`File size: ${fileSizeMB.toFixed(2)}MB`);
    processingNotes.push(`Quality score: ${qualityScore}/100`);
    processingNotes.push(`Category: ${category}`);

    return {
      dimensions,
      printReadiness: {
        isReady,
        issues,
        recommendations
      },
      qualityAssessment: {
        score: qualityScore,
        factors: [
          `Format compatibility: ${mimeType}`,
          `Size appropriateness: ${fileSizeMB.toFixed(1)}MB`,
          `Dimension confidence: ${dimensions.confidence * 100}%`
        ]
      },
      category,
      processingNotes
    };
  }

  private async analyzePDFDimensions(filePath: string): Promise<{ widthMM: number; heightMM: number; confidence: number }> {
    try {
      const buffer = fs.readFileSync(filePath);
      const pdfString = buffer.toString('binary');
      
      const mediaBoxMatch = pdfString.match(/\/MediaBox\s*\[\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\]/);
      
      if (mediaBoxMatch) {
        const [, x1, y1, x2, y2] = mediaBoxMatch.map(Number);
        const widthPt = x2 - x1;
        const heightPt = y2 - y1;
        
        return {
          widthMM: Math.round(widthPt * 0.352778),
          heightMM: Math.round(heightPt * 0.352778),
          confidence: 0.95
        };
      }
    } catch (error) {
      console.warn('PDF dimension analysis failed:', error);
    }
    
    return { widthMM: 210, heightMM: 297, confidence: 0.3 };
  }

  private async analyzeSVGDimensions(filePath: string): Promise<{ widthMM: number; heightMM: number; confidence: number }> {
    try {
      const svgContent = fs.readFileSync(filePath, 'utf8');
      
      const widthMatch = svgContent.match(/width\s*=\s*["']?([^"'\s>]+)/);
      const heightMatch = svgContent.match(/height\s*=\s*["']?([^"'\s>]+)/);
      
      if (widthMatch && heightMatch) {
        const width = this.parseUnit(widthMatch[1]);
        const height = this.parseUnit(heightMatch[1]);
        
        return {
          widthMM: Math.round(width),
          heightMM: Math.round(height),
          confidence: 0.85
        };
      }
    } catch (error) {
      console.warn('SVG dimension analysis failed:', error);
    }
    
    return { widthMM: 100, heightMM: 100, confidence: 0.4 };
  }

  private estimateImageDimensions(fileName: string): { widthMM: number; heightMM: number; confidence: number } {
    const name = fileName.toLowerCase();
    
    if (name.includes('kartvizit') || name.includes('business')) {
      return { widthMM: 85, heightMM: 55, confidence: 0.7 };
    } else if (name.includes('a4')) {
      return { widthMM: 210, heightMM: 297, confidence: 0.8 };
    } else if (name.includes('a3')) {
      return { widthMM: 297, heightMM: 420, confidence: 0.8 };
    }
    
    return { widthMM: 100, heightMM: 100, confidence: 0.3 };
  }

  private parseUnit(value: string): number {
    const num = parseFloat(value);
    if (value.includes('cm')) return num * 10;
    if (value.includes('inch') || value.includes('in')) return num * 25.4;
    if (value.includes('px')) return num * 0.264583; // 96 DPI assumption
    return num; // Assume mm
  }

  private determineCategory(width: number, height: number, fileName: string): string {
    const name = fileName.toLowerCase();
    const area = width * height;
    
    if (name.includes('kartvizit') || name.includes('business')) return 'business_card';
    if (name.includes('logo')) return 'logo';
    if (name.includes('etiket') || name.includes('label')) return 'label';
    if (name.includes('broşür') || name.includes('brochure')) return 'brochure';
    if (name.includes('poster')) return 'poster';
    
    // Size-based fallback
    if (area < 5000) return 'small_format';
    if (area < 50000) return 'medium_format';
    return 'large_format';
  }

  private validateStandardSizes(width: number, height: number, category: string): { isStandard: boolean; suggestion: string } {
    const standardSizes = {
      business_card: { width: 85, height: 55 },
      a4: { width: 210, height: 297 },
      a3: { width: 297, height: 420 },
      a5: { width: 148, height: 210 }
    };

    if (category === 'business_card') {
      const standard = standardSizes.business_card;
      const isStandard = Math.abs(width - standard.width) <= 3 && Math.abs(height - standard.height) <= 3;
      return {
        isStandard,
        suggestion: isStandard ? '' : `Consider standard business card size: ${standard.width}×${standard.height}mm`
      };
    }

    // Check proximity to A-series sizes
    for (const [sizeName, size] of Object.entries(standardSizes)) {
      if (sizeName === 'business_card') continue;
      
      const widthDiff = Math.abs(width - size.width);
      const heightDiff = Math.abs(height - size.height);
      
      if (widthDiff <= 10 && heightDiff <= 10) {
        return {
          isStandard: true,
          suggestion: ''
        };
      }
    }

    return {
      isStandard: false,
      suggestion: 'Consider using standard paper sizes (A4: 210×297mm, A3: 297×420mm) for cost efficiency'
    };
  }

  // Add missing method for compatibility
  async analyzeDesignFile(filePath: string, fileName: string, mimeType: string): Promise<any> {
    const analysis = await this.analyzeForProfessionalPrinting(filePath, fileName, mimeType);
    return {
      id: (await import('crypto')).randomUUID(),
      name: fileName,
      width: analysis.dimensions.widthMM,
      height: analysis.dimensions.heightMM,
      category: analysis.category,
      confidence: analysis.dimensions.confidence,
      processingNotes: analysis.processingNotes
    };
  }
}

export const professionalDesignAnalyzer = new ProfessionalDesignAnalyzer();