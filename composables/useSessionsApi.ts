import {
  navigateTo,
  useAuthStore,
  useEnvlink,
  useSessionsStore,
} from "#imports";

export const useSessionsApi = () => {
  const envlink = useEnvlink();
  const { clearAuth } = useAuthStore();
  const { revokeById: revokeActiveById, revokeAll } = useSessionsStore();

  const getAllActive = () => {
    const { execute, response, ...rest } = envlink.sessions.getAll();

    const getAllActiveSessions = async () => {
      await execute({ isActive: true });
    };
    return { getAllActiveSessions, response, ...rest };
  };

  const revokeById = () => {
    const { execute, error, ...rest } = envlink.sessions.revokeById();

    const revokeSessionById = async (id: string) => {
      await execute({ id });
      if (!error.value) {
        revokeActiveById(id);
      }
    };
    return { revokeSessionById, error, ...rest };
  };

  const revokeAllActive = () => {
    const { execute, error, ...rest } = envlink.sessions.revokeAll();

    const revokeAllActiveSessions = async (keepCurrent: boolean = true) => {
      await execute({ keepCurrent });
      console.log("Revoke all active sessions", keepCurrent);
      if (!error.value) {
        if (!keepCurrent) {
          clearAuth();
          navigateTo("/login");
          return;
        }
        revokeAll(keepCurrent);
      }
    };
    return { revokeAllActiveSessions, error, ...rest };
  };

  return {
    getAllActive,
    revokeById,
    revokeAllActive,
  };
};
