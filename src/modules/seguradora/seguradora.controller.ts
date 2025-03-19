import { SeguradoraService } from './seguradora.service';
import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";

@Controller('seguradoras')
export class SeguradoraController {

    constructor(private readonly seguradoraService: SeguradoraService) {}    

    @Post('')
    async buscaSeguradoras(@Body() oFiltros: any) {
        return this.seguradoraService.buscaSeguradoras(oFiltros);
    }

    @Post('cadastrar')
    async cadastrarSeguradora(@Body() oDados: any) {
        return this.seguradoraService.cadastrarSeguradora(oDados);
    }

    @Get(':id')
    async buscaSeguradoraById(@Param('id') id: number) {
        return this.seguradoraService.buscaSeguradoraById(id);
    }

    @Patch(':id/alterar')
    async atualizarSeguradora(@Param('id') id: number, @Body() oDados: any) {
        return this.seguradoraService.atualizarSeguradora(id, oDados);        
    }

    @Patch(':id/ativar-inativar/')
    async ativarInativarSeguradora(@Param('id') id: number) {
        return this.seguradoraService.ativarInativarSeguradora(id);
    }

    @Get(':id/clientes')
    async buscarClientesAtivosSeguradora(@Param('id') id: number) {
        return this.seguradoraService.buscarClientesAtivosSeguradora(id);
    }

}