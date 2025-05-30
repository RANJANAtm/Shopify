/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				// Modern Bluish Color Palette
				primary: {
					50: '#e6f3ff',
					100: '#cce7ff',
					200: '#99cfff',
					300: '#66b7ff',
					400: '#339fff',
					500: '#1E90FF', // Main Dodger Blue
					600: '#1873cc',
					700: '#125699',
					800: '#0c3966',
					900: '#061c33',
				},
				darkBlue: {
					50: '#e8eef5',
					100: '#d1ddeb',
					200: '#a3bbd7',
					300: '#7599c3',
					400: '#4777af',
					500: '#0F2B46', // Main Prussian Blue
					600: '#0c2238',
					700: '#091a2a',
					800: '#06111c',
					900: '#03090e',
				},
				accent: {
					50: '#f0fdff',
					100: '#e0fbff',
					200: '#c1f7ff',
					300: '#a1f3ff',
					400: '#82efff',
					500: '#7FDBFF', // Main Soft Cyan
					600: '#66afcc',
					700: '#4c8399',
					800: '#335866',
					900: '#192c33',
				},
				background: {
					light: '#F8F9FB', // Ghost White
					card: '#FFFFFF', // Pure White
				},
				text: {
					primary: '#2C3E50', // Dark Charcoal
					secondary: '#7A8D9C', // Slate Gray
				},
				success: '#2ECC71', // Emerald Green
				warning: '#FFC107', // Amber
				error: '#FF6347', // Tomato Red
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-up': 'slideUp 0.6s ease-out',
				'slide-down': 'slideDown 0.6s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',
				'bounce-soft': 'bounceSoft 2s infinite',
				'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
				'float': 'float 3s ease-in-out infinite',
				'gradient-x': 'gradient-x 15s ease infinite',
				'gradient-y': 'gradient-y 15s ease infinite',
				'gradient-xy': 'gradient-xy 15s ease infinite',
				'typing-dots': 'typingDots 1.4s infinite ease-in-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideDown: {
					'0%': { transform: 'translateY(-100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				scaleIn: {
					'0%': { transform: 'scale(0.9)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				bounceSoft: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				pulseGlow: {
					'0%': { boxShadow: '0 0 5px rgba(30, 144, 255, 0.5)' },
					'100%': { boxShadow: '0 0 20px rgba(30, 144, 255, 0.8), 0 0 30px rgba(127, 219, 255, 0.3)' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				'gradient-x': {
					'0%, 100%': {
						'background-size': '200% 200%',
						'background-position': 'left center'
					},
					'50%': {
						'background-size': '200% 200%',
						'background-position': 'right center'
					},
				},
				'gradient-y': {
					'0%, 100%': {
						'background-size': '200% 200%',
						'background-position': 'center top'
					},
					'50%': {
						'background-size': '200% 200%',
						'background-position': 'center bottom'
					},
				},
				'gradient-xy': {
					'0%, 100%': {
						'background-size': '400% 400%',
						'background-position': 'left center'
					},
					'50%': {
						'background-size': '400% 400%',
						'background-position': 'right center'
					},
				},
				typingDots: {
					'0%, 60%, 100%': { transform: 'translateY(0)' },
					'30%': { transform: 'translateY(-10px)' },
				},
			},
			backdropBlur: {
				xs: '2px',
			},
			boxShadow: {
				'glow': '0 0 20px rgba(30, 144, 255, 0.3)',
				'glow-lg': '0 0 40px rgba(30, 144, 255, 0.4)',
				'glow-accent': '0 0 20px rgba(127, 219, 255, 0.3)',
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
				'neumorphism': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
				'neumorphism-inset': 'inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff',
				'inner-glow': 'inset 0 2px 4px 0 rgba(30, 144, 255, 0.1)',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'gradient-bluish': 'linear-gradient(135deg, #1E90FF, #7FDBFF)',
				'gradient-dark': 'linear-gradient(135deg, #0F2B46, #1E90FF)',
			},
		},
	},
	plugins: [],
};
