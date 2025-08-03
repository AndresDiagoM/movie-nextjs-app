declare module "next-pwa" {
  import { NextConfig } from "next";

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    sw?: string;
    publicExcludes?: string[];
    buildExcludes?: Array<string | RegExp | ((chunk: any) => boolean)>;
    manifestPath?: string;
    fallbacks?: {
      image?: string;
      document?: string;
      font?: string;
      audio?: string;
      video?: string;
    };
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
    swcMinify?: boolean;
    workboxOptions?: any;
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;

  export default withPWA;
}
