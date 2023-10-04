import { EntityManager } from "@mikro-orm/core";
import { AuthQuery } from "../interface";
import { User, TokenData } from "../types";
import { UserModel } from "./entities/user.entity";
import { compare, genSaltSync, hashSync } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { Request } from "express";

export class AuthenticatorServiceMikroOrm implements AuthQuery {
  constructor(
    private entityManager: EntityManager,
    private jwtSecretKey: string,
    private jwtExpiresIn: string
  ) {}
  
  public async login(
    userInfo: Pick<User, "password" | "phoneNumber">
  ): Promise<{ userData: User; tokenData: TokenData }> {
    const em = this.entityManager.fork();

    const userFound = await em.findOne(UserModel, {
      phoneNumber: userInfo.phoneNumber,
    });

    if (!userFound) {
      throw new Error(`Your credential isn't valid`);
    }

    const isCredential: boolean = await compare(
      userInfo.password,
      userFound.password
    );

    if (!isCredential) throw new Error(`Your credential isn't valid`);

    return {
      userData: userFound,
      tokenData: {
        expiresIn: this.jwtExpiresIn,
        token: sign({ phoneNumber: userInfo.phoneNumber }, this.jwtSecretKey, {
          expiresIn: this.jwtExpiresIn,
        }),
      },
    };
  }
  
  public async authMiddleware(
    req: Request
  ): Promise<boolean> {
    const em = this.entityManager.fork();
		const Authorization =
			req.cookies['Authorization'] ||
			(req.header('Authorization')
				? req.header('Authorization')?.split('Bearer ')[1]
				: null);

		if (!Authorization) {
			throw new Error(`Wrong authentication token`);
		}

		const { phoneNumber } = verify(
			Authorization,
			this.jwtSecretKey,
		) as {
			phoneNumber: string;
			roles: string[];
		};

		const findUser = await em.findOne(UserModel, {
			phoneNumber: phoneNumber,
		});

		if (!findUser) {
			throw new Error("You don't have permission");
		}

        return true
  }
}
