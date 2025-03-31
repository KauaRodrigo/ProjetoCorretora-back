import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize, Op, QueryTypes } from "sequelize";
import Cliente from "src/database/models/clientes.model";
import Seguradora from "src/database/models/seguradora.model";

@Injectable()
export class ClientesService {

    constructor(
        @InjectModel(Cliente) readonly clienteModel: typeof Cliente,
        @InjectModel(Seguradora) readonly seguradoraModel: typeof Seguradora,
        @Inject('SEQUELIZE') private sequelize: Sequelize
    ) {}

    /**
     * Busca os cliente pelo id;
     * 
     * @param { number } iId
     * @return { Cliente[]}
     */
    async getClientesById(iId: number): Promise<any> {
        let sSql = `
            SELECT clientes.id,
                   clientes.name,
                   clientes.cpf,
                   clientes.telefone,
                   clientes."dataNascimento",
                   seguradora.id AS "seguradoraId",
                   seguradora.nome AS seguradora
              FROM clientes
         LEFT JOIN seguradora
                ON seguradora.id = clientes."seguradoraId"
             WHERE clientes.id = ${iId}
        `;
        
        const oResultado = (await this.sequelize.query(sSql, {
            type: QueryTypes.SELECT
        }))[0];     

        return oResultado;
        
    }

    async getClientes(oFiltros: any): Promise<any> {        
        let sSql = `
            SELECT clientes.id,
                   clientes.name,
                   clientes.cpf,
                   clientes.telefone,
                   clientes.status,
                   seguradora.nome
              FROM clientes
         LEFT JOIN seguradora 
                ON seguradora.id = clientes."seguradoraId"
             WHERE clientes."deletedAt" IS NULL 
        `

        let sFiltros = '';

        if(oFiltros.sCpf) {
            sFiltros += `AND cpf like '%${oFiltros.sCpf}%'\n`;
        }

        if(oFiltros.sNomeCliente) {
            sFiltros += `AND name ilike '%${oFiltros.sNomeCliente}%'\n`;
        }   
        
        if(oFiltros.sTelefone) {
            sFiltros += `AND telefone ilike '%${oFiltros.sTelefone}%'\n`;
        }

        sSql += sFiltros;

        let sOrderBy = `ORDER BY ${oFiltros.orderBy} ${oFiltros.order}\n`;

        const iCount: any = await this.sequelize.query(`SELECT COUNT(*) FROM (${sSql})`, {type: QueryTypes.SELECT});        

        let sOffset  = `LIMIT ${oFiltros.perPage} OFFSET ${oFiltros.page} * ${oFiltros.perPage}`

        sSql += sOrderBy + sOffset;    

        return {
            rows: (await this.sequelize.query(sSql, {type: QueryTypes.SELECT})),
            count: iCount[0].count
        };
    }

    async cadastrarCliente(oDados): Promise<boolean> {                                
        const cliente: any = await this.clienteModel.create(oDados);

        return !!cliente;
    }

    async atualizarClienteById(iId: number, oDados: any) {
        const oDadosTratados = this.tratarDadosCliente(oDados);

        return this.clienteModel.update(oDadosTratados, {
            fields: [
                'name',
                'dataNascimento',
                'cpf',
                'telefone',
                'seguradoraId'
            ],
            paranoid: true,
            where: {
                id: iId
            }
        })
    }

    async ativarInativarCliente(iId: number) {
        const oCliente: any = await this.clienteModel.findOne({
            where: {
                id: iId
            }
        });

        return this.clienteModel.update({
            status: oCliente.status === 1 ? 0 : 1
        }, {
            where: {
                id: iId
            }
        });
    }

    async buscarCliente(oDados: any): Promise<any> {
        const oCliente: any = await this.clienteModel.findOne({
            where: {                
                name: {
                    [Op.like]: `%${oDados.sNome}%`
                }
            }
        });

        return oCliente;
    }

    tratarDadosCliente(oDados) {
        return {
            name: oDados.name,
            dataNascimento: oDados.dataNascimento,
            cpf: oDados.cpf,
            telefone: oDados.telefone,
            seguradoraId: oDados.seguradora
        }
    }
}