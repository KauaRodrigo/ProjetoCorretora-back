import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, QueryTypes, Sequelize } from "sequelize";
import Cliente from "src/database/models/clientes.model";
import Seguradora from "src/database/models/seguradora.model";

@Injectable()
export class SeguradoraService {
    
    constructor(
        @InjectModel(Seguradora) readonly seguradoraModel: typeof Seguradora,
        @InjectModel(Cliente) readonly clienteModel: typeof Cliente,
        @Inject('SEQUELIZE') private sequelize: Sequelize
    ) {}

    async buscaSeguradoras(oFiltros) {
        let sSql = `
            SELECT seguradora.id,
                   seguradora.nome,
                   seguradora.status
              FROM seguradora
             WHERE seguradora."deletedAt" IS NULL
               AND seguradora.status = 1
        `;

        if(oFiltros.sNome) {
            sSql += `
                AND seguradora.nome ILIKE '%${oFiltros.sNome}%'
            `;
        }

        let sOrderBy = `ORDER BY ${oFiltros.orderBy} ${oFiltros.order}\n`;

        const iCount: any = await this.sequelize.query(`SELECT COUNT(*) FROM (${sSql})`, {type: QueryTypes.SELECT});        

        let sOffset  = `LIMIT ${oFiltros.perPage} OFFSET ${oFiltros.page} * ${oFiltros.perPage}`

        sSql = sSql + sOrderBy + sOffset;

        return {
            rows: (await this.sequelize.query(sSql, {type: QueryTypes.SELECT})),
            count: iCount[0].count
        };
    }

    async buscaSeguradoraById(iId: number) {
        return this.seguradoraModel.findOne({
            where: {
                id: iId
            }
        })
    }

    async cadastrarSeguradora(oDados) {
        return this.seguradoraModel.create(oDados);
    }

    async atualizarSeguradora(iId: number, oDados) {        
        return this.seguradoraModel.update(oDados, {
            where: {
                id: iId
            }
        });
    }

    async ativarInativarSeguradora(iId: number) {
        const oSeguradora = await this.buscaSeguradoraById(iId);

        await this.clienteModel.update({
            status: 0
        }, {
            where: {
                seguradoraId: iId
            }
        });

        return oSeguradora.update({
            status: oSeguradora.status === 1 ? 0 : 1
        });
    }

    async buscarClientesAtivosSeguradora(iId: number) {
        const sSql = `
            SELECT clientes.id,
                   clientes.name
              FROM clientes
             WHERE clientes.status = 1
               AND clientes."seguradoraId" = ${iId}
        `;

        const iCount: any = await this.sequelize.query(`SELECT COUNT(*) FROM (${sSql})`, {type: QueryTypes.SELECT});        
        
        return {
            rows: (await this.sequelize.query(sSql, {type: QueryTypes.SELECT})),
            count: iCount[0].count
        };
    }

}