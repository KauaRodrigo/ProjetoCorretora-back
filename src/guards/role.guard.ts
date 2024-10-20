import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (roles.length == 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    const retorno = this.matchRoles(roles, user.roles);        

    if(!retorno) {
      throw new UnauthorizedException("Acesso negado!");
    }

    return retorno
  }

  private matchRoles(roles: string[], userRoles: string[]): boolean {
    return roles.some(role => userRoles.includes(role));
  }
}
