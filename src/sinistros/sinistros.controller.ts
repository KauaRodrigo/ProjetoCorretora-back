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
import { AuthGuard } from 'src/auth/auth.guard';
import { TipoSinistro } from 'src/enums/tipoSinistros';
import LastRecords from 'src/dtos/lastRecords.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {User} from "../decorators/user.decorator";
import { diskStorage } from 'multer';    
import { Response } from 'express';
import { RolesGuard } from 'src/guards/role.guard';
import { Role } from 'src/decorators/role.decorator';

@UseGuards(AuthGuard)
@Controller('sinistros')
export class SinistrosController {

    constructor(private readonly sinistroService: SinistrosService) {}

    @Post('/:id/comment')
    async AddComent(@User() user: any, @Param('id') id: number, @Body() payload: any): Promise<boolean> {        
        return this.sinistroService.addComment(payload.content, id, user.id);
    }

    @Get('/:id/comments')
    async GetComments(@Param('id') id: number): Promise<{ rows: any}> {
        return this.sinistroService.getComments(id);
    }
    
    @Post('')
    async FindAccidentsByFilters(@Body() filters: any): Promise<{ rows: any[], count: number }> {
        const retorno = await this.sinistroService.getAccidentsByFilters(filters);                
        return retorno;        
    }

    @Get('resumo')
    async getResumoCard(@Query() payload: { tipo: TipoSinistro }): Promise<{ aberto: number, indenizado: number }> {
        const retorno = await this.sinistroService.getResumoCard(payload.tipo);        
                            
        return retorno;        
    }
    
    @Post('criar')    
    async createAccidentRegister(@Body() payload: any): Promise<boolean> {        
        return this.sinistroService.CreateAccidentRegister(payload)
    }

    @Post('editar/:id')
    async editAccidentRegister(@Body() payload: any, @Param('id') id: number): Promise<boolean> {
        return this.sinistroService.editAccidentRegister(id, payload);
    }

    @Post('excluir/:id')
    async excludeAccidentRegister(@Param('id') id: number): Promise<boolean> {
        return this.sinistroService.excludeAccidentRegister(id);
    }

    @Post('atualizar/:id')
    async updateStatusRegister(@Body() payload: { status: string }, @Param('id') id: number): Promise<boolean> {
        return this.sinistroService.updateStatusRegister(payload, id);
    }

    @Get('last-records')
    async getLastRecords(@Query() payload: any): Promise<{ rows: LastRecords[], count: number}> {
        const retorno = await this.sinistroService.getLastRecords(payload);        
        return retorno;        
    }

    @Get('/:id')
    async getAccidentSingle(@Param('id') id: number): Promise<any> {
        const retorno = await this.sinistroService.getAccidentSingle(id);    
        return retorno;
    }

}
