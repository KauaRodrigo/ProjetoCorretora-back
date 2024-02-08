import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import Sinistro from 'src/database/models/sinistro.model';
import { TipoSinistro } from 'src/enums/tipoSinistros';

@Injectable()
export class SinistrosService {

    constructor(@InjectModel(Sinistro) readonly sinistroModel: typeof Sinistro) {}

    async getResumoCard(tipo: TipoSinistro): Promise<{ aberto: number, indenizado: number }> {
        const sql = `
            SELECT (SELECT count(*) FROM frcorretora.sinistros s WHERE s.status = 'ABERTO') aberto,
	               (SELECT count(*) FROM frcorretora.sinistros s WHERE s.status = 'INDENIZADO') indenizado
              FROM frcorretora.sinistros s
             WHERE s.tipo = '${tipo}'
        `

        const query: any = await this.sinistroModel.sequelize.query(sql, { type: QueryTypes.SELECT }) 
        return {
            aberto: query[0].aberto,
            indenizado: query[0].indenizado
        }
    }

}
