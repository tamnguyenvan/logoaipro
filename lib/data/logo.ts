import { type LogoStyle } from "@/types/generation";

export const logoStyles: LogoStyle[] = [
  {
    id: 'neumorphism',
    name: 'Neumorphism',
    // description: 'Clean and simple designs',
    description: '',
    directive: 'Create a clean and simple logo using neumorphism design principles',
    preview: '/images/logo-styles/neumorphism.png'
  },
  {
    id: 'flat',
    name: 'Flat',
    // description: 'Retro and classic feel',
    description: '',
    directive: 'Design a retro and classic logo with flat design elements',
    preview: '/images/logo-styles/flat.png'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    // description: 'Modern and innovative',
    description: '',
    directive: 'Generate a modern and innovative logo using minimal design principles',
    preview: '/images/logo-styles/minimal.png'
  },
  {
    id: 'abstract',
    name: 'Abstract',
    // description: 'Natural and flowing',
    description: '',
    directive: 'Generate a natural and flowing logo using abstract design elements',
    preview: '/images/logo-styles/abstract.png'
  }
];


export const promptExamples = [
  {
    label: "Tech Startup",
    text: "A logo icon features a neural network and a brain symbol. The colors are vibrant and the design is modern and sleek.",
    style: logoStyles[0]
  },
  {
    label: "Eco-friendly",
    text: "An organic, nature-inspired logo for an eco-friendly cosmetics brand. Include leaf elements and earth tones.",
    style: logoStyles[1]
  },
  {
    label: "Creative Agency",
    text: "A bold, artistic logo for a creative design agency. Use vibrant colors and abstract shapes that suggest creativity and innovation.",
    style: logoStyles[2]
  },
  {
    label: "Restaurant",
    text: "An elegant logo for an upscale Italian restaurant. Incorporate subtle culinary elements and a sophisticated color palette.",
    style: logoStyles[3]
  }
];

export const loadingMessages = [
  "Crafting your unique logo...",
  "Unleashing creativity...",
  "Designing something awesome...",
  "Bringing your vision to life...",
  "Generating logo magic...",
  "Mixing colors and shapes...",
  "Transforming your ideas...",
  "Almost there..."
];