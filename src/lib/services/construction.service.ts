import axiosInstance from "@/lib/configs/axiosInstance";

// Define pagination response interface
export interface PaginatedResponse<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Define interfaces
export interface Coefficient {
  _id: string;
  code: string;
  name: string;
  coefficient: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConstructionType {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BuildPackage {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvestmentLevel {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UnitPrice {
  _id: string;
  constructionTypeId: string | ConstructionType;
  buildPackageId: string | BuildPackage;
  investmentLevelId: string | InvestmentLevel;
  pricePerM2: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API endpoints
const endpoints = {
  // Coefficients
  coefficients: "/v1/construction-coefficients",
  coefficientById: "/v1/construction-coefficients/:id",
  coefficientByCode: "/v1/construction-coefficients/code/:code",
  
  // Construction Types
  constructionTypes: "/v1/construction-types",
  constructionTypeById: "/v1/construction-types/:id",
  
  // Build Packages
  buildPackages: "/v1/build-packages",
  buildPackageById: "/v1/build-packages/:id",
  
  // Investment Levels
  investmentLevels: "/v1/construction/investment-levels",
  investmentLevelById: "/v1/construction/investment-levels/:id",
  
  // Unit Prices
  unitPrices: "/v1/construction/unit-prices",
  unitPriceById: "/v1/construction/unit-prices/:id",
  unitPriceFilter: "/v1/construction/unit-prices/filter",
};

class ConstructionService {
  private static instance: ConstructionService;

  private constructor() {}

  public static getInstance(): ConstructionService {
    if (!ConstructionService.instance) {
      ConstructionService.instance = new ConstructionService();
    }
    return ConstructionService.instance;
  }

  // Coefficients
  async getCoefficients(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Coefficient>> {
    try {
      const response = await axiosInstance.get(endpoints.coefficients, {
        params: { page, limit }
      });
      const data = response.data.data;
      if (Array.isArray(data)) {
        return { rows: data, total: data.length, page, pageSize: limit, totalPages: 1 };
      }
      if (data && Array.isArray(data.rows)) {
        return data;
      }
      return { rows: [], total: 0, page, pageSize: limit, totalPages: 0 };
    } catch (error) {
      console.error("Error fetching coefficients:", error);
      return { rows: [], total: 0, page, pageSize: limit, totalPages: 0 };
    }
  }

  async getCoefficientById(id: string): Promise<Coefficient | null> {
    try {
      const response = await axiosInstance.get(endpoints.coefficientById.replace(":id", id));
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching coefficient with id ${id}:`, error);
      return null;
    }
  }

  async createCoefficient(coefficient: Omit<Coefficient, '_id'>): Promise<Coefficient | null> {
    try {
      const response = await axiosInstance.post(endpoints.coefficients, coefficient);
      return response.data.data;
    } catch (error) {
      console.error("Error creating coefficient:", error);
      return null;
    }
  }

  async updateCoefficient(id: string, coefficient: Partial<Coefficient>): Promise<Coefficient | null> {
    try {
      const response = await axiosInstance.put(
        endpoints.coefficientById.replace(":id", id),
        coefficient
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating coefficient with id ${id}:`, error);
      return null;
    }
  }

  async deleteCoefficient(id: string): Promise<boolean> {
    try {
      await axiosInstance.delete(endpoints.coefficientById.replace(":id", id));
      return true;
    } catch (error) {
      console.error(`Error deleting coefficient with id ${id}:`, error);
      return false;
    }
  }

  // Construction Types
  async getConstructionTypes(page: number = 1, limit: number = 10): Promise<PaginatedResponse<ConstructionType>> {
    try {
      const response = await axiosInstance.get(endpoints.constructionTypes, {
        params: { page, limit }
      });
      const data = response.data.data;
      if (Array.isArray(data)) {
        return { rows: data, total: data.length, page, pageSize: limit, totalPages: 1 };
      }
      if (data && Array.isArray(data.rows)) {
        return data;
      }
      return { rows: [], total: 0, page, pageSize: limit, totalPages: 0 };
    } catch (error) {
      console.error("Error fetching construction types:", error);
      return { rows: [], total: 0, page, pageSize: limit, totalPages: 0 };
    }
  }

  async getConstructionTypeById(id: string): Promise<ConstructionType | null> {
    try {
      const response = await axiosInstance.get(endpoints.constructionTypeById.replace(":id", id));
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching construction type with id ${id}:`, error);
      return null;
    }
  }

  async createConstructionType(constructionType: Omit<ConstructionType, '_id'>): Promise<ConstructionType | null> {
    try {
      const response = await axiosInstance.post(endpoints.constructionTypes, constructionType);
      return response.data.data;
    } catch (error) {
      console.error("Error creating construction type:", error);
      return null;
    }
  }

  async updateConstructionType(id: string, constructionType: Partial<ConstructionType>): Promise<ConstructionType | null> {
    try {
      const response = await axiosInstance.put(
        endpoints.constructionTypeById.replace(":id", id),
        constructionType
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating construction type with id ${id}:`, error);
      return null;
    }
  }

  async deleteConstructionType(id: string): Promise<boolean> {
    try {
      await axiosInstance.delete(endpoints.constructionTypeById.replace(":id", id));
      return true;
    } catch (error) {
      console.error(`Error deleting construction type with id ${id}:`, error);
      return false;
    }
  }

  // Build Packages
  async getBuildPackages(page: number = 1, limit: number = 10): Promise<PaginatedResponse<BuildPackage>> {
    try {
      const response = await axiosInstance.get(endpoints.buildPackages, {
        params: { page, limit }
      });
      const data = response.data.data;
      if (Array.isArray(data)) {
        return { rows: data, total: data.length, page, pageSize: limit, totalPages: 1 };
      }
      if (data && Array.isArray(data.rows)) {
        return data;
      }
      return { rows: [], total: 0, page, pageSize: limit, totalPages: 0 };
    } catch (error) {
      console.error("Error fetching build packages:", error);
      return { rows: [], total: 0, page, pageSize: limit, totalPages: 0 };
    }
  }

  async getBuildPackageById(id: string): Promise<BuildPackage | null> {
    try {
      const response = await axiosInstance.get(endpoints.buildPackageById.replace(":id", id));
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching build package with id ${id}:`, error);
      return null;
    }
  }

  async createBuildPackage(buildPackage: Omit<BuildPackage, '_id'>): Promise<BuildPackage | null> {
    try {
      const response = await axiosInstance.post(endpoints.buildPackages, buildPackage);
      return response.data.data;
    } catch (error) {
      console.error("Error creating build package:", error);
      return null;
    }
  }

  async updateBuildPackage(id: string, buildPackage: Partial<BuildPackage>): Promise<BuildPackage | null> {
    try {
      const response = await axiosInstance.put(
        endpoints.buildPackageById.replace(":id", id),
        buildPackage
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating build package with id ${id}:`, error);
      return null;
    }
  }

  async deleteBuildPackage(id: string): Promise<boolean> {
    try {
      await axiosInstance.delete(endpoints.buildPackageById.replace(":id", id));
      return true;
    } catch (error) {
      console.error(`Error deleting build package with id ${id}:`, error);
      return false;
    }
  }

  // Investment Levels
  async getInvestmentLevels(page: number = 1, limit: number = 10): Promise<PaginatedResponse<InvestmentLevel>> {
    try {
      const response = await axiosInstance.get(endpoints.investmentLevels, {
        params: { page, limit }
      });
      const data = response.data.data;
      if (Array.isArray(data)) {
        return { rows: data, total: data.length, page, pageSize: limit, totalPages: 1 };
      }
      if (data && Array.isArray(data.rows)) {
        return data;
      }
      return { rows: [], total: 0, page, pageSize: limit, totalPages: 0 };
    } catch (error) {
      console.error("Error fetching investment levels:", error);
      return { rows: [], total: 0, page, pageSize: limit, totalPages: 0 };
    }
  }

  async getInvestmentLevelById(id: string): Promise<InvestmentLevel | null> {
    try {
      const response = await axiosInstance.get(endpoints.investmentLevelById.replace(":id", id));
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching investment level with id ${id}:`, error);
      return null;
    }
  }

  async createInvestmentLevel(investmentLevel: Omit<InvestmentLevel, '_id'>): Promise<InvestmentLevel | null> {
    try {
      const response = await axiosInstance.post(endpoints.investmentLevels, investmentLevel);
      return response.data.data;
    } catch (error) {
      console.error("Error creating investment level:", error);
      return null;
    }
  }

  async updateInvestmentLevel(id: string, investmentLevel: Partial<InvestmentLevel>): Promise<InvestmentLevel | null> {
    try {
      const response = await axiosInstance.put(
        endpoints.investmentLevelById.replace(":id", id),
        investmentLevel
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating investment level with id ${id}:`, error);
      return null;
    }
  }

  async deleteInvestmentLevel(id: string): Promise<boolean> {
    try {
      await axiosInstance.delete(endpoints.investmentLevelById.replace(":id", id));
      return true;
    } catch (error) {
      console.error(`Error deleting investment level with id ${id}:`, error);
      return false;
    }
  }

  // Unit Prices
  async getUnitPrices(page: number = 1, limit: number = 10): Promise<PaginatedResponse<UnitPrice>> {
    try {
      const response = await axiosInstance.get(endpoints.unitPrices, {
        params: { page, limit }
      });
      const data = response.data.data;
      if (Array.isArray(data)) {
        return { rows: data, total: data.length, page, pageSize: limit, totalPages: 1 };
      }
      if (data && Array.isArray(data.rows)) {
        return data;
      }
      return { rows: [], total: 0, page, pageSize: limit, totalPages: 0 };
    } catch (error) {
      console.error("Error fetching unit prices:", error);
      return { rows: [], total: 0, page, pageSize: limit, totalPages: 0 };
    }
  }

  async getUnitPriceById(id: string): Promise<UnitPrice | null> {
    try {
      const response = await axiosInstance.get(endpoints.unitPriceById.replace(":id", id));
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching unit price with id ${id}:`, error);
      return null;
    }
  }

  async createUnitPrice(unitPrice: Omit<UnitPrice, '_id'>): Promise<UnitPrice | null> {
    try {
      const response = await axiosInstance.post(endpoints.unitPrices, unitPrice);
      return response.data.data;
    } catch (error) {
      console.error("Error creating unit price:", error);
      return null;
    }
  }

  async updateUnitPrice(id: string, unitPrice: Partial<UnitPrice>): Promise<UnitPrice | null> {
    try {
      const response = await axiosInstance.put(
        endpoints.unitPriceById.replace(":id", id),
        unitPrice
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating unit price with id ${id}:`, error);
      return null;
    }
  }

  async deleteUnitPrice(id: string): Promise<boolean> {
    try {
      await axiosInstance.delete(endpoints.unitPriceById.replace(":id", id));
      return true;
    } catch (error) {
      console.error(`Error deleting unit price with id ${id}:`, error);
      return false;
    }
  }

  async filterUnitPrices(filters: {
    constructionTypeId?: string;
    buildPackageId?: string;
    investmentLevelId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<UnitPrice>> {
    try {
      const response = await axiosInstance.get(endpoints.unitPriceFilter, {
        params: filters
      });
      return response.data.data || { 
        rows: [], 
        total: 0, 
        page: filters.page || 1, 
        pageSize: filters.limit || 10, 
        totalPages: 0 
      };
    } catch (error) {
      console.error("Error filtering unit prices:", error);
      return { 
        rows: [], 
        total: 0, 
        page: filters.page || 1, 
        pageSize: filters.limit || 10, 
        totalPages: 0 
      };
    }
  }
}

export const constructionService = ConstructionService.getInstance(); 