import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ClientesService } from "./clientes.service";
import Cliente from "src/database/models/clientes.model";
import { AuthGuard } from "src/common/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller('clientes')
export class ClienteController {

    constructor(private readonly clienteService: ClientesService) {}

    @Post('')
    async buscaClientesPorNome(@Body() oBody: { sNome: string }): Promise<Cliente[]> {
        return this.clienteService.getClientesPorNome(oBody.sNome);
    }

    @Post('cadastrar')
    async cadastrarCliente(@Body() oDados: any): Promise<any> {        
        return this.clienteService.cadastrarCliente(oDados);
    }
}