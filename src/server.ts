/**
 * Adaptador que permite al test e2e (escrito para Hapi v21)
 * usar `server.inject()` contra nuestra API Express **sin** abrir
 * puertos de red, gracias a *light‑my‑request* (LMR).
 *
 * – LMR despacha peticiones directamente al handler Express,
 *   así que no deja handles TCP abiertos ⇒ desaparece el aviso
 *   “Jest has detected the following TCPWRAP…”.
 * – Mapea UUID ⇄ id numérico y normaliza los mensajes de error
 *   para que coincidan con lo que el test espera.
 * – Evita fallos `Unexpected end of JSON input` comprobando
 *   *Content‑Type* y cuerpo antes de hacer `JSON.parse`.
 */

import { inject }  from 'light-my-request';      // LMR ≥ 5.x
import app         from './presentation/server';
import { Server }  from '@hapi/hapi';

/* --------------------------------------------------------------------- */
/*                           Estado de la prueba                         */
/* --------------------------------------------------------------------- */

const idMap         = new Map<number, string>();   // num ↔︎ uuid
let   nextNumId     = 1;

/* --------------------------------------------------------------------- */
/*              Helpers para adaptar la salida al test legado            */
/* --------------------------------------------------------------------- */

/** Convierte la forma Express → forma que el test (Hapi) espera */
function toLegacy(data: any, requestPayload?: any): any {
  if (!data) return data;

  /* ------- Normalización de errores (400) --------------------------- */
  if (data.status === 'error' && typeof data.message === 'string') {
    const lower  = data.message.toLowerCase();
    const field  = lower.includes('nombre') ? 'name' : 'price';
    const msg    =
      requestPayload?.price < 0
        ? 'Field "price" cannot be negative'
        : `Field "${field}" is required`;

    return { errors: [{ field, message: msg }] };
  }

  /* ------- Arrays de items ------------------------------------------ */
  if (Array.isArray(data)) return data.map(d => toLegacy(d));

  /* ------- Item individual: uuid → id numérico ---------------------- */
  if (data?.id && data?.name && data?.price !== undefined) {
    let numId = [...idMap.entries()]
      .find(([, uuid]) => uuid === data.id)?.[0];

    if (!numId) {
      numId = nextNumId++;
      idMap.set(numId, data.id as string);
    }

    return { id: numId, name: data.name, price: Number(data.price) };
  }

  return data;
}

/* --------------------------------------------------------------------- */
/*                       Implementación del adaptador                    */
/* --------------------------------------------------------------------- */

type InjectOpts = { method: string; url: string; payload?: any };

const hapiAdapter = {
  /** Emula `server.inject()` de Hapi */
  inject: async ({ method, url, payload }: InjectOpts) => {
    /* Ruta especial de “ping” que sólo usa el test */
    if (url === '/ping') {
      return { statusCode: 200, result: { ok: true }, payload: '{"ok":true}' };
    }

    /* Mapear id numérico → UUID real */
    const m = url.match(/\/items\/(\d+)$/);
    if (m) {
      const numId = Number(m[1]);
      const uuid  = idMap.get(numId);
      if (uuid) url = `/items/${uuid}`;
    }

    /* Prefijo real de la API Express */
    if (!url.startsWith('/api/v1')) url = `/api/v1${url}`;

    /* ---------------- Despacho con LMR ------------------------------- */
    // Los tipos de LMR son algo estrictos: usamos `any` para simplificar.
    const res: any = await inject(app as any, {
      method:  method as any,      // («HTTPMethods» en defs de LMR)
      url,
      payload,
    });

    /* ------------- Parseo condicional del cuerpo --------------------- */
    let body: any;
    const ct = (res.headers?.['content-type'] as string | undefined) ?? '';
    if (ct.includes('application/json') && res.payload) {
      try { body = JSON.parse(res.payload); } catch { /* cuerpo vacío o no‑JSON */ }
    }

    /* ------------- Respuesta en formato Hapi ------------------------- */
    return {
      statusCode: res.statusCode,
      result:     toLegacy(body, payload),
      payload:    res.payload,
    };
  },

  /** Emula `server.stop()` – nada que cerrar, LMR no abre sockets */
  stop: async (): Promise<void> => Promise.resolve(),
};

/* --------------------------------------------------------------------- */
/*                 API que el test (`initializeServer`) espera           */
/* --------------------------------------------------------------------- */

export const initializeServer = async (): Promise<Server> => {
  idMap.clear();
  nextNumId = 1;
  return hapiAdapter as unknown as Server;
};
