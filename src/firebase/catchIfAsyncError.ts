// export default (errorText: string): void => {
//   throw new Error(errorText)
// } 

type CallbackFunction = () => void;
export default (callback: CallbackFunction) => {
  try {
    return Promise.resolve(callback())
  } catch(error: unknown) {
    if (error instanceof Error) throw new Error(error.message);
  }
} 