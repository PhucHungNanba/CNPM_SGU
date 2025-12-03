/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily:
            {
                sans: ['Inter', 'sans-serif'], // Font sans-serif mặc định, hoặc thay bằng font bạn thích
                serif: ['Playfair Display', 'serif'], // Font serif, ví dụ Playfair Display
                // Nếu bạn muốn font script: script: ['Great Vibes', 'cursive'],
            },
                },
    },
    plugins: [],
}