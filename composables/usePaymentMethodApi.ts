import { useEnvlink, usePaymentMethodStore } from "#imports";
import type {
  SortPaymentMethodsRequestInner,
  ValidatePaymentMethodRequest,
} from "~/client";

export function usePaymentMethodApi() {
  const envlink = useEnvlink();
  const { setPaymentMethods } = usePaymentMethodStore();

  const validate = () => {
    const { execute, ...rest } = envlink.paymentMethods.validate();

    const validatePaymentMethod = async (
      validatePaymentMethodRequest: ValidatePaymentMethodRequest,
    ) => {
      await execute({
        validatePaymentMethodRequest,
      });
    };

    return { validatePaymentMethod, ...rest };
  };

  const getAll = () => {
    const { execute, response, ...rest } = envlink.paymentMethods.getAll();

    const getAllPaymentMethods = async () => {
      await execute();
      if (response.value) {
        setPaymentMethods(response.value.data);
      }
    };

    return { getAllPaymentMethods, ...rest };
  };

  const getById = () => {
    const { execute, ...rest } = envlink.paymentMethods.getById();

    const getPaymentMethodById = async (id: string) => {
      await execute({
        id,
      });
    };

    return { getPaymentMethodById, ...rest };
  };

  const sort = () => {
    const { execute, ...rest } = envlink.paymentMethods.sort();

    const sortPaymentMethods = async (
      sortPaymentMethodsRequestInner: SortPaymentMethodsRequestInner[],
    ) => {
      await execute({ sortPaymentMethodsRequestInner });
    };

    return { sortPaymentMethods, ...rest };
  };

  return {
    validate,
    getById,
    sort,
    getAll,
  };
}
