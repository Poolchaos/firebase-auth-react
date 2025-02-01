import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import '@testing-library/jest-dom';

import AppRoutes from '../routes';

describe('Routing Tests', () => {
  test('renders Login page as default route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('navigates to Signup page', () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByText('Signup Page')).toBeInTheDocument();
  });

  test('navigates to Welcome page', () => {
    render(
      <MemoryRouter initialEntries={['/welcome']}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByText('Welcome Page')).toBeInTheDocument();
  });

  test('navigates to Profile page', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByText('Profile Page')).toBeInTheDocument();
  });
});
