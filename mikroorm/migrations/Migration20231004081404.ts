import { Migration } from '@mikro-orm/migrations';

export class Migration20231004081404 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "users" ("id" serial primary key, "name" varchar(255) not null, "phone_number" varchar(255) not null, "password" varchar(255) not null, "email" varchar(255) not null, "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP, "updated_at" timestamp with time zone not null default CURRENT_TIMESTAMP);');
    this.addSql('alter table "users" add constraint "users_phone_number_unique" unique ("phone_number");');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');
  }

}
