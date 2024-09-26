import {Inject, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {QueryTypes, Sequelize, Transaction} from 'sequelize';
import Sinistro from 'src/database/models/sinistro.model';
import Cliente from 'src/database/models/clientes.model';
import LastRecords from 'src/dtos/lastRecords.dto';
import { TipoSinistro } from 'src/enums/tipoSinistros';
import { format, subDays } from 'date-fns';
import Adress from "../database/models/adress.model";
import Comments from "../database/models/comments.model";
import Seguradora from "../database/models/seguradora.model";
import { User } from 'src/database/models/user.model';


@Injectable()
export class SinistrosService {

    constructor(
        @InjectModel(Sinistro) readonly sinistroModel: typeof Sinistro,
        @InjectModel(Cliente) readonly clienteModel: typeof Cliente,
        @InjectModel(Adress) readonly enderecoModel: typeof Adress,
        @InjectModel(Comments) readonly commentsModel: typeof Comments,
        @InjectModel(Seguradora) readonly  seguradoraModel: typeof Seguradora,
        @InjectModel(User) readonly userModel: typeof User,
        @Inject('SEQUELIZE') private sequelize: Sequelize
    ) {
    }

    async getAccidentSingle(id: number) {
        try {
            const result: any = await this.sinistroModel.findOne({
                where: {
                    id,
                }, include: [{
                    model: this.clienteModel,
                    include: [
                        this.seguradoraModel
                    ]
                }]
            })

            const fotos = await this.sequelize.query(`select * from fotos where "sinistroId" = ${id}`)            
            
            const newFotos = fotos[0].map((foto: any) => {
                return foto.conteudo.toString()
            })            

            return {
                codigo: result.codigo,
                placa: result.placa,
                evento: result.evento,
                terceiro: result.terceiro,
                tipo: result.tipo,
                nome: result.cliente.name,
                seguradora: result.cliente.seguradora.nome,
                fotos: newFotos,
                dataOcorrencia: format(result.dataOcorrencia, 'yyyy-MM-dd')
            };
            
        } catch (error) {
            throw(error);
        }


    }

    async getAccidentsByFilters(filters: any): Promise<{ rows: any[], count: number }> {
        let {
            dataFilter = '',
            searchFilter = { tipo: '', valor: ''},
            policyNumberFilter = '',
            companyFilter = '',
            statusFilter = '',
            typeFilter = '',
            thirdFilter = '',
            page = 1,
            perPage = 5,
            orderBy = 'codigo',
            order = 'asc'
        } = filters

        let searchFilterValue = ''
        
        if(searchFilter.value != '' && searchFilter.type != '') {
            if(searchFilter.type == "name") {
                searchFilterValue = `AND row.${searchFilter.type} ILIKE '%${searchFilter.value}%'`
            } else {
                searchFilterValue = `AND row.${searchFilter.type} ILIKE '%${searchFilter.value}%'`
            }
        }

        if(dataFilter.init && dataFilter.end) dataFilter = `AND row."createdAt" BETWEEN '${dataFilter.init}' AND ('${dataFilter.end}'::DATE) + '23 hours 59 minutes'::INTERVAL`;
        else dataFilter = '';

        if(policyNumberFilter) policyNumberFilter = `AND row.codigo = ${policyNumberFilter}`;

        if(companyFilter) companyFilter = `AND row.seguradora = '${companyFilter}'`;

        if(thirdFilter) thirdFilter = `AND row.terceiro = '${thirdFilter}'`;

        if(typeFilter) typeFilter = `AND row.tipo = '${typeFilter}'`;

        if(statusFilter) statusFilter = `AND row.status = '${statusFilter}'`;

        let sql = `
        SELECT row.*
          FROM (SELECT s.id,
                       s.codigo,                
                       s.evento,               
                       s.tipo,
                       s."createdAt",
                       s.status,
                       s.terceiro,
                       c.name as "cliente",
                       seg.nome as "seguradora",
                       s.placa
                  FROM sinistros s
                  JOIN clientes c 
                    ON c.id = s."clienteId"
                  JOIN seguradora seg 
                    on seg.id = c."seguradoraId"                 
               ) as row
           WHERE 1 = 1
                 ${companyFilter}
                 ${dataFilter}
                 ${policyNumberFilter}
                 ${statusFilter}
                 ${typeFilter}
                 ${thirdFilter}
                 ${searchFilterValue}
        ORDER BY ${orderBy} ${order}
        `

        console.log(sql)

        const query: any = await this.sinistroModel.sequelize.query(sql + `LIMIT ${perPage} OFFSET ${page} * ${perPage}`, { type: QueryTypes.SELECT})
        const count: any = await this.sinistroModel.sequelize.query(`SELECT COUNT(*) FROM (${sql})`, { type: QueryTypes.SELECT })                

        const rows = query.map((row) => ({
            id:         row.id,
            code:       row.codigo,
            type:       row.tipo,
            event:      row.evento,
            client:     row.cliente,
            status:     row.status,
            company:    row.seguradora
        }))                

        return {
            rows,
            count: count[0].count
        }
    }

    async getResumoCard(tipo: TipoSinistro): Promise<{ aberto: number, retorno_reparo: number }> {
        const sql = `
        SELECT (SELECT count(*) FROM sinistros s WHERE s.status = 'ABERTO' AND s.tipo = '${tipo}') aberto,
               (SELECT count(*) FROM sinistros s WHERE s.status = 'RETORNO_REPARO' AND s.tipo = '${tipo}') retorno_reparo
        `

        const query: any = await this.sinistroModel.sequelize.query(sql, { type: QueryTypes.SELECT })
        return {
            aberto: query[0].aberto,
            retorno_reparo: query[0].retorno_reparo
        }
    }

    async CreateAccidentRegister(payload: any, files: any): Promise<boolean> {            
        let transaction: Transaction = await this.sequelize.transaction();
        try {
            const seguradora: Seguradora = await this.seguradoraModel.create({ nome: payload.seguradora }, { transaction })

            const cliente: Cliente = await this.clienteModel.create({ name: payload.nome, seguradoraId: seguradora.id }, { transaction })

            const endereco: Adress = await this.enderecoModel.create({
                cep:    payload.cep,
                rua:    payload.rua,
                bairro: payload.bairro,
                cidade: payload.cidade,
                estado: payload.estado,                
            }, { transaction })

            payload.enderecoId = endereco.id;
            payload.clienteId = cliente.id;
            payload.status = "ABERTO";           
 
            const newRegister: Sinistro = await this.sinistroModel.create(payload, { transaction });            
            
            await transaction.commit();            

            if(files) {

                for(const file of files) {

                    transaction = await this.sequelize.transaction();
                    
                    const query = `
                        INSERT INTO fotos (conteudo, "sinistroId")
                        VALUES (:file, :sinistroId);            
                    `;

                    await this.sequelize.query(query, {
                        replacements: { file: file.buffer.toString('base64'), sinistroId: newRegister.id},
                        type: QueryTypes.INSERT
                    });          
                    
                    await transaction.commit();
                }
                
                
            }

            return !!newRegister;
        } catch (error) {
            await transaction.rollback();

            throw(error);
        }
    }

    async addComment(content: string, id: number, userId: number = 1): Promise<boolean> {
        const result = await this.commentsModel.create({
            conteudo: content,
            userId: userId,
            sinistroId: id
        })
        return !!result;
    }

    async getComments(id: number): Promise<{rows: any}> {
        const result = await this.commentsModel.findAll({
            include: {
                model: this.userModel,
            },
            where: {
                sinistroId: id   
            },
            order: [
                ['createdAt', 'DESC']
            ]
        })        
        
        const rows = result.map((row: any) => ({            
            usuario: row.user.name,
            conteudo: row.conteudo,
            dataComentario: format(row.createdAt, 'dd/MM/yyyy hh:mm')
        }))

        return {
            rows
        };
    }

    async updateStatusRegister(payload: { status: string, descricao: string }, id: number, userId: number): Promise<boolean> {        
        const transaction = await this.sequelize.transaction();        
        let result;

        try {
            await this.sinistroModel.update(
                { status: payload.status }, 
                { where: { id }
            });

            console.log(payload)

            await this.commentsModel.create({
                conteudo: payload.descricao,
                userId: userId,
                sinistroId: id
            })

            transaction.commit();
        } catch(error) {
            transaction.rollback();
        }

        return !!result;  
    }

    async editAccidentRegister(id: number, payload: any): Promise<boolean> {
        try {            
            const result = await this.sinistroModel.update(payload, {
                paranoid: false,
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
        const result = await this.sinistroModel.update({
            status: 'CANCELADO'
        }, { where: { id }})

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

    async getLastRecords(payload: any): Promise<{ rows: LastRecords[], count: number}> {
        let {            
            page = 1,
            perPage = 5            
        } = payload
        const filter = subDays(new Date(), 3).toISOString()                        

        const sql = `
        SELECT s.id,
               s.codigo,
               se.nome,
               s.evento,
               c.name as cliente,
               s.tipo,
               s."createdAt",
               s.status
          FROM sinistros s
          JOIN clientes c on c.id = s."clienteId"          
          JOIN seguradora se on se.id = c."seguradoraId"           
         WHERE s."createdAt" >= '${filter}' 
         ORDER BY "createdAt" DESC         
        `   
        const query: any = await this.sinistroModel.sequelize.query(sql + `LIMIT ${perPage} OFFSET ${page} * ${perPage}`, { type: QueryTypes.SELECT })
        const count: any = await this.sinistroModel.sequelize.query(`SELECT COUNT(*) FROM (${sql})`, { type: QueryTypes.SELECT })

        const rows = query.map((row: any) => ({
            id: row.id,
            code: row.codigo,
            type: row.tipo,
            event: row.evento,
            cliente: row.cliente,
            status: row.status,
            company: row.nome
        }))

        return {
            rows,
            count: count[0].count
        }

    }


}
