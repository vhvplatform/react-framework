import React from 'react';
import { OAuthProvider, OAuthConfig } from '../types';

/**
 * OAuth Button props
 */
export interface OAuthButtonProps {
  /**
   * OAuth configuration
   */
  config: OAuthConfig;

  /**
   * Button text
   */
  text?: string;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Button style
   */
  style?: React.CSSProperties;
}

/**
 * Get provider display name
 */
function getProviderName(provider: OAuthProvider): string {
  const names: Record<OAuthProvider, string> = {
    google: 'Google',
    github: 'GitHub',
    custom: 'OAuth',
  };
  return names[provider] || 'OAuth';
}

/**
 * Get provider colors
 */
function getProviderColors(provider: OAuthProvider): {
  bg: string;
  hover: string;
  text: string;
} {
  const colors: Record<
    OAuthProvider,
    { bg: string; hover: string; text: string }
  > = {
    google: { bg: '#4285f4', hover: '#357ae8', text: '#fff' },
    github: { bg: '#24292e', hover: '#1b1f23', text: '#fff' },
    custom: { bg: '#6c757d', hover: '#5a6268', text: '#fff' },
  };
  return colors[provider] || colors.custom;
}

/**
 * OAuth Button component
 * Redirects to @longvhv/saas-framework-go OAuth authorization endpoint
 */
export function OAuthButton({ config, text, className = '', style = {} }: OAuthButtonProps) {
  const providerName = getProviderName(config.provider);
  const colors = getProviderColors(config.provider);
  const buttonText = text || `Continue with ${providerName}`;

  const handleClick = () => {
    // Build OAuth URL
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scopes?.join(' ') || '',
      state: Math.random().toString(36).substring(7), // Random state for CSRF protection
    });

    const authUrl = `${config.authUrl}?${params.toString()}`;

    // Redirect to OAuth authorization page
    window.location.href = authUrl;
  };

  const defaultStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '10px 20px',
    backgroundColor: colors.bg,
    color: colors.text,
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ...style,
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      style={defaultStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.bg;
      }}
    >
      {buttonText}
    </button>
  );
}
