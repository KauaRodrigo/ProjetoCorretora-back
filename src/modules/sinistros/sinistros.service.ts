import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes, Sequelize, Transaction, Op } from 'sequelize';
import Sinistro from 'src/database/models/sinistro.model';
import Cliente from 'src/database/models/clientes.model';
import LastRecords from 'src/common/dtos/lastRecords.dto';
import { TipoSinistro } from 'src/common/enums/tipoSinistros';
import { format } from 'date-fns';
import Comments from "../../database/models/comments.model";
import Seguradora from "../../database/models/seguradora.model";
import { User } from 'src/database/models/user.model';
import * as fs from 'fs';
import { join, extname } from 'path';

type ResumoCard = {
    aberto: number,
    retorno_reparo: number     
}


@Injectable()
export class SinistrosService {

    constructor(
        @InjectModel(Sinistro) readonly sinistroModel: typeof Sinistro,
        @InjectModel(Cliente) readonly clienteModel: typeof Cliente,        
        @InjectModel(Comments) readonly commentsModel: typeof Comments,
        @InjectModel(Seguradora) readonly  seguradoraModel: typeof Seguradora,
        @InjectModel(User) readonly userModel: typeof User,
        @Inject('SEQUELIZE') private sequelize: Sequelize
    ) {}

    async getAccidentSingle(id: number): Promise<any> {
        try {
            const result: any = await this.sinistroModel.findOne({
                include: [
                    {
                        model: this.clienteModel,
                        include: [this.seguradoraModel]
                    }                    
                ],
                where: {
                    id,
                }
            })                        

            const fotos = await this.sequelize.query(`select * from fotos where "sinistroId" = :id`, {
                replacements: {
                    id: id,
                }
            });
            
            const newFotos = fotos[0].map((foto: any) => {
                return foto.conteudo.toString()
            })                        

            return {
                numeroApolice: result.numeroApolice,
                numeroSinistro: result.numeroSinistro,
                placa: result.placa,
                tipo: result.tipo,
                observacoes: result.observacoes,
                evento: result.evento,
                terceiro: result.terceiro,
                nome: result.cliente.name,
                clienteId: result.cliente.id,
                nomeTerceiro: result.nomeTerceiro,
                seguradora: result.cliente.seguradora.nome,
                seguradoraId: result.cliente.seguradora.id,
                fotos: newFotos,
                dataOcorrencia: format(result.dataOcorrencia, 'yyyy-MM-dd')
            };
            
        } catch (error) {
            throw(error);
        }


    }

    async getAccidentsByFilters(filters: any): Promise<{ rows: any[], count: number }> {
        let {
            data = '',
            searchFilter = { coluna: '', valor: ''},
            apolice = '',
            seguradora = '',
            status = '',
            tipo = '',            
            page = 1,
            perPage = 5,
            orderBy = "numeroApolice",
            order = 'asc'
        } = filters

        let searchFilterValue = ''
        
        if(searchFilter.valor != '' && searchFilter.coluna != '') {
            if(searchFilter.type == "name") {
                searchFilterValue = `AND row.${searchFilter.coluna} ILIKE '%${searchFilter.valor}%'`
            } else {
                searchFilterValue = `AND row.${searchFilter.coluna} ILIKE '%${searchFilter.valor}%'`
            }
        }

        if(data.inici && data.final) data = `AND row."dataOcorrencia" BETWEEN '${data.inicial}' AND ('${data.final}'::DATE) + '23 hours 59 minutes'::INTERVAL`;
        else data = '';

        if(apolice) apolice = `AND row."numeroApolice" = ${apolice}`;

        if(seguradora) seguradora = `AND row.seguradora = '${seguradora}'`;        

        if(tipo) tipo = `AND row.tipo = '${tipo}'`;

        if(status) status = `AND row.status = '${status}'`;

        let sql = `
        SELECT row.*
          FROM (SELECT s.id,
                       s."numeroApolice",
                       s."numeroSinistro",
                       s.evento,               
                       s.tipo,
                       s."createdAt",
                       s.status,
                       s.terceiro,
                       c.name as "cliente",
                       seg.nome as "seguradora",
                       s.placa,
                       s."dataOcorrencia"
                  FROM sinistros s
                  JOIN clientes c 
                    ON c.id = s."clienteId"
                  JOIN seguradora seg 
                    on seg.id = c."seguradoraId"                 
                 WHERE s."deletedAt" is null
               ) as row
           WHERE 1 = 1             
                 ${seguradora}
                 ${data}
                 ${apolice}
                 ${status}
                 ${tipo}                 
                 ${searchFilterValue}
        ORDER BY "${orderBy}" ${order} 
        `;        

        const query: any = await this.sinistroModel.sequelize.query(sql + `LIMIT ${perPage} OFFSET ${page} * ${perPage}`, { type: QueryTypes.SELECT, logging: true})
        const count: any = await this.sinistroModel.sequelize.query(`SELECT COUNT(*) FROM (${sql})`, { type: QueryTypes.SELECT })                

        const rows = query.map((row) => ({
            id:             row.id,
            code:           row.numeroApolice,
            numeroSinistro: row.numeroSinistro,
            type:           row.tipo,
            event:          row.evento,
            client:         row.cliente,
            status:         row.status,
            company:        row.seguradora
        }))                

        return {
            rows,
            count: count[0].count
        }
    }    

    async getResumoCard(tipo: TipoSinistro): Promise<ResumoCard> {
        const sql = `
            SELECT (SELECT count(*) FROM sinistros s WHERE s.status = 'ABERTO'         AND s.tipo = :tipo AND s."deletedAt" is null) aberto,
                   (SELECT count(*) FROM sinistros s WHERE s.status = 'RETORNO_REPARO' AND s.tipo = :tipo AND s."deletedAt" is null) retorno_reparo
        `;

        const query: any = await this.sinistroModel.sequelize.query(
            sql, 
            { 
                type: QueryTypes.SELECT,
                replacements: {
                    tipo: tipo
                } 
            }
        );

        return {
            aberto: query[0].aberto,
            retorno_reparo: query[0].retorno_reparo
        };
    }

    async createAccidentRegister(payload: any, files: any): Promise<boolean> {            
        let transaction: Transaction = await this.sequelize.transaction();        
        
        try {            
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
            idUsuario: row.user.id,        
            usuario: row.user.name,
            conteudo: row.conteudo,
            idComentario: row.id,
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
        try {
            const result = await this.sinistroModel.destroy({ where: { id }});

            return !!result;
        }
        catch (error) {
            throw(error);
        }        
    }

    async cancelarSinistro(iId: number): Promise<boolean> {
        const result = await this.sinistroModel.update({
            status: 'CANCELADO'
        }, { where: { id: iId }})

        return !!result;
    }

    async excluirSinitro(id: number): Promise<any> {    
        let result;
        try {
            var teste = await this.sinistroModel.findOne({where: { id }});
            result = await this.sinistroModel.destroy({ 
                where: { 
                    id
                }
            });
            return result;
        } catch(error) {
            throw(error);
        }
    }

    async editarDadosSinistro(id: number, payload:any): Promise<boolean> {    
        let result;
        try {
            var teste = await this.sinistroModel.findOne({where: { id }});
            result = await this.sinistroModel.update(payload, { 
                where: { 
                    id
                }
            });
            return result;
        } catch(error) {
            throw(error);
        }
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

        const sql = `
             SELECT s.id,
                    s."numeroApolice",
                    s."numeroSinistro",
                    se.nome,
                    s.evento,
                    c.name as cliente,
                    s.tipo,
                    s."createdAt",
                    s.status
                FROM sinistros s
                JOIN clientes c on c.id = s."clienteId"          
                JOIN seguradora se on se.id = c."seguradoraId"           
                WHERE s."createdAt" >= now() - '7 days'::INTERVAL 
                  AND s."deletedAt" is null
                ORDER BY "createdAt" DESC         
        `;
        
        const query: any = await this.sinistroModel.sequelize.query(sql + `LIMIT ${perPage} OFFSET ${page} * ${perPage}`, { type: QueryTypes.SELECT })
        const count: any = await this.sinistroModel.sequelize.query(`SELECT COUNT(*) FROM (${sql})`, { type: QueryTypes.SELECT })

        const rows = query.map((row: any) => ({
            id: row.id,
            code: row.codigo,
            numeroSinistro: row.numeroSinistro,
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

    async atualizarComentario(oPayload: { conteudo: string }, iComentario: number): Promise<boolean> {
        const result = await this.commentsModel.update({
            conteudo: oPayload.conteudo
        }, {
            where: {
                id: iComentario
            }
        })
        return !!result;        
    }

    async excluirComentario(iComentario: number): Promise<number> {        
        return this.commentsModel.destroy({
            where: {
                id: iComentario
            }
        })        
    }
    
    /**
     * Busca clientes com base no valor passado para o campo nome
     * 
     * @param {string} sNome
     * @returns {Cliente[]}
     */
    async buscaClienteByNome(sNome: string): Promise<Cliente[]> {
        return this.clienteModel.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${sNome}%`
                }
            }
        });
    }

    async exportarSinistrosCSV(oFiltros): Promise<any> {        
        let {
            data = '',
            searchFilter = { coluna: '', valor: ''},
            apolice = '',
            seguradora = '',
            status = '',
            tipo = '',            
        } = oFiltros;

        let searchFilterValue = ''
        
        if(searchFilter.valor != '' && searchFilter.coluna != '') {
            if(searchFilter.type == "name") {
                searchFilterValue = `AND row.${searchFilter.coluna} ILIKE '%${searchFilter.valor}%'`
            } else {
                searchFilterValue = `AND row.${searchFilter.coluna} ILIKE '%${searchFilter.valor}%'`
            }
        }

        if(data.inicial && data.final) data = `AND row."dataOcorrencia" BETWEEN '${data.inicial}' AND ('${data.final}'::DATE) + '23 hours 59 minutes'::INTERVAL`;
        else data = '';

        if(apolice) apolice = `AND row."numeroApolice" = ${apolice}`;

        if(apolice) apolice = `AND row.seguradora = '${apolice}'`;        

        if(tipo) tipo = `AND row.tipo = '${tipo}'`;

        if(status) status = `AND row.status = '${status}'`;

        let sql = `
            SELECT row.*
            FROM (SELECT s."numeroApolice",
                         s."numeroSinistro",
                         s.evento,               
                         s.tipo,                        
                         s.status,
                         CASE 
                             WHEN s.terceiro = true THEN 'Sim'
                             ELSE 'Não'
                          END as terceiro,
                         c.name as "cliente",
                         seg.nome as "seguradora",
                         s.placa,
                         s."createdAt"::DATE,
                         s."dataOcorrencia"
                    FROM sinistros s
                    JOIN clientes c 
                      ON c.id = s."clienteId"
                    JOIN seguradora seg 
                      ON seg.id = c."seguradoraId"                 
                   WHERE s."deletedAt" is null
                ) AS row
            WHERE 1 = 1             
                    ${apolice}
                    ${data}
                    ${apolice}
                    ${status}
                    ${tipo}                    
                    ${searchFilterValue}             
        `;        

        const oDados: any = await this.sinistroModel.sequelize.query(sql, { type: QueryTypes.SELECT});           

        if(oDados.length === 0) {
            throw('Nenhum registro encontrado');
        }

        const file = join(__dirname, 'sinistros.csv');        

        const headers = 'Número Apólice;Número Sinistro;Evento;Tipo;Status;Terceiro;Cliente;Seguradora;Placa;Data do Registro;Data da Ocorrência\n';    

        const body = oDados.map((oDado) => Object.values(oDado).join(';')).join('\n');

        fs.writeFileSync(file, headers + body, 'utf-8');

        return file;
    }    

}
