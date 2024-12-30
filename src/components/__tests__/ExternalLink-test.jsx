import { fireEvent, render } from '@testing-library/react-native';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform } from 'react-native';

import ExternalLink from '@/src/components/ExternalLink';

jest.mock('expo-web-browser');
jest.mock('expo-router', () => ({
  Link: jest.fn(({ children, ...props }) => <a {...props}>{children}</a>),
}));

describe('ExternalLink', () => {
  const href = 'https://www.baidu.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should open link in in-app browser on native platforms', () => {
    Platform.OS = 'ios';
    const { getByTestId } = render(<ExternalLink href={href}>Open Link</ExternalLink>);
    const link = getByTestId('link');

    fireEvent.press(link, { preventDefault: jest.fn() });

    expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith(href);
  });

  it('should open link in a new tab on web platform', () => {
    Platform.OS = 'web';
    const { getByTestId } = render(<ExternalLink href={href}>Open Link</ExternalLink>);
    const link = getByTestId('link');

    fireEvent.press(link, { preventDefault: jest.fn() });

    expect(WebBrowser.openBrowserAsync).not.toHaveBeenCalled();
    expect(link.props.href).toBe(href);
    expect(link.props.target).toBe('_blank');
  });
});