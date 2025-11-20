import { useEnvlink } from "#imports";
import type {
  CreateBillingAddressRequest,
  UpdateBillingAddressRequest,
} from "~/client";
import { useBillingAddressStore } from "./useBillingAddressStore";

export const useBillingAddressApi = () => {
  const envlink = useEnvlink();
  const { setBillingAddress, addBillingAddress, updateAddress } =
    useBillingAddressStore();

  const getAll = () => {
    const { execute, response, ...rest } = envlink.billingAddress.getAll();

    const getAllBillingAddress = async () => {
      await execute();
      if (response.value) setBillingAddress(response.value.data);
    };

    return {
      getAllBillingAddress,
      ...rest,
    };
  };

  const getById = () => {
    const { execute, response, ...rest } = envlink.billingAddress.getById();

    const getBillingAddressById = async (id: string) => {
      await execute({
        id,
      });
    };

    return {
      getBillingAddressById,
      ...rest,
    };
  };

  const create = () => {
    const { execute, response, ...rest } = envlink.billingAddress.create();

    const createBillingAddress = async (
      createBillingAddressRequest: CreateBillingAddressRequest,
    ) => {
      await execute({
        createBillingAddressRequest,
      });
      if (response.value) addBillingAddress(response.value.data);
    };

    return {
      createBillingAddress,
      response,
      ...rest,
    };
  };

  const update = () => {
    const { execute, response, ...rest } = envlink.billingAddress.update();

    const updateBillingAddress = async (
      id: string,
      updateBillingAddressRequest: UpdateBillingAddressRequest,
    ) => {
      await execute({
        id,
        updateBillingAddressRequest,
      });

      if (response.value) updateAddress(response.value.data);
    };

    return {
      updateBillingAddress,
      response,
      ...rest,
    };
  };

  return {
    getAll,
    create,
    update,
    getById,
  };
};
