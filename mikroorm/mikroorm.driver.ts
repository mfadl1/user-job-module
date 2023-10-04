import { MikroORM } from '@mikro-orm/core';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { API, APIInstance, Driver } from '../user.shared';
import { AuthenticatorServiceMikroOrm } from './mikroorm.service';
import { UserModel } from './entities/user.entity';


export class MikroormDriver implements Driver {
    private connection: MikroORM | null = null;
    private serviceInstance: AuthenticatorServiceMikroOrm | null = null;

    constructor(
        protected config: {
            host: string;
            port: number;
            db: string;
            user: string;
            password: string;
            schema?: string;
        },
        protected jwtSecretKey: string,
		protected jwtExpiresIn: string,
    ) {}
    get(api: Symbol): APIInstance {
        if (!this.connection) throw new Error(`Driver not initialized.`);
        if (api === API.AuthQuery) {
            if (!this.serviceInstance) {
                this.serviceInstance = new AuthenticatorServiceMikroOrm(
                    this.connection.em,
                    this.jwtSecretKey,
                    this.jwtExpiresIn,
                );
            }
            return this.serviceInstance;
        }

        throw new Error(
            `Unknown or unsupported API: ${api.toString()}, this usually means API not implemented or you provide wrong API symbol.`,
        );
    }

    public async init(): Promise<void> {
        if (!this.connection) {
            this.connection = await MikroORM.init<PostgreSqlDriver>(
                defineConfig({
                    host: this.config.host,
                    port: this.config.port,
                    dbName: this.config.db,
                    user: this.config.user,
                    schema: this.config.schema || 'public',
                    password: this.config.password,
                    entities: [
                        UserModel
                    ],
                }),
            );
        }
    }

    public async destroy(): Promise<void> {
        await this.connection?.close();
    }
}
