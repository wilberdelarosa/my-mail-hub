/**
 * EventPublisherPort - Puerto Outbound
 * 
 * Interface para publicar eventos de dominio.
 * Implementación: RabbitMQ, Kafka, etc.
 */
export interface EventPublisherPort {
    /**
     * Publicar evento genérico
     */
    publish(eventName: string, payload: any): Promise<void>;

    /**
     * Evento: Usuario creado
     */
    publishUserCreated(payload: {
        userId: string;
        email: string;
        roles: string[];
    }): Promise<void>;

    /**
     * Evento: Rol asignado
     */
    publishRoleAssigned(payload: {
        userId: string;
        roleName: string;
    }): Promise<void>;

    /**
     * Evento: Usuario desactivado
     */
    publishUserDeactivated(payload: {
        userId: string;
        reason?: string;
    }): Promise<void>;
}
