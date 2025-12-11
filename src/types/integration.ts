export interface BrokerCredential {
    lenderId: string;
    clientId: string;
    clientSecret: string;
    isEnabled: boolean;
    properties?: Record<string, string>; // Extra fields like 'Subscription Key'
}

export interface IntegrationContextType {
    credentials: BrokerCredential[];
    saveCredential: (cred: BrokerCredential) => void;
    getCredential: (lenderId: string) => BrokerCredential | undefined;
    deleteCredential: (lenderId: string) => void;
}
