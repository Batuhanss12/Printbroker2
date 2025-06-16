interface DesignItem {
  id: string;
  name: string;
  width: number;
  height: number;
  filePath: string;
}

interface LayoutResult {
  success: boolean;
  arrangements: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  }>;
  efficiency: number;
  pdfPath?: string;
  message: string;
}

export class OneClickLayoutSystem {
  async generateInstantLayout(
    designs: DesignItem[], 
    sheetWidth: number = 210, 
    sheetHeight: number = 297,
    margin: number = 10
  ): Promise<LayoutResult> {
    console.log(`⚡ One-click layout for ${designs.length} designs`);
    
    if (!designs || designs.length === 0) {
      return {
        success: false,
        arrangements: [],
        efficiency: 0,
        message: 'No designs provided'
      };
    }

    const arrangements = this.performQuickLayout(designs, sheetWidth, sheetHeight, margin);
    const efficiency = this.calculateEfficiency(arrangements, sheetWidth, sheetHeight);
    
    return {
      success: true,
      arrangements,
      efficiency: Math.round(efficiency),
      message: `Layout generated with ${efficiency.toFixed(1)}% efficiency`
    };
  }

  private performQuickLayout(
    designs: DesignItem[], 
    sheetWidth: number, 
    sheetHeight: number, 
    margin: number
  ) {
    const arrangements: any[] = [];
    const usableWidth = sheetWidth - (2 * margin);
    const usableHeight = sheetHeight - (2 * margin);
    
    // Simple row-based layout
    let currentX = margin;
    let currentY = margin;
    let rowHeight = 0;
    
    for (const design of designs) {
      // Check if design fits in current row
      if (currentX + design.width > sheetWidth - margin) {
        // Move to next row
        currentX = margin;
        currentY += rowHeight + 5; // 5mm spacing between rows
        rowHeight = 0;
      }
      
      // Check if design fits vertically
      if (currentY + design.height > sheetHeight - margin) {
        console.warn(`Design ${design.name} doesn't fit, skipping`);
        continue;
      }
      
      // Place design
      arrangements.push({
        id: design.id,
        name: design.name,
        x: currentX,
        y: currentY,
        width: design.width,
        height: design.height,
        rotation: 0
      });
      
      currentX += design.width + 5; // 5mm spacing
      rowHeight = Math.max(rowHeight, design.height);
    }
    
    return arrangements;
  }

  private calculateEfficiency(arrangements: any[], sheetWidth: number, sheetHeight: number): number {
    const totalDesignArea = arrangements.reduce((sum, arr) => sum + (arr.width * arr.height), 0);
    const sheetArea = sheetWidth * sheetHeight;
    return (totalDesignArea / sheetArea) * 100;
  }

  async optimizeLayout(
    designs: DesignItem[], 
    sheetWidth: number, 
    sheetHeight: number
  ): Promise<LayoutResult> {
    console.log(`🎯 Optimizing layout for better efficiency`);
    
    // Try different arrangements and pick the best
    const layouts = await Promise.all([
      this.generateInstantLayout(designs, sheetWidth, sheetHeight, 10),
      this.generateInstantLayout(designs, sheetWidth, sheetHeight, 5),
      this.generateRotatedLayout(designs, sheetWidth, sheetHeight, 10)
    ]);
    
    // Find the most efficient layout
    const bestLayout = layouts.reduce((best, current) => 
      current.efficiency > best.efficiency ? current : best
    );
    
    bestLayout.message = `Optimized layout with ${bestLayout.efficiency}% efficiency`;
    return bestLayout;
  }

  private async generateRotatedLayout(
    designs: DesignItem[], 
    sheetWidth: number, 
    sheetHeight: number, 
    margin: number
  ): Promise<LayoutResult> {
    // Try rotating designs that might fit better
    const rotatedDesigns = designs.map(design => ({
      ...design,
      width: design.height,
      height: design.width,
      rotated: true
    }));
    
    const arrangements = this.performQuickLayout(rotatedDesigns, sheetWidth, sheetHeight, margin);
    
    // Mark rotated arrangements
    const rotatedArrangements = arrangements.map(arr => ({
      ...arr,
      rotation: 90,
      width: arr.height,
      height: arr.width
    }));
    
    const efficiency = this.calculateEfficiency(rotatedArrangements, sheetWidth, sheetHeight);
    
    return {
      success: true,
      arrangements: rotatedArrangements,
      efficiency: Math.round(efficiency),
      message: `Rotated layout with ${efficiency.toFixed(1)}% efficiency`
    };
  }

  async generateMultipleOptions(
    designs: DesignItem[], 
    sheetWidth: number = 210, 
    sheetHeight: number = 297
  ): Promise<{
    options: LayoutResult[];
    recommended: LayoutResult;
  }> {
    console.log(`📋 Generating multiple layout options`);
    
    const options = await Promise.all([
      this.generateInstantLayout(designs, sheetWidth, sheetHeight, 10),
      this.generateInstantLayout(designs, sheetWidth, sheetHeight, 5),
      this.generateRotatedLayout(designs, sheetWidth, sheetHeight, 10),
      this.generateInstantLayout(designs, 297, 420, 10), // A3 option
    ]);
    
    // Add descriptive names
    options[0].message = 'Standard layout (10mm margin)';
    options[1].message = 'Compact layout (5mm margin)';
    options[2].message = 'Rotated designs layout';
    options[3].message = 'A3 size layout';
    
    const recommended = options.reduce((best, current) => 
      current.efficiency > best.efficiency ? current : best
    );
    
    return { options, recommended };
  }
}

export const oneClickLayoutSystem = new OneClickLayoutSystem();