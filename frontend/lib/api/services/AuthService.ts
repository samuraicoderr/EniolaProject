import { apiClient } from "../ApiClient";
import { BackendRoutes } from "../BackendRoutes";
import { 
    LoginCredentialsType,
    OAuthLoginResponse,
    RawOAuthLoginResponse,
    RegisterDataType,
    RegisterResponseType
} from "../types";



export class AuthService {
    static async login(credentials: LoginCredentialsType): Promise<OAuthLoginResponse> {
        const res = await apiClient.post<RawOAuthLoginResponse>(
            BackendRoutes.auth.login, 
            credentials,
            { requiresAuth: false }
        );
        return res.data;
    }

    static async register(data: RegisterDataType): Promise<RegisterResponseType> {
        const res = await apiClient.post<RegisterResponseType>(
            BackendRoutes.auth.register,
            data,
            { requiresAuth: false }
        );
        return res.data;
    }
}