import { useMutation } from "@tanstack/react-query";

/**
 * Helper for use mutation
 * https://tanstack.com/query/v5/docs/framework/react/reference/useMutation
 * @param {function} mutationFn - Function call API
 * @param {object} options - other options like onSuccess, onError (read the docs! 🥐)
 */
export function useAppMutation(mutationFn, options = {}) {
  return useMutation({
    mutationFn,
    ...options,
  });
}