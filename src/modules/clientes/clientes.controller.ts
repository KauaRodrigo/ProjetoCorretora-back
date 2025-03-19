import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ClientesService } from "./clientes.service";
import Cliente from "src/database/models/clientes.model";
import { AuthGuard } from "src/common/guards/auth.guard";

@Controller('clientes')
export class ClienteController {

    constructor(private readonly clienteService: ClientesService) {}

    // @Post('')
    // async buscaClientesPorNome(@Body() oBody: { sNome: string }): Promise<Cliente[]> {
    //     return this.clienteService.getClientesPorNome(oBody.sNome);
    // }

    @Post('')
    async buscaClientes(@Body() oBody: any): Promise<any[]> {
        return this.clienteService.getClientes(oBody);
    }

    @Post('cadastrar')
    async cadastrarCliente(@Body() oDados: any): Promise<any> {        
        return this.clienteService.cadastrarCliente(oDados);
    }

    @Get(':id')
    async buscarClienteById(@Param('id') id: number): Promise<any> {
        return this.clienteService.getClientesById(id);
    }

    @Patch(':id')
    async atualizarClienteById(@Param('id') id: number, @Body() payload): Promise<any> {
        return this.clienteService.atualizarClienteById(id, payload);
    }

    @Patch(':id/ativar-inativar')
    async ativarInativarCliente(@Param('id') id: number): Promise<any> {
        return this.clienteService.ativarInativarCliente(id);
    }

}