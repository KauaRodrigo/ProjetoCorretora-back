import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { map } from 'rxjs';
import { QueryTypes } from 'sequelize';
import Sinistro from 'src/database/models/sinistro.model';
import LastRecords from 'src/dtos/lastRecords.dto';
import { TipoSinistro } from 'src/enums/tipoSinistros';

@Injectable()
export class SinistrosService {

    constructor(@InjectModel(Sinistro) readonly sinistroModel: typeof Sinistro) {}

    async getResumoCard(tipo: TipoSinistro): Promise<{ aberto: number, indenizado: number }> {
        const sql = `
        SELECT (SELECT count(*) FROM frcorretora.sinistros s WHERE s.status = 'ABERTO' AND s.tipo = '${tipo}') aberto,
               (SELECT count(*) FROM frcorretora.sinistros s WHERE s.status = 'INDENIZADO' AND s.tipo = '${tipo}') indenizado
        `

        const query: any = await this.sinistroModel.sequelize.query(sql, { type: QueryTypes.SELECT }) 
        return {
            aberto: query[0].aberto,
            indenizado: query[0].indenizado
        }
    }

    async getLastRecords(): Promise<{ rows: LastRecords[], count: number}> {
        const sql = `
        SELECT s.id,
               s.codigo,
               s.seguradora,
               s.evento,
               s.nome,
               s.tipo,
               s."createdAt",
               s.status
          FROM frcorretora.sinistros s 
         WHERE s.status = 'ABERTO'
      ORDER BY "createdAt" DESC
        `
        const query: any = await this.sinistroModel.sequelize.query(sql, { type: QueryTypes.SELECT }) 
        const rows = query.map((row: Sinistro) => ({
            id: row.id,
            code: row.codigo,
            type: row.tipo,
            event: row.evento,
            company: row.seguradora,
            clientName: row.nome,
            status: row.status
        }))


        return {
            rows,
            count: rows.length
        }
    
    }


}
