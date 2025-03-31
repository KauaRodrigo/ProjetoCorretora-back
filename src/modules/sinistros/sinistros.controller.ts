import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,    
    Res,    
    UploadedFile,    
    UploadedFiles,
    UseGuards,    
    UseInterceptors
} from '@nestjs/common';
import { SinistrosService } from './sinistros.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { TipoSinistro } from 'src/common/enums/tipoSinistros';
import LastRecords from 'src/common/dtos/lastRecords.dto';
import {User} from "../../common/decorators/user.decorator";
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs'; 

@UseGuards(AuthGuard)
@Controller('sinistros')
export class SinistrosController {

    constructor(private readonly sinistroService: SinistrosService) {}

    @Post('')
    async FindAccidentsByFilters(@Body() filters: any): Promise<{ rows: any[], count: number }> {
        const retorno = await this.sinistroService.getAccidentsByFilters(filters);                
        return retorno;        
    } 

    @Post('/:id/comment')
    async AddComent(@User() user: any, @Param('id') id: number, @Body() payload: any): Promise<boolean> {        
        return this.sinistroService.addComment(payload.content, id, user.id);
    }

    @Get('/:id/comments')
    async GetComments(@Param('id') id: number): Promise<{ rows: any}> {
        return this.sinistroService.getComments(id);
    }
    
    @Get('resumo')
    async getResumoCard(@Query() payload: { tipo: TipoSinistro }): Promise<{ aberto: number, retorno_reparo: number }> {
        const retorno = await this.sinistroService.getResumoCard(payload.tipo);        
                            
        return retorno;        
    }
    
    @UseInterceptors(FilesInterceptor('files'))
    @Post('criar')    
    async createAccidentRegister(@Body() payload: any, @UploadedFiles() files: any): Promise<boolean> {
        return this.sinistroService.createAccidentRegister(payload, files)
    }

    @Post('editar/:id')
    async editarDadosSinistro(@Body() payload:any, @Param('id') id:number): Promise<boolean> {
        return this.sinistroService.editarDadosSinistro(id, payload);
    }

    @Post('excluir/:id')
    async excluirSinitro(@Param('id') id:number): Promise<any> {
        return this.sinistroService.excluirSinitro(id);
    }

    @Post('cancelar/:id')
    async cancelarSinistro(@Param('id') id: number): Promise<boolean> {
        return this.sinistroService.cancelarSinistro(id);
    }

    @Post('atualizar/:id')
    async updateStatusRegister(@Body() payload: { status: string, descricao: string }, @Param('id') id: number, @User() user: any): Promise<boolean> {
        return this.sinistroService.updateStatusRegister(payload, id, user.id);
    }

    @Get('last-records')
    async getLastRecords(@Query() payload: any): Promise<{ rows: LastRecords[], count: number}> {
        const retorno = await this.sinistroService.getLastRecords(payload);        
        return retorno;        
    }

    @Post('exportar')
    async exportarSinistrosCSV(@Body() oFiltros, @Res() res: Response): Promise<any> {
        console.log(oFiltros)
        const file = await this.sinistroService.exportarSinistrosCSV(oFiltros)

        try {                  
            res.download(file, 'dados_'+ new Date().getTime() +'.csv', (err) => {
              if (err) {
                console.error('Erro ao baixar CSV:', err);
                res.status(500).send('Erro ao gerar CSV');
              } else {
                fs.unlinkSync(file);
              }
            });
          } catch (error) {
            res.status(500).send(error.message);
          }        
    }    

    @Get('/:id')
    async getAccidentSingle(@Param('id') id: number): Promise<any> {
        const retorno = await this.sinistroService.getAccidentSingle(id);    
        return retorno;
    }

    @Post('atualizarComentario/:id')
    async atualizarComentario(@Param('id') idComentario, @Body() payload): Promise<any> {
        const retorno = await this.sinistroService.atualizarComentario(payload, idComentario);
        return retorno
    }

    @Post('excluirComentario/:id')
    async excluirComentario(@Param('id') idComentario): Promise<any> {
        const retorno = await this.sinistroService.excluirComentario(idComentario);
        return retorno
    }    
}
