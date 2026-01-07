import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface PKpiRequestData {
  id: string[];
  year: number;
  tw: number;
  kpiType: 'group' | 'regional' | 'subHolding';
  entitas?: string;
}

export interface PKpiResponse {
  data: any;
  [key: string]: any;
}

@Injectable()
export class PkpiService {
  private readonly logger = new Logger(PkpiService.name);
  private readonly httpClient: AxiosInstance;
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly username: string;
  private readonly password: string;

  constructor(
    private readonly configService: ConfigService,      
  ) {
    this.baseUrl = this.configService.get('P_KPI_SERVICES') || 'http://localhost:3000';
    this.apiKey = this.configService.get('P_KPI_SERVICES_API_KEY') || 'admin';
    this.username = this.configService.get('P_KPI_SERVICES_USERNAME') || 'admin';
    this.password = this.configService.get('P_KPI_SERVICES_PASSWORD') || '1234';

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.httpClient.interceptors.request.use(
      (config) => {
        this.logger.debug(`Making request to: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.httpClient.interceptors.response.use(
      (response) => {
        this.logger.debug(`Response received from: ${response.config.method?.toUpperCase()} ${response.config.url}`);
        return response;
      },
      (error) => {
        this.logger.error(`Response error from: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.message);
        return Promise.reject(error);
      }
    );
  }

  private getAuthHeaders(): { [key: string]: string } {
    const credentials = Buffer.from(`${this.username}:${this.password}`).toString('base64');
    return {
      'Authorization': `Basic ${credentials}`,
      'apiKey': this.apiKey,
    };
  }

  async getKPIByGroup(groupIds: string[], year: number, tw: number): Promise<PKpiResponse> {
    try {
      const requestData: PKpiRequestData = {
        id: groupIds,
        year,
        tw,
        kpiType: 'group'
      };

      const response: AxiosResponse = await this.httpClient.post('/getKpi', requestData, {
        headers: this.getAuthHeaders(),
      });

      return {
        data: response.data,
        group_id: groupIds,
        year,
        tw,
      };
    } catch (error) {
      this.logger.error(`Failed to get KPI by group ${groupIds}:`, error);
      throw error;
    }
  }

  async getKPIByRegional(regionalIds: string[], entitas: string, year: number, tw: number): Promise<PKpiResponse> {
    try {
      const requestData: PKpiRequestData = {
        id: regionalIds,
        entitas,
        year,
        tw,
        kpiType: 'regional'
      };

      const response: AxiosResponse = await this.httpClient.post('/getKpi', requestData, {
        headers: this.getAuthHeaders(),
      });

      return {
        data: response.data,
        regional_id: regionalIds,
        entitas,
        year,
        tw,
      };
    } catch (error) {
      this.logger.error(`Failed to get KPI by regional ${regionalIds}:`, error);
      throw error;
    }
  }

  async getKPIBySubholding(subholdingIds: string[], entitas: string, year: number, tw: number): Promise<PKpiResponse> {
    try {
      const requestData: PKpiRequestData = {
        id: subholdingIds,
        entitas,
        year,
        tw,
        kpiType: 'subHolding'
      };

      const response: AxiosResponse = await this.httpClient.post('/getKpi', requestData, {
        headers: this.getAuthHeaders(),
      });

      return {
        data: response.data,
        subholding_id: subholdingIds,
        entitas,
        year,
        tw,
      };
    } catch (error) {
      this.logger.error(`Failed to get KPI by subholding ${subholdingIds}:`, error);
      throw error;
    }
  }
}
