interface OperationalDesign {
  id: string;
  name: string;
  width: number;
  height: number;
  filePath: string;
  priority?: number;
}

interface OperationalLayout {
  success: boolean;
  placements: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    sheet: number;
  }>;
  sheets: number;
  efficiency: number;
  statistics: {
    totalDesigns: number;
    placedDesigns: number;
    totalSheets: number;
    averageEfficiency: number;
  };
  message: string;
}

export class OperationalLayoutSystem {
  async generateProductionLayout(
    designs: OperationalDesign[],
    sheetWidth: number = 330,
    sheetHeight: number = 480,
    margin: number = 10,
    spacing: number = 5
  ): Promise<OperationalLayout> {
    console.log(`🏭 Operational layout system processing ${designs.length} designs`);
    
    if (!designs || designs.length === 0) {
      return this.createEmptyResult('No designs provided');
    }

    // Sort by priority and size for optimal placement
    const sortedDesigns = this.sortDesigns(designs);
    
    // Multi-sheet layout algorithm
    const sheets = this.generateMultiSheetLayout(sortedDesigns, sheetWidth, sheetHeight, margin, spacing);
    
    const placements = sheets.flatMap((sheet, index) => 
      sheet.placements.map(p => ({ ...p, sheet: index + 1 }))
    );
    
    const statistics = this.calculateStatistics(designs, placements, sheets.length);
    
    return {
      success: true,
      placements,
      sheets: sheets.length,
      efficiency: statistics.averageEfficiency,
      statistics,
      message: `Production layout complete: ${placements.length}/${designs.length} designs on ${sheets.length} sheets`
    };
  }

  private sortDesigns(designs: OperationalDesign[]): OperationalDesign[] {
    return [...designs].sort((a, b) => {
      // First by priority (higher priority first)
      const priorityDiff = (b.priority || 0) - (a.priority || 0);
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by area (larger first for better packing)
      const areaA = a.width * a.height;
      const areaB = b.width * b.height;
      return areaB - areaA;
    });
  }

  private generateMultiSheetLayout(
    designs: OperationalDesign[],
    sheetWidth: number,
    sheetHeight: number,
    margin: number,
    spacing: number
  ) {
    const sheets: Array<{
      placements: Array<{
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
      }>;
      efficiency: number;
    }> = [];

    let remainingDesigns = [...designs];
    
    while (remainingDesigns.length > 0) {
      const sheet = this.layoutSingleSheet(remainingDesigns, sheetWidth, sheetHeight, margin, spacing);
      sheets.push(sheet);
      
      // Remove placed designs from remaining list
      const placedIds = sheet.placements.map(p => p.id);
      remainingDesigns = remainingDesigns.filter(d => !placedIds.includes(d.id));
      
      // Safety check to prevent infinite loops
      if (sheet.placements.length === 0) {
        console.warn('No designs could be placed on sheet, stopping layout process');
        break;
      }
    }
    
    return sheets;
  }

  private layoutSingleSheet(
    designs: OperationalDesign[],
    sheetWidth: number,
    sheetHeight: number,
    margin: number,
    spacing: number
  ) {
    const placements: any[] = [];
    const usableWidth = sheetWidth - (2 * margin);
    const usableHeight = sheetHeight - (2 * margin);
    
    // Advanced placement algorithm with multiple strategies
    const occupiedAreas: Array<{ x: number; y: number; width: number; height: number }> = [];
    
    for (const design of designs) {
      const placement = this.findOptimalPlacement(
        design, 
        occupiedAreas, 
        sheetWidth, 
        sheetHeight, 
        margin, 
        spacing
      );
      
      if (placement) {
        placements.push(placement);
        occupiedAreas.push({
          x: placement.x - spacing,
          y: placement.y - spacing,
          width: placement.width + (2 * spacing),
          height: placement.height + (2 * spacing)
        });
      }
    }
    
    const efficiency = this.calculateSheetEfficiency(placements, sheetWidth, sheetHeight);
    
    return { placements, efficiency };
  }

  private findOptimalPlacement(
    design: OperationalDesign,
    occupiedAreas: Array<{ x: number; y: number; width: number; height: number }>,
    sheetWidth: number,
    sheetHeight: number,
    margin: number,
    spacing: number
  ) {
    const attempts = [
      // Try normal orientation
      { width: design.width, height: design.height, rotation: 0 },
      // Try rotated orientation
      { width: design.height, height: design.width, rotation: 90 }
    ];
    
    for (const attempt of attempts) {
      const position = this.findAvailablePosition(
        attempt.width,
        attempt.height,
        occupiedAreas,
        sheetWidth,
        sheetHeight,
        margin
      );
      
      if (position) {
        return {
          id: design.id,
          x: position.x,
          y: position.y,
          width: attempt.width,
          height: attempt.height,
          rotation: attempt.rotation
        };
      }
    }
    
    return null;
  }

  private findAvailablePosition(
    width: number,
    height: number,
    occupiedAreas: Array<{ x: number; y: number; width: number; height: number }>,
    sheetWidth: number,
    sheetHeight: number,
    margin: number
  ) {
    const gridSize = 5; // 5mm grid for precision
    
    for (let y = margin; y <= sheetHeight - margin - height; y += gridSize) {
      for (let x = margin; x <= sheetWidth - margin - width; x += gridSize) {
        const testArea = { x, y, width, height };
        
        if (!this.hasCollision(testArea, occupiedAreas)) {
          return { x, y };
        }
      }
    }
    
    return null;
  }

  private hasCollision(
    testArea: { x: number; y: number; width: number; height: number },
    occupiedAreas: Array<{ x: number; y: number; width: number; height: number }>
  ): boolean {
    return occupiedAreas.some(occupied => 
      testArea.x < occupied.x + occupied.width &&
      testArea.x + testArea.width > occupied.x &&
      testArea.y < occupied.y + occupied.height &&
      testArea.y + testArea.height > occupied.y
    );
  }

  private calculateSheetEfficiency(placements: any[], sheetWidth: number, sheetHeight: number): number {
    const totalDesignArea = placements.reduce((sum, p) => sum + (p.width * p.height), 0);
    const sheetArea = sheetWidth * sheetHeight;
    return (totalDesignArea / sheetArea) * 100;
  }

  private calculateStatistics(
    designs: OperationalDesign[], 
    placements: any[], 
    sheetCount: number
  ) {
    const totalDesigns = designs.length;
    const placedDesigns = placements.length;
    const averageEfficiency = placements.length > 0 ? 
      placements.reduce((sum, p) => sum + (p.width * p.height), 0) / (sheetCount * 330 * 480) * 100 : 0;
    
    return {
      totalDesigns,
      placedDesigns,
      totalSheets: sheetCount,
      averageEfficiency: Math.round(averageEfficiency)
    };
  }

  private createEmptyResult(message: string): OperationalLayout {
    return {
      success: false,
      placements: [],
      sheets: 0,
      efficiency: 0,
      statistics: {
        totalDesigns: 0,
        placedDesigns: 0,
        totalSheets: 0,
        averageEfficiency: 0
      },
      message
    };
  }

  async generateCuttingOptimizedLayout(
    designs: OperationalDesign[],
    sheetWidth: number = 330,
    sheetHeight: number = 480
  ): Promise<OperationalLayout> {
    console.log(`✂️ Generating cutting-optimized layout`);
    
    // Increased spacing and margins for cutting optimization
    return this.generateProductionLayout(designs, sheetWidth, sheetHeight, 15, 8);
  }

  async generateHighDensityLayout(
    designs: OperationalDesign[],
    sheetWidth: number = 330,
    sheetHeight: number = 480
  ): Promise<OperationalLayout> {
    console.log(`📦 Generating high-density layout`);
    
    // Minimal spacing for maximum utilization
    return this.generateProductionLayout(designs, sheetWidth, sheetHeight, 5, 2);
  }
}

export const operationalLayoutSystem = new OperationalLayoutSystem();