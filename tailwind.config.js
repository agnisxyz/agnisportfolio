/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'win95': {
                    'teal': '#008080',
                    'gray': '#c0c0c0',
                    'darkgray': '#808080',
                    'titlebar': '#000080',
                    'titlebar-light': '#1084d0',
                    'white': '#ffffff',
                    'black': '#000000',
                }
            },
            fontFamily: {
                'win95': ['"MS Sans Serif"', '"Perfect DOS VGA 437"', 'Courier New', 'Courier', 'monospace'],
            },
            boxShadow: {
                'win95-raised': 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
                'win95-sunken': 'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080',
                'win95-button': 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
                'win95-button-pressed': 'inset 1px 1px #0a0a0a, inset -1px -1px #ffffff, inset 2px 2px #808080, inset -2px -2px #dfdfdf',
            }
        },
    },
    plugins: [],
}
