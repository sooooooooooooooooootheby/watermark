import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
				compatibilityDate: "2024-11-01",
				devtools: { enabled: true },
				modules: ["shadcn-nuxt", "@nuxt/icon"],

				css: ["~/assets/main.css"],

				vite: {
								plugins: [tailwindcss()],
				},
});