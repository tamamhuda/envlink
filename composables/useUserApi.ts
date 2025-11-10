import { useApi, useAuthStore } from "#imports";
import type {
  ErrorResponse,
  UpdateUserRequest,
  UserResponse,
} from "~/interfaces/api.interface";

export function useUserApi() {
  const auth = useAuthStore();

  const setUser = (user: any) => {
    auth.setUser(user);
  };

  const getUser = () => auth.user;

  const useFetchUpdateUser = async (body: UpdateUserRequest) => {
    const id = getUser()?.id;
    const { execute, error } = await useApi<UserResponse, ErrorResponse>(
      `/api/v1/user/${id}`,
      {
        method: "PATCH",
        immediate: false,
        body,
        onResponse: ({ response }) => {
          if (response._data?.data) {
            auth.setUser(response._data.data);
          }
        },
      },
      true,
    );

    return { fetchUpdateUser: execute, error };
  };

  const useFetchUser = async () => {
    const { execute, data, pending, error } = await useApi<
      UserResponse,
      ErrorResponse
    >(
      "/api/v1/user/me",
      {
        method: "GET",
        immediate: false,
        onResponse: ({ response }) => {
          if (response.status === 200 && response._data) {
            setUser(response._data.data);
          }
        },
      },
      true,
    );

    return { fetchUser: execute, data, pending, error };
  };

  return { useFetchUser, useFetchUpdateUser };
}
