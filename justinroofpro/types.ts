
export enum CalculatorTab {
  MAIN_AREA = 'MAIN_AREA',
  PERIMETER = 'PERIMETER',
  MATERIAL_LIST = 'MATERIAL_LIST'
}

export interface MaterialResult {
  label: string;
  value: number;
  unit: string;
}

export interface CalculationResults {
  baseSqft: number;
  totalSqftWithWaste: number;
  materials: MaterialResult[];
}

export interface PerimeterResults {
  totalPerimeter: number;
  wallFactor: number;
  wallSqft: number;
  materials: MaterialResult[];
}
