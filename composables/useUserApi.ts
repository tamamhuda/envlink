import { useAuthStore, useEnvlink } from "#imports";
import type { UpdateUserRequest, UserInfo } from "~/client";

export function useUserApi() {
  const authStore = useAuthStore();
  const envlink = useEnvlink();

  const setUser = (user: UserInfo) => {
    authStore.setUser(user);
  };

  const update = () => {
    const { execute, response, ...rest } = envlink.user.update();

    const updateUser = async (updateUserRequest: UpdateUserRequest) => {
      const id = authStore.user?.id;
      if (!id) return;
      await execute({ id, updateUserRequest });
      if (response.value) {
        setUser(response.value.data);
      }
    };

    return { updateUser, response, ...rest };
  };

  const getInfo = () => {
    const { execute, response, ...rest } = envlink.user.getInfo();

    const getUserInfo = async () => {
      await execute();
      if (response.value) {
        setUser(response.value.data);
      }
    };

    return { getUserInfo, response, ...rest };
  };

  const uploadAvatar = () => {
    const { execute, response, ...rest } = envlink.user.uploadAvatar();

    const uploadUserAvatar = async (file: File) => {
      await execute({ file });
      if (response.value) {
        setUser(response.value.data);
      }
    };

    return { uploadUserAvatar, ...rest };
  };

  return { update, getInfo, uploadAvatar };
}
