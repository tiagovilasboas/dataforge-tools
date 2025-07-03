import { useState, useCallback } from "react";
import { ZodError } from "zod";
import { jwtSchema, type Jwt } from "./schema";

export function useJwtDecoder() {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<Jwt | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);

  const decodeJwt = useCallback(() => {
    if (!input.trim()) {
      setErrors([]);
      setDecoded(null);
      setIsValid(false);
      return;
    }

    try {
      // Remove espaços em branco e quebras de linha
      const cleanInput = input.trim();
      
      // Verifica se é um JWT válido (3 partes separadas por ponto)
      const parts = cleanInput.split('.');
      if (parts.length !== 3) {
        setErrors(["JWT deve ter exatamente 3 partes separadas por ponto (header.payload.signature)"]);
        setDecoded(null);
        setIsValid(false);
        return;
      }

      // Decodifica header
      let header: Record<string, unknown>;
      try {
        const headerBase64 = parts[0].replace(/-/g, '+').replace(/_/g, '/');
        const headerJson = atob(headerBase64);
        header = JSON.parse(headerJson);
      } catch {
        setErrors(["Erro ao decodificar header: formato inválido"]);
        setDecoded(null);
        setIsValid(false);
        return;
      }

      // Decodifica payload
      let payload: Record<string, unknown>;
      try {
        const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payloadJson = atob(payloadBase64);
        payload = JSON.parse(payloadJson);
      } catch {
        setErrors(["Erro ao decodificar payload: formato inválido"]);
        setDecoded(null);
        setIsValid(false);
        return;
      }

      // Constrói o objeto JWT
      const jwt: Jwt = {
        header,
        payload,
        signature: parts[2]
      };

      // Valida com Zod
      jwtSchema.parse(jwt);
      
      setDecoded(jwt);
      setErrors([]);
      setIsValid(true);
    } catch (e) {
      if (e instanceof ZodError) {
        setErrors(e.errors.map((err) => `${err.path.join(".")} → ${err.message}`));
      } else {
        setErrors(["Erro inesperado ao decodificar JWT"]);
      }
      setDecoded(null);
      setIsValid(false);
    }
  }, [input]);

  const clearInput = useCallback(() => {
    setInput("");
    setDecoded(null);
    setErrors([]);
    setIsValid(false);
  }, []);

  const loadSample = useCallback(() => {
    const sampleJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    setInput(sampleJwt);
  }, []);

  return {
    input,
    setInput,
    decoded,
    errors,
    isValid,
    decodeJwt,
    clearInput,
    loadSample
  };
} 