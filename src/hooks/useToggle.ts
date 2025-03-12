import { useState, useCallback } from 'react';

/**
 * Custom hook to toggle a boolean state value
 * @param initialValue - Initial state value
 * @returns Tuple containing current state and toggle function
 */
export const useToggle = (initialValue: boolean = false): [boolean, () => void] => {
  const [value, setValue] = useState<boolean>(initialValue);
  
  // Using useCallback to memoize the toggle function
  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);
  
  return [value, toggle];
};

export default useToggle;
