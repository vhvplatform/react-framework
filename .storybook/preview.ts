import type { Preview } from '@storybook/react';
import '../packages/ui-components/src/styles.css'; // Import Tailwind CSS if exists

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a202c',
        },
        {
          name: 'gray',
          value: '#f7fafc',
        },
      ],
    },
  },
};

export default preview;
