/// <reference types="vite/client" />

declare module '*.css' {
    const content: string;
    export default content;
  }
  
  declare module '*.svg' {
    const content: string;
    export default content;
  }