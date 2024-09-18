import path from "node:path"
import { fileURLToPath } from 'url';
// import {withNextVideo} from "next-video/process"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: false,
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")]
    }
};

export default nextConfig;
