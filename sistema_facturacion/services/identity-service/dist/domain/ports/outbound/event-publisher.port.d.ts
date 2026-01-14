export interface EventPublisherPort {
    publish(eventName: string, payload: any): Promise<void>;
    publishUserCreated(payload: {
        userId: string;
        email: string;
        roles: string[];
    }): Promise<void>;
    publishRoleAssigned(payload: {
        userId: string;
        roleName: string;
    }): Promise<void>;
    publishUserDeactivated(payload: {
        userId: string;
        reason?: string;
    }): Promise<void>;
}
