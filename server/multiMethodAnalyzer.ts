import fs from 'fs';
import path from 'path';

interface AnalysisResult {
  success: boolean;
  dimensions: {
    widthMM: number;
    heightMM: number;
    category: string;
    confidence: number;
    description: string;
    shouldRotate?: boolean;
  };
  detectedDesigns: number;
  processingNotes: string[];
  error?: string;
}

export class MultiMethodAnalyzer {
  async analyzeFile(filePath: string, fileName: string, mimeType: string): Promise<AnalysisResult> {
    try {
      console.log(`🔍 Multi-method analysis starting for: ${fileName}`);
      
      // Determine file type and analyze accordingly
      if (mimeType === 'application/pdf') {
        return await this.analyzePDF(filePath, fileName);
      } else if (mimeType === 'image/svg+xml') {
        return await this.analyzeSVG(filePath, fileName);
      } else if (mimeType.startsWith('image/')) {
        return await this.analyzeImage(filePath, fileName);
      } else {
        return this.createFallbackResult(fileName, 'Unsupported file type');
      }
    } catch (error) {
      console.error('Multi-method analysis error:', error);
      return this.createFallbackResult(fileName, error.message);
    }
  }

  private async analyzePDF(filePath: string, fileName: string): Promise<AnalysisResult> {
    try {
      const buffer = fs.readFileSync(filePath);
      const pdfString = buffer.toString('binary');

      // Extract MediaBox dimensions
      const mediaBoxMatch = pdfString.match(/\/MediaBox\s*\[\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\]/);
      
      if (mediaBoxMatch) {
        const [, x1, y1, x2, y2] = mediaBoxMatch.map(Number);
        const widthPt = x2 - x1;
        const heightPt = y2 - y1;
        
        const widthMM = Math.round(widthPt * 0.352778);
        const heightMM = Math.round(heightPt * 0.352778);
        
        return {
          success: true,
          dimensions: {
            widthMM,
            heightMM,
            category: this.categorizeDesign(widthMM, heightMM, fileName),
            confidence: 0.9,
            description: `PDF analyzed via MediaBox: ${widthMM}×${heightMM}mm`,
            shouldRotate: this.shouldRotate(widthMM, heightMM)
          },
          detectedDesigns: 1,
          processingNotes: [`PDF MediaBox dimensions: ${widthMM}×${heightMM}mm`]
        };
      }

      return this.createFallbackResult(fileName, 'Could not extract PDF dimensions');
    } catch (error) {
      return this.createFallbackResult(fileName, `PDF analysis failed: ${error.message}`);
    }
  }

  private async analyzeSVG(filePath: string, fileName: string): Promise<AnalysisResult> {
    try {
      const svgContent = fs.readFileSync(filePath, 'utf8');
      
      const widthMatch = svgContent.match(/width\s*=\s*["']?([^"'\s>]+)/);
      const heightMatch = svgContent.match(/height\s*=\s*["']?([^"'\s>]+)/);
      
      if (widthMatch && heightMatch) {
        const width = this.parseUnit(widthMatch[1]);
        const height = this.parseUnit(heightMatch[1]);
        
        return {
          success: true,
          dimensions: {
            widthMM: Math.round(width),
            heightMM: Math.round(height),
            category: this.categorizeDesign(width, height, fileName),
            confidence: 0.8,
            description: `SVG dimensions: ${width}×${height}mm`,
            shouldRotate: this.shouldRotate(width, height)
          },
          detectedDesigns: 1,
          processingNotes: [`SVG dimensions extracted: ${width}×${height}mm`]
        };
      }

      return this.createFallbackResult(fileName, 'Could not extract SVG dimensions');
    } catch (error) {
      return this.createFallbackResult(fileName, `SVG analysis failed: ${error.message}`);
    }
  }

  private async analyzeImage(filePath: string, fileName: string): Promise<AnalysisResult> {
    try {
      // Basic image analysis - would need Sharp for detailed metadata
      const stats = fs.statSync(filePath);
      
      // Estimate dimensions based on file name patterns
      let widthMM = 100, heightMM = 100;
      
      if (fileName.includes('kartvizit') || fileName.includes('business')) {
        widthMM = 85; heightMM = 55;
      } else if (fileName.includes('logo')) {
        widthMM = 120; heightMM = 80;
      } else if (fileName.includes('etiket') || fileName.includes('label')) {
        widthMM = 60; heightMM = 40;
      }

      return {
        success: true,
        dimensions: {
          widthMM,
          heightMM,
          category: this.categorizeDesign(widthMM, heightMM, fileName),
          confidence: 0.6,
          description: `Image file estimated: ${widthMM}×${heightMM}mm`,
          shouldRotate: this.shouldRotate(widthMM, heightMM)
        },
        detectedDesigns: 1,
        processingNotes: [`Image file size: ${(stats.size / 1024).toFixed(1)}KB`]
      };
    } catch (error) {
      return this.createFallbackResult(fileName, `Image analysis failed: ${error.message}`);
    }
  }

  private parseUnit(value: string): number {
    const num = parseFloat(value);
    if (value.includes('cm')) return num * 10;
    if (value.includes('inch') || value.includes('in')) return num * 25.4;
    if (value.includes('px')) return num * 0.264583; // Assuming 96 DPI
    return num; // Assume mm
  }

  private categorizeDesign(width: number, height: number, fileName: string): string {
    const name = fileName.toLowerCase();
    
    if (name.includes('kartvizit') || name.includes('business')) return 'business_card';
    if (name.includes('logo')) return 'logo';
    if (name.includes('etiket') || name.includes('label')) return 'label';
    if (name.includes('broşür') || name.includes('brochure')) return 'brochure';
    if (name.includes('poster')) return 'poster';
    
    // Size-based categorization
    const area = width * height;
    if (area < 3000) return 'small_label';
    if (area < 10000) return 'medium_print';
    return 'large_format';
  }

  private shouldRotate(width: number, height: number): boolean {
    // Suggest rotation if height is significantly larger than width
    return height > width * 1.5;
  }

  private createFallbackResult(fileName: string, errorMessage: string): AnalysisResult {
    const name = fileName.toLowerCase();
    let widthMM = 80, heightMM = 60, category = 'general';
    
    if (name.includes('kartvizit') || name.includes('business')) {
      widthMM = 85; heightMM = 55; category = 'business_card';
    } else if (name.includes('logo')) {
      widthMM = 100; heightMM = 80; category = 'logo';
    } else if (name.includes('etiket') || name.includes('label')) {
      widthMM = 60; heightMM = 40; category = 'label';
    }

    return {
      success: false,
      dimensions: {
        widthMM,
        heightMM,
        category,
        confidence: 0.3,
        description: `Fallback analysis: ${widthMM}×${heightMM}mm ${category}`,
        shouldRotate: false
      },
      detectedDesigns: 1,
      processingNotes: [
        'Analysis failed, using fallback values',
        `Error: ${errorMessage}`,
        `Estimated dimensions: ${widthMM}×${heightMM}mm`
      ],
      error: errorMessage
    };
  }

  // Additional missing methods for compatibility
  async generateThumbnail(filePath: string): Promise<string | null> {
    // Placeholder implementation - would generate thumbnails in production
    return null;
  }

  async validateAnalysisResult(analysis: any): Promise<boolean> {
    return analysis && analysis.width > 0 && analysis.height > 0;
  }

  async applyManualDimensions(analysis: any, width: number, height: number): Promise<any> {
    return {
      ...analysis,
      width,
      height,
      confidence: 1.0,
      processingNotes: [...(analysis.processingNotes || []), 'Manual dimensions applied']
    };
  }
}

export const multiMethodAnalyzer = new MultiMethodAnalyzer();