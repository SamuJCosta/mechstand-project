export async function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("accessToken");
  
    // Adicionar o token ao cabeçalho da requisição
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  
    try {
      // Fazer a requisição com o token atual
      const response = await fetch(url, { ...options, headers });
  
      // Se o token expirou, tentar renovar
      if (response.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
  
        // Tentar renovar o token
        const refreshResponse = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
  
        if (refreshResponse.ok) {
          const { accessToken: newAccessToken } = await refreshResponse.json();
          localStorage.setItem("accessToken", newAccessToken);
  
          // Repetir a requisição original com o novo token
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${newAccessToken}`,
          };
          return fetch(url, { ...options, headers: retryHeaders });
        } else {
          throw new Error("Sessão expirada. Faça login novamente.");
        }
      }
  
      return response;
    } catch (error) {
      console.error("Erro na requisição autenticada:", error);
      throw error;
    }
  }