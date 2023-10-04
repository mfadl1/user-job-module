import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { User } from "../../types";

@Entity({ tableName: 'users' })
export class UserModel implements User {
    @PrimaryKey({ autoincrement: true })
    id!: number;
    
    @Property({ nullable: false })
    name!: string;

    @Property({ nullable: false, fieldName: 'phone_number' })
    @Unique()
    phoneNumber!: string;

    @Property({ nullable: false })
    password!: string;

    @Property({ nullable: false })
    @Unique()
    email!: string;

    @Property({
        defaultRaw: 'CURRENT_TIMESTAMP',
        columnType: 'timestamp with time zone',
        fieldName: 'created_at',
    })
    readonly createdAt!: Date;

    @Property({
        defaultRaw: 'CURRENT_TIMESTAMP',
        columnType: 'timestamp with time zone',
        fieldName: 'updated_at',
    })
    updatedAt!: Date;
}