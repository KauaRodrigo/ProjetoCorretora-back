import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { map } from 'rxjs';
import { QueryTypes } from 'sequelize';
import Sinistro from 'src/database/models/sinistro.model';
import LastRecords from 'src/dtos/lastRecords.dto';
import { TipoSinistro } from 'src/enums/tipoSinistros';
import { subDays } from 'date-fns';

@Injectable()
export class SinistrosService {

    constructor(@InjectModel(Sinistro) readonly sinistroModel: typeof Sinistro) {}

    async getAccidentsByFilters(filters: any): Promise<{ rows: any[], count: number }> {
        let {
            dataFilter = '',
            searchFilter = '',
            policyNumberFilter = '',
            companyFilter = '',
            statusFilter = '',
            typeFilter = '',
            thirdFilter = ''
        } = filters

        if(dataFilter.init && dataFilter.end) dataFilter = `AND s."createdAt" BETWEEN '${dataFilter.init}' AND '${dataFilter.end}'` 
        else dataFilter = ''

        if(policyNumberFilter) policyNumberFilter = `AND s.codigo = ${policyNumberFilter}`

        if(companyFilter) companyFilter = `AND s.seguradora = '${companyFilter}'`

        if(statusFilter) statusFilter = `AND s.status = '${statusFilter}'`

        if(typeFilter) typeFilter = `AND s.tipo = '${typeFilter}'`

        if(thirdFilter) thirdFilter = `AND s.terceiro = '${thirdFilter}'`

        const sql = `
        SELECT s.id,
               s.codigo,
               s.seguradora,
               s.evento,
               s.nome,
               s.tipo,
               s."createdAt",
               s.status
          FROM sinistros s 
         WHERE 1 = 1
               ${companyFilter}
               ${dataFilter}
               ${policyNumberFilter}
               ${statusFilter}
               ${typeFilter}
               ${thirdFilter}
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

    async getResumoCard(tipo: TipoSinistro): Promise<{ aberto: number, indenizado: number }> {
        const sql = `
        SELECT (SELECT count(*) FROM sinistros s WHERE s.status = 'ABERTO' AND s.tipo = '${tipo}') aberto,
               (SELECT count(*) FROM sinistros s WHERE s.status = 'INDENIZADO' AND s.tipo = '${tipo}') indenizado
        `

        const query: any = await this.sinistroModel.sequelize.query(sql, { type: QueryTypes.SELECT }) 
        return {
            aberto: query[0].aberto,
            indenizado: query[0].indenizado
        }
    }

    async CreateAccidentRegister(payload: any): Promise<boolean> {
        payload.tipo = 'VEICULAR';
        payload.status = 'ABERTO';

        const newAccident = await this.sinistroModel.create(payload)

        if (!newAccident) {
            return false
        }

        return true
    }

    async getLastRecords(): Promise<{ rows: LastRecords[], count: number}> {
        const filter = subDays(new Date(), 7).toISOString()

        const sql = `
        SELECT s.id,
               s.codigo,
               s.seguradora,
               s.evento,
               s.nome,
               s.tipo,
               s."createdAt",
               s.status
          FROM sinistros s 
         WHERE s."createdAt" >= '${filter}' 
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
