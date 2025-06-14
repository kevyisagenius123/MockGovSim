/**
 * Safely calls a function if it exists and is actually a function
 * @param {any} fn - The potential function to call
 * @param {...any} args - Arguments to pass to the function
 * @returns {any} - The result of the function call or undefined
 */
export const safeCall = (fn, ...args) => {
  if (typeof fn === 'function') {
    try {
      return fn(...args);
    } catch (error) {
      console.error('Error calling function:', error);
      return undefined;
    }
  } else {
    console.warn('Expected function but got:', typeof fn, fn);
    return undefined;
  }
};

/**
 * Safely calls an async function if it exists and is actually a function
 * @param {any} fn - The potential async function to call
 * @param {...any} args - Arguments to pass to the function
 * @returns {Promise<any>} - The result of the async function call or undefined
 */
export const safeCallAsync = async (fn, ...args) => {
  if (typeof fn === 'function') {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Error calling async function:', error);
      return undefined;
    }
  } else {
    console.warn('Expected function but got:', typeof fn, fn);
    return undefined;
  }
};

/**
 * Safely accesses a method on an object and calls it
 * @param {object} obj - The object containing the method
 * @param {string} methodName - The name of the method to call
 * @param {...any} args - Arguments to pass to the method
 * @returns {any} - The result of the method call or undefined
 */
export const safeMethodCall = (obj, methodName, ...args) => {
  if (obj && typeof obj === 'object' && typeof obj[methodName] === 'function') {
    try {
      return obj[methodName](...args);
    } catch (error) {
      console.error(`Error calling method ${methodName}:`, error);
      return undefined;
    }
  } else {
    console.warn(`Expected method ${methodName} on object but got:`, typeof obj?.[methodName], obj);
    return undefined;
  }
};

/**
 * Safely maps over an array with a function
 * @param {any} arr - The potential array to map over
 * @param {function} mapFn - The mapping function
 * @returns {array} - The mapped array or empty array
 */
export const safeMap = (arr, mapFn) => {
  if (Array.isArray(arr) && typeof mapFn === 'function') {
    try {
      return arr.map(mapFn);
    } catch (error) {
      console.error('Error in safeMap:', error);
      return [];
    }
  } else {
    console.warn('Expected array and function for safeMap but got:', typeof arr, typeof mapFn);
    return [];
  }
};

export default { safeCall, safeCallAsync, safeMethodCall, safeMap }; 