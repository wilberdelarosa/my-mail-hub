import { ServiceItem } from '../../entities/service-item.entity';

export interface ServiceItemRepositoryPort {
    save(item: ServiceItem): Promise<ServiceItem>;
    findById(id: string): Promise<ServiceItem | null>;
    findAll(): Promise<ServiceItem[]>;
    findByCode(code: string): Promise<ServiceItem | null>;
}

export const ServiceItemRepositoryPort = Symbol('ServiceItemRepositoryPort');
