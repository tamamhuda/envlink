import { useEnvlink } from "#imports";

export const useTransactionsApi = () => {
  const envlink = useEnvlink();

  const getAll = () => {
    const { execute, response, ...rest } = envlink.transactions.getAll();

    const getAllTransactions = async () => {
      await execute();
    };
    return { getAllTransactions, response, ...rest };
  };

  const getById = () => {
    const { execute, response, ...rest } = envlink.transactions.getById();

    const getTransactionById = async (id: string) => {
      await execute({ id });
      if (response.value) {
        console.log(response.value);
      }
    };
    return { getTransactionById, response, ...rest };
  };

  return {
    getAll,
    getById,
  };
};
