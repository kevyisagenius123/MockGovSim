/**
 * Safely calls a function if it exists and is actually a function
 * @param {any} fn - The potential function to call
 * @param {...any} args - Arguments to pass to the function
 * @returns {any} - The result of the function call or undefined
 */
export const safeCall = (fn, ...args) => {
  try {
    if (typeof fn === 'function') {
      return fn(...args);
    } else if (fn !== null && fn !== undefined) {
      console.warn('Expected function but got:', typeof fn, fn);
    }
    return undefined;
  } catch (error) {
    console.error('Error in safeCall:', error);
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
  try {
    if (typeof fn === 'function') {
      return await fn(...args);
    } else if (fn !== null && fn !== undefined) {
      console.warn('Expected async function but got:', typeof fn, fn);
    }
    return undefined;
  } catch (error) {
    console.error('Error in safeCallAsync:', error);
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
  try {
    if (obj && typeof obj === 'object' && typeof obj[methodName] === 'function') {
      return obj[methodName](...args);
    } else if (obj && methodName) {
      console.warn(`Expected method ${methodName} on object but got:`, typeof obj?.[methodName], obj);
    }
    return undefined;
  } catch (error) {
    console.error(`Error calling method ${methodName}:`, error);
    return undefined;
  }
};

/**
 * Safely accesses a property on an object
 * @param {object} obj - The object containing the property
 * @param {string} propName - The name of the property to access
 * @param {any} defaultValue - Default value to return if property doesn't exist
 * @returns {any} - The property value or default value
 */
export const safeProp = (obj, propName, defaultValue = undefined) => {
  try {
    if (obj && typeof obj === 'object' && propName in obj) {
      return obj[propName];
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error accessing property ${propName}:`, error);
    return defaultValue;
  }
};

/**
 * Safely executes a callback with error handling
 * @param {function} callback - The callback function to execute
 * @param {any} fallback - Fallback value if callback fails
 * @returns {any} - The result of the callback or fallback value
 */
export const safeExecute = (callback, fallback = null) => {
  try {
    if (typeof callback === 'function') {
      return callback();
    }
    return fallback;
  } catch (error) {
    console.error('Error in safeExecute:', error);
    return fallback;
  }
};

/**
 * Safely renders a React component or element
 * @param {any} component - The component or element to render
 * @param {any} fallback - Fallback to render if component fails
 * @returns {any} - The component or fallback
 */
export const safeRender = (component, fallback = null) => {
  try {
    if (component === null || component === undefined) {
      return fallback;
    }
    return component;
  } catch (error) {
    console.error('Error in safeRender:', error);
    return fallback;
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