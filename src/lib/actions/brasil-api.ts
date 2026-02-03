"use server";

export interface NormalizedCompanyData {
    document: string;
    name: string;
    tradeName: string;
    cnaeMainCode: string;
    cnaeMainDesc: string;
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    complement: string;
    email?: string;
    phone?: string;
}

export async function fetchCompanyData(cnpj: string): Promise<NormalizedCompanyData | null> {
    const cleanCnpj = cnpj.replace(/\D/g, "");

    if (cleanCnpj.length !== 14) {
        return null;
    }

    // Provider 1: Publica.cnpj.ws (Often more reliable than BrasilAPI for basic data)
    try {
        console.log(`Trying Publica CNPJ for ${cleanCnpj}...`);
        const response = await fetch(`https://publica.cnpj.ws/cnpj/${cleanCnpj}`);

        if (response.ok) {
            const data = await response.json();
            return {
                document: data.cnpj,
                name: data.razao_social,
                tradeName: data.estabelecimento.nome_fantasia || data.razao_social,
                cnaeMainCode: data.estabelecimento.atividade_principal.id.replace(/\D/g, ""),
                cnaeMainDesc: data.estabelecimento.atividade_principal.descricao,
                cep: data.estabelecimento.cep.replace(/\D/g, ""),
                street: `${data.estabelecimento.tipo_logradouro} ${data.estabelecimento.logradouro}`,
                number: data.estabelecimento.numero,
                neighborhood: data.estabelecimento.bairro,
                city: data.estabelecimento.cidade.nome,
                state: data.estabelecimento.estado.sigla,
                complement: data.estabelecimento.complemento,
                email: data.estabelecimento.email,
                phone: `${data.estabelecimento.ddd1}${data.estabelecimento.telefone1}`
            };
        }
    } catch (e) {
        console.error("Publica CNPJ failed, trying fallback...", e);
    }

    // Provider 2: BrasilAPI (Fallback)
    try {
        console.log(`Trying BrasilAPI for ${cleanCnpj}...`);
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);

        if (response.ok) {
            const data = await response.json();
            return {
                document: data.cnpj,
                name: data.razao_social,
                tradeName: data.nome_fantasia || data.razao_social,
                cnaeMainCode: String(data.cnae_fiscal),
                cnaeMainDesc: data.cnae_fiscal_descricao,
                cep: String(data.cep),
                street: data.logradouro,
                number: data.numero,
                neighborhood: data.bairro,
                city: data.municipio,
                state: data.uf,
                complement: data.complemento,
                email: data.email,
                phone: data.phone
            };
        }
    } catch (e) {
        console.error("BrasilAPI failed...", e);
    }

    // Provider 3: ReceitaWS (Last resort, limited free tier)
    try {
        console.log(`Trying ReceitaWS for ${cleanCnpj}...`);
        const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cleanCnpj}`);

        if (response.ok) {
            const data = await response.json();
            if (data.status === "ERROR") return null;

            return {
                document: data.cnpj,
                name: data.nome,
                tradeName: data.fantasia || data.nome,
                cnaeMainCode: data.atividade_principal[0].code.replace(/\D/g, ""),
                cnaeMainDesc: data.atividade_principal[0].text,
                cep: data.cep.replace(/\D/g, ""),
                street: data.logradouro,
                number: data.numero,
                neighborhood: data.bairro,
                city: data.municipio,
                state: data.uf,
                complement: data.complemento,
                email: data.email,
                phone: data.telefone
            };
        }
    } catch (e) {
        console.error("ReceitaWS failed...", e);
    }

    return null;
}
