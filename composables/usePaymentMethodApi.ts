import { useEnvlink } from "#imports";
import type {
  SortPaymentMethodsRequestInner,
  ValidatePaymentMethodRequest,
} from "~/client";

export function usePaymentMethodApi() {
  const envlink = useEnvlink();

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

  const getById = () => {
    const { execute, ...rest } = envlink.paymentMethods.getById();

    const getPaymentMethodById = async (id: string) => {
      await execute({
        id,
      });
    };

    return { getPaymentMethodById, ...rest };
  };

  const getAll = () => {
    const { execute, ...rest } = envlink.paymentMethods.getAll();

    return { getAllPaymentMethods: execute, ...rest };
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
