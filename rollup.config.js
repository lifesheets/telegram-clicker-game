import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/main.js',
    output: {
        file: 'public/build/bundle.js',
        format: 'iife',
        name: 'app'
    },
    plugins: [
        svelte({
            preprocess: sveltePreprocess(),
            compilerOptions: {
                dev: !production
            }
        }),
        css({ output: 'bundle.css' }), // Плагин для обработки CSS
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),
        production && terser()
    ],
    watch: {
        clearScreen: false
    }
};
