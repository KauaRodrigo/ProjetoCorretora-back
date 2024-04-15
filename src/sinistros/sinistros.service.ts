import {Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {QueryTypes, Sequelize} from 'sequelize';
import Sinistro from 'src/database/models/sinistro.model';
import Cliente from 'src/database/models/clientes.model';
import LastRecords from 'src/dtos/lastRecords.dto';
import { TipoSinistro } from 'src/enums/tipoSinistros';
import { subDays } from 'date-fns';
import Adress from "../database/models/adress.model";
import Comments from "../database/models/comments.model";

@Injectable()
export class SinistrosService {

    constructor(
        @InjectModel(Sinistro) readonly sinistroModel: typeof Sinistro,
        @InjectModel(Cliente) readonly clienteModel: typeof Cliente,
        @InjectModel(Adress) readonly enderecoModel: typeof Adress,
        @InjectModel(Comments) readonly commentsModel: typeof Comments
    ) {
    }

    async getAccidentSingle(id: number) {
        try {
            const result: any = await this.sinistroModel.findOne({
                where: {
                    id,
                }, include: [
                    this.clienteModel,
                    this.enderecoModel
                ]
            })

            return result;
        } catch (error) {
            throw(error);
        }


    }

    async getAccidentsByFilters(filters: any): Promise<{ rows: any[], count: number }> {
        let {
            dataFilter = '',
            searchFilter = { coluna: '', valor: ''},
            policyNumberFilter = '',
            companyFilter = '',
            statusFilter = '',
            typeFilter = '',
            thirdFilter = ''
        } = filters

        let searchFilterValue = ''

        if(searchFilter.valor != '' && searchFilter.coluna != '') {
            if(searchFilter.coluna == "NOME") {
                searchFilterValue = `AND c.name ILIKE '%${searchFilter.valor}%'`
            } else {
                searchFilterValue = `AND s.${searchFilter.coluna} ILIKE '%${searchFilter.valor}%'`
            }
        }

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
               s.evento,               
               s.tipo,
               s."createdAt",
               s.status,
               c.name as "nome",
               seg.nome
          FROM sinistros s
          JOIN clientes c ON c.id = s."clienteId"
          JOIN seguradora seg on seg.id = c."seguradoraId"
         WHERE 1 = 1
               ${companyFilter}
               ${dataFilter}
               ${policyNumberFilter}
               ${statusFilter}
               ${typeFilter}
               ${thirdFilter}
               ${searchFilterValue}
      ORDER BY "createdAt" DESC      
        `
        const query: any = await this.sinistroModel.sequelize.query(sql, { type: QueryTypes.SELECT })
        const rows = query.map((row: Sinistro) => ({
            id:         row.id,
            code:       row.codigo,
            type:       row.tipo,
            event:      row.evento,
            client:     row.cliente,
            status:     row.status
        }))

        return {
            rows,
            count: rows.length
        }
    }

    async getResumoCard(tipo: TipoSinistro): Promise<{ aberto: number, indenizado: number }> {
        const sql = `
        SELECT (SELECT count(*) FROM sinistros s WHERE s.status = 'ABERTO' AND s.tipo = '${tipo}') aberto,
               (SELECT count(*) FROM sinistros s WHERE s.status = 'INDENIZADO/FECHADO' AND s.tipo = '${tipo}') indenizado
        `

        const query: any = await this.sinistroModel.sequelize.query(sql, { type: QueryTypes.SELECT })
        return {
            aberto: query[0].aberto,
            indenizado: query[0].indenizado
        }
    }

    async CreateAccidentRegister(payload: any): Promise<boolean> {
        try {
            const cliente = await this.clienteModel.create({ name: payload.nome })

            payload.cliente = cliente.id;
            const newRegister = await this.sinistroModel.create(payload);

            return !!newRegister;
        } catch (error) {
            throw(error);
        }
    }

    async addComment(content: string, id: number, userId: number): Promise<boolean> {
        const result = await this.commentsModel.create({
            conteudo: content,
            userId: 1,
            sinistroId: id
        })
        return !!result;
    }

    async updateStatusRegister(payload: { status: string }, id: number): Promise<boolean> {
        const status = [
            'ABERTO',
            'REPARO',
            'INDENIZADO/FECHADO'
        ]

        const nextStatus = status[status.indexOf(payload.status) + 1]

        const result = await this.sinistroModel.update(
            {
                status: nextStatus
            }, {
            where: {
                id
            }
        });

        return !!result;
    }

    async editAccidentRegister(id: number, payload: any): Promise<boolean> {
        try {
            const result = await this.sinistroModel.update(payload, {
                where: {
                    id
                }
            })

            return !!result;
        } catch(error) {
            throw(error);
        }
    }

    async excludeAccidentRegister(id: number): Promise<boolean> {
        await this.sinistroModel.update({
            status: 'INDENIZADO/FECHADO'
        }, { where: { id }})

        const result = await this.sinistroModel.destroy({
            where: {
                id
            }
        })
        return !!result;
    }

    async EditAccidentRegister(id: number, payload: any): Promise<boolean> {
        try {
            const result = await this.sinistroModel.update(payload, {
                where: {
                    id,
                }
            })

            return result['affectedCount'] > 0;
        } catch (error) {
            throw(error);
        }
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
            cliente: row.cliente,
            status: row.status
        }))

        return {
            rows,
            count: rows.length
        }

    }


}
